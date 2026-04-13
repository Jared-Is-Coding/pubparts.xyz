import "dotenv/config"
import { syncPartsFromDatabase } from "./partsSyncCore"

type RunnerArgs = {
    reason: string
}

function parseArgs(): RunnerArgs {
    const args = process.argv.slice(2)

    const reasonArg = args.find((arg) => arg.startsWith("--reason="))
    const reason = reasonArg ? reasonArg.slice("--reason=".length) : "manual-sync"

    return { reason }
}

async function runOne(reason: string): Promise<void> {
    const result = await syncPartsFromDatabase({ reason })
    console.log(`[parts-sync] completed reason=${result.reason} catalog=${result.catalogCount} shop=${result.shopCount} resources=${result.resourcesCount} durationMs=${result.durationMs}`)
}

async function main(): Promise<void> {
    const { reason } = parseArgs()
    await runOne(reason)
}

main().catch((error) => {
    console.error("[parts-sync] fatal error:", error)
    process.exit(1)
})
