import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"
import { ItemCondition as PrismaItemCondition, Prisma, PrismaClient } from "@prisma/client"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, parse } from "node:path"
import { syncPartsFromDatabase } from "../../scripts/partsSyncCore"

function loadSingleEnvFile(filePath: string): void {
    const content = readFileSync(filePath, "utf8")
    const lines = content.split(/\r?\n/)

    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) {
            continue
        }

        const equalsIndex = trimmed.indexOf("=")
        if (equalsIndex <= 0) {
            continue
        }

        const key = trimmed.slice(0, equalsIndex).trim()
        if (!key || process.env[key] !== undefined) {
            continue
        }

        let value = trimmed.slice(equalsIndex + 1).trim()
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
        }

        process.env[key] = value
    }
}

function loadFunctionEnv(): void {
    const mode = process.env.NODE_ENV ?? "development"
    const envFiles = [`.env.${mode}.local`, `.env.${mode}`, ".env.local", ".env"]

    const candidateRoots = new Set<string>()
    for (const seed of [process.cwd(), process.env.INIT_CWD, process.env.PWD, __dirname, dirname(__filename)]) {
        if (!seed) {
            continue
        }

        let current = seed
        const pathRoot = parse(seed).root
        while (current && !candidateRoots.has(current)) {
            candidateRoots.add(current)
            if (current === pathRoot) {
                break
            }

            current = dirname(current)
        }
    }

    for (const root of candidateRoots) {
        for (const fileName of envFiles) {
            const fullPath = join(root, fileName)
            if (existsSync(fullPath)) {
                loadSingleEnvFile(fullPath)
            }

            if (process.env.DATABASE_URL) {
                return
            }
        }
    }
}

loadFunctionEnv()

const databaseUrl = process.env.DATABASE_URL

type AdminPartPayload = {
    id?: number
    title: string
    imageSrc: string | string[]
    fabricationMethod: FabricationMethod[]
    typeOfPart: PartType[]
    platform: PlatformType[]
    externalUrl?: string
    dropboxUrl?: string
    dropboxZipLastUpdated?: string
}

type AdminResourcePayload = {
    id?: number
    title: string
    typeOfResource: ResourceType[]
    externalUrl?: string
    appStoreLink?: string
    playStoreLink?: string
    description?: string
}

type AdminShopPayload = {
    id?: number
    title: string
    typeOfPart: PartShopType[]
    platform: PlatformType[]
    availableCount: number
    price: number
    condition: ItemCondition
    imageSrc?: string | string[]
    description?: string
    externalUrl?: string
    featured?: boolean
}

type AdminPostBody =
    | { entity: "parts"; action: "create"; item: AdminPartPayload }
    | { entity: "parts"; action: "update"; item: AdminPartPayload }
    | { entity: "parts"; action: "delete"; id: number }
    | { entity: "resources"; action: "create"; item: AdminResourcePayload }
    | { entity: "resources"; action: "update"; item: AdminResourcePayload }
    | { entity: "resources"; action: "delete"; id: number }
    | { entity: "shop"; action: "create"; item: AdminShopPayload }
    | { entity: "shop"; action: "update"; item: AdminShopPayload }
    | { entity: "shop"; action: "delete"; id: number }

type BuildTriggerResult = {
    attempted: boolean
    ok: boolean
    message: string
}

const prisma = new PrismaClient(
    databaseUrl
        ? {
              datasources: {
                  db: {
                      url: databaseUrl
                  }
              }
          }
        : undefined
)

function assertDevOnly(res: GatsbyFunctionResponse): boolean {
    if (process.env.NODE_ENV !== "development") {
        res.status(403).json({ error: "This endpoint is only available in development." })
        return false
    }

    return true
}

function toDateOnly(value?: string): Date | null {
    if (!value) {
        return null
    }

    const parsed = new Date(`${value}T00:00:00.000Z`)
    if (Number.isNaN(parsed.getTime())) {
        return null
    }

    return parsed
}

function normalizeImageList(value?: string | string[]): string[] {
    if (!value) {
        return []
    }

    const list = Array.isArray(value) ? value : [value]
    return list.map((entry) => entry.trim()).filter(Boolean)
}

async function triggerProductionBuild(reason: string): Promise<BuildTriggerResult> {
    const hookUrl = process.env.NETLIFY_BUILD_HOOK_URL?.trim()

    if (!hookUrl) {
        return {
            attempted: false,
            ok: false,
            message: "Production build hook not configured."
        }
    }

    try {
        const response = await fetch(hookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                triggerTitle: `Admin update: ${reason}`
            })
        })

        if (!response.ok) {
            return {
                attempted: true,
                ok: false,
                message: `Build hook failed with status ${response.status}.`
            }
        }

        return {
            attempted: true,
            ok: true,
            message: "Production rebuild triggered."
        }
    } catch (error) {
        return {
            attempted: true,
            ok: false,
            message: error instanceof Error ? `Build hook request failed: ${error.message}` : "Build hook request failed."
        }
    }
}

function toConditionLabel(value: PrismaItemCondition): ItemCondition {
    if (value === PrismaItemCondition.LikeNew) {
        return "Like New"
    }

    if (value === PrismaItemCondition.ForParts) {
        return "For Parts"
    }

    if (value === PrismaItemCondition.Used) {
        return "Used"
    }

    return "New"
}

function toPrismaCondition(value: ItemCondition): PrismaItemCondition {
    if (value === "Like New") {
        return PrismaItemCondition.LikeNew
    }

    if (value === "For Parts") {
        return PrismaItemCondition.ForParts
    }

    if (value === "Used") {
        return PrismaItemCondition.Used
    }

    return PrismaItemCondition.New
}

function toDateString(value?: Date | null): string | undefined {
    return value ? value.toISOString().slice(0, 10) : undefined
}

async function upsertPlatformId(tx: Prisma.TransactionClient, name: PlatformType): Promise<number> {
    const row = await tx.platform.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true }
    })

    return row.id
}

async function upsertPartTypeId(tx: Prisma.TransactionClient, name: PartShopType | PartType): Promise<number> {
    const row = await tx.partType.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true }
    })

    return row.id
}

async function upsertFabricationMethodId(tx: Prisma.TransactionClient, name: FabricationMethod): Promise<number> {
    const row = await tx.fabricationMethod.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true }
    })

    return row.id
}

async function upsertResourceTypeId(tx: Prisma.TransactionClient, name: ResourceType): Promise<number> {
    const row = await tx.resourceTypeLookup.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true }
    })

    return row.id
}

async function hydratePartRelations(tx: Prisma.TransactionClient, partId: number, part: AdminPartPayload): Promise<void> {
    const imageList = normalizeImageList(part.imageSrc)

    await tx.partsCatalogImage.deleteMany({ where: { partId } })
    await tx.partsCatalogPlatform.deleteMany({ where: { partId } })
    await tx.partsCatalogType.deleteMany({ where: { partId } })
    await tx.partsCatalogFabricationMethod.deleteMany({ where: { partId } })

    for (const [sortOrder, image] of imageList.entries()) {
        await tx.partsCatalogImage.create({
            data: {
                partId,
                imageSrc: image,
                sortOrder
            }
        })
    }

    for (const platformName of part.platform) {
        const platformId = await upsertPlatformId(tx, platformName)
        await tx.partsCatalogPlatform.create({ data: { partId, platformId } })
    }

    for (const partTypeName of part.typeOfPart) {
        const partTypeId = await upsertPartTypeId(tx, partTypeName)
        await tx.partsCatalogType.create({ data: { partId, partTypeId } })
    }

    for (const fabricationName of part.fabricationMethod) {
        const fabricationMethodId = await upsertFabricationMethodId(tx, fabricationName)
        await tx.partsCatalogFabricationMethod.create({
            data: {
                partId,
                fabricationMethodId
            }
        })
    }
}

async function hydrateShopRelations(tx: Prisma.TransactionClient, shopItemId: number, item: AdminShopPayload): Promise<void> {
    const imageList = normalizeImageList(item.imageSrc)

    await tx.shopItemImage.deleteMany({ where: { shopItemId } })
    await tx.shopItemPlatform.deleteMany({ where: { shopItemId } })
    await tx.shopItemType.deleteMany({ where: { shopItemId } })

    for (const [sortOrder, image] of imageList.entries()) {
        await tx.shopItemImage.create({
            data: {
                shopItemId,
                imageSrc: image,
                sortOrder
            }
        })
    }

    for (const platformName of item.platform) {
        const platformId = await upsertPlatformId(tx, platformName)
        await tx.shopItemPlatform.create({ data: { shopItemId, platformId } })
    }

    for (const partTypeName of item.typeOfPart) {
        const partTypeId = await upsertPartTypeId(tx, partTypeName)
        await tx.shopItemType.create({ data: { shopItemId, partTypeId } })
    }
}

async function hydrateResourceRelations(tx: Prisma.TransactionClient, resourceId: number, item: AdminResourcePayload): Promise<void> {
    await tx.resourceTypeRelation.deleteMany({ where: { resourceId } })

    for (const resourceTypeName of item.typeOfResource) {
        const resourceTypeId = await upsertResourceTypeId(tx, resourceTypeName)
        await tx.resourceTypeRelation.create({
            data: {
                resourceId,
                resourceTypeId
            }
        })
    }
}

async function fetchAllData(): Promise<{
    parts: Array<ItemData & { id: number }>
    resources: Array<ResourceData & { id: number }>
    shopItems: Array<PartsShopData & { id: number }>
}> {
    const [partsRows, resourceRows, shopRows] = await Promise.all([
        prisma.partsCatalog.findMany({
            include: {
                images: { orderBy: { sortOrder: "asc" } },
                platforms: { include: { platform: true } },
                partTypes: { include: { partType: true } },
                fabricationMethods: { include: { fabricationMethod: true } }
            },
            orderBy: { title: "asc" }
        }),
        prisma.resource.findMany({
            include: { resourceTypes: { include: { resourceType: true } } },
            orderBy: { title: "asc" }
        }),
        prisma.shopItem.findMany({
            include: {
                images: { orderBy: { sortOrder: "asc" } },
                platforms: { include: { platform: true } },
                partTypes: { include: { partType: true } }
            },
            orderBy: { title: "asc" }
        })
    ])

    const parts = partsRows.map((part) => {
        const orderedImages = part.images.map((image) => image.imageSrc)
        const imageSrc = orderedImages.length > 1 ? orderedImages : (orderedImages[0] ?? part.imageSrc)

        return {
            id: part.id,
            title: part.title,
            imageSrc,
            fabricationMethod: part.fabricationMethods.map((entry) => entry.fabricationMethod.name as FabricationMethod),
            typeOfPart: part.partTypes.map((entry) => entry.partType.name as PartType),
            platform: part.platforms.map((entry) => entry.platform.name as PlatformType),
            externalUrl: part.externalUrl ?? undefined,
            dropboxUrl: part.dropboxUrl ?? undefined,
            dropboxZipLastUpdated: toDateString(part.dropboxZipLastUpdated)
        }
    })

    const resources = resourceRows.map((resource) => ({
        id: resource.id,
        title: resource.title,
        typeOfResource: resource.resourceTypes.map((entry) => entry.resourceType.name as ResourceType),
        externalUrl: resource.externalUrl ?? undefined,
        appStoreLink: resource.appStoreLink ?? undefined,
        playStoreLink: resource.playStoreLink ?? undefined,
        description: resource.description ?? undefined
    }))

    const shopItems = shopRows.map((item) => {
        const orderedImages = item.images.map((image) => image.imageSrc)
        const imageSrc = orderedImages.length > 1 ? orderedImages : orderedImages[0]

        return {
            id: item.id,
            title: item.title,
            typeOfPart: item.partTypes.map((entry) => entry.partType.name as PartShopType),
            platform: item.platforms.map((entry) => entry.platform.name as PlatformType),
            availableCount: item.availableCount,
            price: Number(item.price),
            condition: toConditionLabel(item.itemCondition),
            imageSrc,
            description: item.descriptionHtml ?? undefined,
            externalUrl: item.externalUrl ?? undefined,
            featured: item.featured || undefined
        }
    })

    return { parts, resources, shopItems }
}

export default async function handler(req: GatsbyFunctionRequest, res: GatsbyFunctionResponse): Promise<void> {
    if (!assertDevOnly(res)) {
        return
    }

    if (req.method === "GET") {
        res.status(200).json(await fetchAllData())
        return
    }

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed." })
        return
    }

    let body: any
    try {
        body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body)
    } catch {
        res.status(400).json({ error: "Invalid JSON body." })
        return
    }

    // Explicit build trigger action
    if (body?.action === "triggerBuildHook") {
        const buildTrigger = await triggerProductionBuild(body.reason || "manual-admin-trigger")
        res.status(200).json({ buildTrigger })
        return
    }

    // Normal DB mutations
    if (!body?.entity || !body?.action) {
        res.status(400).json({ error: "Missing entity or action." })
        return
    }

    if (body.action === "delete") {
        if (body.entity === "parts") {
            await prisma.partsCatalog.delete({ where: { id: body.id } })
        }

        if (body.entity === "resources") {
            await prisma.resource.delete({ where: { id: body.id } })
        }

        if (body.entity === "shop") {
            await prisma.shopItem.delete({ where: { id: body.id } })
        }
    } else if (body.entity === "parts") {
        const item = body.item
        const imageList = normalizeImageList(item.imageSrc)
        if (!item?.title || !imageList.length) {
            res.status(400).json({ error: "Part title and at least one image are required." })
            return
        }

        await prisma.$transaction(async (tx) => {
            if (body.action === "create") {
                const created = await tx.partsCatalog.create({
                    data: {
                        title: item.title,
                        imageSrc: imageList[0],
                        externalUrl: item.externalUrl ?? null,
                        dropboxUrl: item.dropboxUrl ?? null,
                        dropboxZipLastUpdated: toDateOnly(item.dropboxZipLastUpdated)
                    },
                    select: { id: true }
                })

                await hydratePartRelations(tx, created.id, item)
                return
            }

            if (!item.id) {
                throw new Error("Missing part id for update action.")
            }

            await tx.partsCatalog.update({
                where: { id: item.id },
                data: {
                    title: item.title,
                    imageSrc: imageList[0],
                    externalUrl: item.externalUrl ?? null,
                    dropboxUrl: item.dropboxUrl ?? null,
                    dropboxZipLastUpdated: toDateOnly(item.dropboxZipLastUpdated)
                }
            })

            await hydratePartRelations(tx, item.id, item)
        }, {
            maxWait: 20_000,
            timeout: 120_000
        })
    } else if (body.entity === "resources") {
        const item = body.item
        if (!item?.title) {
            res.status(400).json({ error: "Resource title is required." })
            return
        }

        await prisma.$transaction(async (tx) => {
            if (body.action === "create") {
                const created = await tx.resource.create({
                    data: {
                        title: item.title,
                        externalUrl: item.externalUrl ?? null,
                        appStoreLink: item.appStoreLink ?? null,
                        playStoreLink: item.playStoreLink ?? null,
                        description: item.description ?? null
                    },
                    select: { id: true }
                })

                await hydrateResourceRelations(tx, created.id, item)
                return
            }

            if (!item.id) {
                throw new Error("Missing resource id for update action.")
            }

            await tx.resource.update({
                where: { id: item.id },
                data: {
                    title: item.title,
                    externalUrl: item.externalUrl ?? null,
                    appStoreLink: item.appStoreLink ?? null,
                    playStoreLink: item.playStoreLink ?? null,
                    description: item.description ?? null
                }
            })

            await hydrateResourceRelations(tx, item.id, item)
        }, {
            maxWait: 20_000,
            timeout: 120_000
        })
    } else if (body.entity === "shop") {
        const item = body.item
        if (!item?.title) {
            res.status(400).json({ error: "Shop item title is required." })
            return
        }

        await prisma.$transaction(async (tx) => {
            if (body.action === "create") {
                const created = await tx.shopItem.create({
                    data: {
                        title: item.title,
                        availableCount: Math.max(0, Number(item.availableCount) || 0),
                        price: new Prisma.Decimal(Number(item.price) || 0),
                        itemCondition: toPrismaCondition(item.condition),
                        descriptionHtml: item.description ?? null,
                        externalUrl: item.externalUrl ?? null,
                        featured: !!item.featured
                    },
                    select: { id: true }
                })

                await hydrateShopRelations(tx, created.id, item)
                return
            }

            if (!item.id) {
                throw new Error("Missing shop item id for update action.")
            }

            await tx.shopItem.update({
                where: { id: item.id },
                data: {
                    title: item.title,
                    availableCount: Math.max(0, Number(item.availableCount) || 0),
                    price: new Prisma.Decimal(Number(item.price) || 0),
                    itemCondition: toPrismaCondition(item.condition),
                    descriptionHtml: item.description ?? null,
                    externalUrl: item.externalUrl ?? null,
                    featured: !!item.featured
                }
            })

            await hydrateShopRelations(tx, item.id, item)
        }, {
            maxWait: 20_000,
            timeout: 120_000
        })
    }

    const syncReason = `admin-db-${body.entity}-${body.action}`
    await syncPartsFromDatabase({ reason: syncReason })

    res.status(200).json({
        ok: true,
        ...(await fetchAllData())
    })
}