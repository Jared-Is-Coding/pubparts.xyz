import "dotenv/config"
import { bootstrapPartsDatabase } from "./partsBootstrapCore"

async function run(): Promise<void> {
    try {
        const result = await bootstrapPartsDatabase()
        console.log(`Imported ${result.catalogCount} catalog parts, ${result.shopCount} shop items, and ${result.resourcesCount} resources.`)
    } catch (error) {
        console.error("Import failed:", error)
        process.exitCode = 1
    }
}

run().catch((error) => {
    console.error("Unexpected failure:", error)
    process.exit(1)
})
