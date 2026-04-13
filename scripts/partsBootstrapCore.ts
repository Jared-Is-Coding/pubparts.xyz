import { ItemCondition as PrismaItemCondition, Prisma, PrismaClient } from "@prisma/client"
import allParts from "../src/util/parts"
import allPartsShopItems from "../src/util/partsShop"
import allResources from "../src/util/resources"
import { writeLocalSnapshots } from "./partsSnapshotFiles"

export type PartsBootstrapResult = {
    catalogCount: number
    shopCount: number
    resourcesCount: number
    startedAt: Date
    finishedAt: Date
    durationMs: number
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

function toConditionEnum(value: PartsShopData["condition"]): PrismaItemCondition {
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

async function upsertPlatformId(tx: Prisma.TransactionClient, name: string): Promise<number> {
    const row = await tx.platform.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true }
    })

    return row.id
}

async function upsertPartTypeId(tx: Prisma.TransactionClient, name: string): Promise<number> {
    const row = await tx.partType.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true }
    })

    return row.id
}

async function upsertFabricationMethodId(tx: Prisma.TransactionClient, name: string): Promise<number> {
    const row = await tx.fabricationMethod.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true }
    })

    return row.id
}

async function upsertResourceTypeId(tx: Prisma.TransactionClient, name: string): Promise<number> {
    const row = await tx.resourceTypeLookup.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true }
    })

    return row.id
}

async function importCatalogParts(tx: Prisma.TransactionClient, parts: ItemData[]): Promise<void> {
    for (const part of parts) {
        const images = Array.isArray(part.imageSrc) ? part.imageSrc : [part.imageSrc]
        const primaryImage = images[0] ?? ""

        const inserted = await tx.partsCatalog.create({
            data: {
                title: part.title,
                imageSrc: primaryImage,
                externalUrl: part.externalUrl ?? null,
                dropboxUrl: part.dropboxUrl ?? null,
                dropboxZipLastUpdated: toDateOnly(part.dropboxZipLastUpdated)
            },
            select: { id: true }
        })

        for (const [sortOrder, image] of images.entries()) {
            await tx.partsCatalogImage.create({
                data: {
                    partId: inserted.id,
                    imageSrc: image,
                    sortOrder
                }
            })
        }

        for (const platformName of part.platform) {
            const platformId = await upsertPlatformId(tx, platformName)
            await tx.partsCatalogPlatform.create({
                data: {
                    partId: inserted.id,
                    platformId
                }
            })
        }

        for (const typeName of part.typeOfPart) {
            const partTypeId = await upsertPartTypeId(tx, typeName)
            await tx.partsCatalogType.create({
                data: {
                    partId: inserted.id,
                    partTypeId
                }
            })
        }

        for (const fabricationName of part.fabricationMethod) {
            const fabricationMethodId = await upsertFabricationMethodId(tx, fabricationName)
            await tx.partsCatalogFabricationMethod.create({
                data: {
                    partId: inserted.id,
                    fabricationMethodId
                }
            })
        }
    }
}

async function importShopItems(tx: Prisma.TransactionClient, shopItems: PartsShopData[]): Promise<void> {
    for (const item of shopItems) {
        const inserted = await tx.shopItem.create({
            data: {
                title: item.title,
                availableCount: item.availableCount,
                price: item.price,
                itemCondition: toConditionEnum(item.condition),
                descriptionHtml: item.description ?? null,
                externalUrl: item.externalUrl ?? null,
                featured: item.featured ?? false
            },
            select: { id: true }
        })

        const images = Array.isArray(item.imageSrc) ? item.imageSrc : (item.imageSrc ? [item.imageSrc] : [])

        for (const [sortOrder, image] of images.entries()) {
            await tx.shopItemImage.create({
                data: {
                    shopItemId: inserted.id,
                    imageSrc: image,
                    sortOrder
                }
            })
        }

        for (const platformName of item.platform) {
            const platformId = await upsertPlatformId(tx, platformName)
            await tx.shopItemPlatform.create({
                data: {
                    shopItemId: inserted.id,
                    platformId
                }
            })
        }

        for (const typeName of item.typeOfPart) {
            const partTypeId = await upsertPartTypeId(tx, typeName)
            await tx.shopItemType.create({
                data: {
                    shopItemId: inserted.id,
                    partTypeId
                }
            })
        }
    }
}

async function importResources(tx: Prisma.TransactionClient, resources: ResourceData[]): Promise<void> {
    for (const resource of resources) {
        const inserted = await tx.resource.create({
            data: {
                title: resource.title,
                externalUrl: resource.externalUrl ?? null,
                appStoreLink: resource.appStoreLink ?? null,
                playStoreLink: resource.playStoreLink ?? null,
                description: resource.description ?? null
            },
            select: { id: true }
        })

        for (const resourceTypeName of resource.typeOfResource) {
            const resourceTypeId = await upsertResourceTypeId(tx, resourceTypeName)
            await tx.resourceTypeRelation.create({
                data: {
                    resourceId: inserted.id,
                    resourceTypeId
                }
            })
        }
    }
}

export async function bootstrapPartsDatabase(): Promise<PartsBootstrapResult> {
    if (!process.env.DATABASE_URL) {
        throw new Error("Missing DATABASE_URL in environment.")
    }

    const prisma = new PrismaClient()
    const startedAt = new Date()

    try {
        await prisma.$transaction(async (tx) => {
            await tx.$executeRawUnsafe("TRUNCATE TABLE parts_catalog, shop_items, resources, platforms, part_types, resource_types, fabrication_methods, sync_state RESTART IDENTITY CASCADE")
            await importCatalogParts(tx, allParts as ItemData[])
            await importShopItems(tx, allPartsShopItems as PartsShopData[])
            await importResources(tx, allResources as ResourceData[])
        }, {
            maxWait: 20_000,
            timeout: 600_000
        })
    } finally {
        await prisma.$disconnect()
    }

    await writeLocalSnapshots(allParts as ItemData[], allPartsShopItems as PartsShopData[], allResources as ResourceData[])
    const finishedAt = new Date()

    return {
        catalogCount: allParts.length,
        shopCount: allPartsShopItems.length,
        resourcesCount: allResources.length,
        startedAt,
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime()
    }
}
