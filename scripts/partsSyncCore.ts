import { ItemCondition as PrismaItemCondition, PrismaClient } from "@prisma/client"
import { writeLocalSnapshots } from "./partsSnapshotFiles"

export type PartsSyncOptions = {
    reason?: string
}

export type PartsSyncResult = {
    catalogCount: number
    shopCount: number
    resourcesCount: number
    reason: string
    startedAt: Date
    finishedAt: Date
    durationMs: number
}

function toConditionLabel(value: PrismaItemCondition): PartsShopData["condition"] {
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

function toDateString(value?: Date | null): string | undefined {
    return value ? value.toISOString().slice(0, 10) : undefined
}

function mapCatalogImage(images: Array<{ imageSrc: string }>, fallback: string): string | string[] {
    const orderedImages = images.map((image) => image.imageSrc)

    if (!orderedImages.length) {
        return fallback
    }

    return orderedImages.length === 1 ? orderedImages[0] : orderedImages
}

function mapShopImage(images: Array<{ imageSrc: string }>): string | string[] | undefined {
    const orderedImages = images.map((image) => image.imageSrc)

    if (!orderedImages.length) {
        return undefined
    }

    return orderedImages.length === 1 ? orderedImages[0] : orderedImages
}

export async function syncPartsFromDatabase(options: PartsSyncOptions = {}): Promise<PartsSyncResult> {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        throw new Error("Missing DATABASE_URL in environment.")
    }

    const reason = options.reason ?? "manual-sync"
    const startedAt = new Date()
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl
            }
        }
    })

    let catalogParts: ItemData[] = []
    let shopItems: PartsShopData[] = []
    let resources: ResourceData[] = []

    try {
        const [catalogRows, shopRows, resourceRows] = await Promise.all([
            prisma.partsCatalog.findMany({
                include: {
                    images: { orderBy: { sortOrder: "asc" } },
                    platforms: { include: { platform: true } },
                    partTypes: { include: { partType: true } },
                    fabricationMethods: { include: { fabricationMethod: true } }
                },
                orderBy: { title: "asc" }
            }),
            prisma.shopItem.findMany({
                include: {
                    images: { orderBy: { sortOrder: "asc" } },
                    platforms: { include: { platform: true } },
                    partTypes: { include: { partType: true } }
                },
                orderBy: { title: "asc" }
            }),
            prisma.resource.findMany({
                include: {
                    resourceTypes: { include: { resourceType: true } }
                },
                orderBy: { title: "asc" }
            })
        ])

        catalogParts = catalogRows.map((part) => ({
            title: part.title,
            fabricationMethod: part.fabricationMethods.map((item) => item.fabricationMethod.name as FabricationMethod),
            typeOfPart: part.partTypes.map((item) => item.partType.name as PartType),
            imageSrc: mapCatalogImage(part.images, part.imageSrc),
            platform: part.platforms.map((item) => item.platform.name as PlatformType),
            externalUrl: part.externalUrl ?? undefined,
            dropboxUrl: part.dropboxUrl ?? undefined,
            dropboxZipLastUpdated: toDateString(part.dropboxZipLastUpdated)
        }))

        shopItems = shopRows.map((item) => ({
            title: item.title,
            typeOfPart: item.partTypes.map((partType) => partType.partType.name as PartShopType),
            platform: item.platforms.map((platform) => platform.platform.name as PlatformType),
            availableCount: item.availableCount,
            price: Number(item.price),
            condition: toConditionLabel(item.itemCondition),
            imageSrc: mapShopImage(item.images),
            description: item.descriptionHtml ?? undefined,
            externalUrl: item.externalUrl ?? undefined,
            featured: item.featured || undefined
        }))

        resources = resourceRows.map((resource) => ({
            title: resource.title,
            typeOfResource: resource.resourceTypes.map((entry) => entry.resourceType.name as ResourceType),
            externalUrl: resource.externalUrl ?? undefined,
            appStoreLink: resource.appStoreLink ?? undefined,
            playStoreLink: resource.playStoreLink ?? undefined,
            description: resource.description ?? undefined
        }))
    } finally {
        await prisma.$disconnect()
    }

    const finishedAt = new Date()
    await writeLocalSnapshots(catalogParts, shopItems, resources)

    return {
        catalogCount: catalogParts.length,
        shopCount: shopItems.length,
        resourcesCount: resources.length,
        reason,
        startedAt,
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime()
    }
}
