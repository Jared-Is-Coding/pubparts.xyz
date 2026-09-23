import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function migrateResourceTypes() {
	console.log("[migrate] Starting resource types migration...")

	await prisma.$transaction(async (tx) => {
		// Helper to reassign relations and delete old type
		async function migrateType(oldName: string, newName: string) {
			const oldType = await tx.resourceTypeLookup.findUnique({
				where: { name: oldName },
			})

			const newType = await tx.resourceTypeLookup.upsert({
				where: { name: newName },
				update: {},
				create: { name: newName },
			})

			if (!oldType) {
				console.log(
					`[migrate] Old resource type "${oldName}" not found in database. Skipping migration for it.`,
				)
				return
			}

			if (oldType.id === newType.id) {
				console.log(`[migrate] Resource type "${oldName}" already matches "${newName}".`)
				return
			}

			// Get all relations pointing to oldType
			const relations = await tx.resourceTypeRelation.findMany({
				where: { resourceTypeId: oldType.id },
			})

			console.log(
				`[migrate] Moving ${relations.length} relations from "${oldName}" (ID ${oldType.id}) to "${newName}" (ID ${newType.id})...`,
			)

			for (const rel of relations) {
				// Check if the resource already has the newType relation
				const existing = await tx.resourceTypeRelation.findUnique({
					where: {
						resourceId_resourceTypeId: {
							resourceId: rel.resourceId,
							resourceTypeId: newType.id,
						},
					},
				})

				if (existing) {
					// Delete the old relation to prevent duplicate key error
					await tx.resourceTypeRelation.delete({
						where: {
							resourceId_resourceTypeId: {
								resourceId: rel.resourceId,
								resourceTypeId: oldType.id,
							},
						},
					})
				} else {
					// Update old relation to newTypeId
					await tx.resourceTypeRelation.update({
						where: {
							resourceId_resourceTypeId: {
								resourceId: rel.resourceId,
								resourceTypeId: oldType.id,
							},
						},
						data: {
							resourceTypeId: newType.id,
						},
					})
				}
			}

			// Now safe to delete oldType lookup
			await tx.resourceTypeLookup.delete({
				where: { id: oldType.id },
			})
			console.log(`[migrate] Successfully removed old lookup row "${oldName}".`)
		}

		// 1. Rename "App" -> "Tools"
		await migrateType("App", "Tools")

		// 2. Rename "Spreadsheet" -> "Collections and Lists"
		await migrateType("Spreadsheet", "Collections and Lists")

		// 3. Combine "Written Guide" and "Video Guide" -> "Guides"
		await migrateType("Written Guide", "Guides")
		await migrateType("Video Guide", "Guides")

		// 4. Update pending resources if any
		const pendingResources = await tx.resourcePending.findMany()
		if (pendingResources.length > 0) {
			console.log(`[migrate] Checking ${pendingResources.length} pending resources for legacy types...`)
			for (const pending of pendingResources) {
				let changed = false
				const updatedTypes = Array.from(
					new Set(
						pending.resourceTypes.map((t) => {
							if (t === "App") {
								changed = true
								return "Tools"
							}
							if (t === "Spreadsheet") {
								changed = true
								return "Collections and Lists"
							}
							if (t === "Written Guide" || t === "Video Guide") {
								changed = true
								return "Guides"
							}
							return t
						}),
					),
				)

				if (changed) {
					await tx.resourcePending.update({
						where: { id: pending.id },
						data: { resourceTypes: updatedTypes },
					})
					console.log(
						`[migrate] Updated pending resource "${pending.title}" types: ${JSON.stringify(updatedTypes)}`,
					)
				}
			}
		}
	})

	console.log("[migrate] Database migration complete.")
}

if (require.main === module || process.argv[1]?.includes("migrateResourceTypes")) {
	migrateResourceTypes()
		.catch((err) => {
			console.error("[migrate] Migration failed:", err)
			process.exit(1)
		})
		.finally(async () => {
			await prisma.$disconnect()
		})
}
