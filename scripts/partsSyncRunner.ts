import "dotenv/config"
import { syncPartsFromDatabase } from "./partsSyncCore"

type RunnerArgs = {
    once: boolean
    reason: string
}

function parseArgs(): RunnerArgs {
    const args = process.argv.slice(2)
    const once = args.includes("--once")

    const reasonArg = args.find((arg) => arg.startsWith("--reason="))
    const reason = reasonArg ? reasonArg.slice("--reason=".length) : (once ? "manual-runner-once" : "interval-runner")

    return { once, reason }
}

function getIntervalMinutes(): number {
    const raw = process.env.PARTS_SYNC_INTERVAL_MINUTES ?? "15"
    const parsed = Number.parseInt(raw, 10)

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 15
    }

    return parsed
}

async function runOne(reason: string): Promise<void> {
    const result = await syncPartsFromDatabase({ reason })
    console.log(`[parts-sync] completed reason=${result.reason} catalog=${result.catalogCount} shop=${result.shopCount} resources=${result.resourcesCount} durationMs=${result.durationMs}`)
}

async function main(): Promise<void> {
    const { once, reason } = parseArgs()

    if (once) {
        await runOne(reason)
        return
    }

    const intervalMinutes = getIntervalMinutes()
    const intervalMs = intervalMinutes * 60_000
    let isRunning = false

    const runSafely = async (reasonValue: string) => {
        if (isRunning) {
            console.log("[parts-sync] skip run because previous sync is still running")
            return
        }

        isRunning = true
        try {
            await runOne(reasonValue)
        } catch (error) {
            console.error("[parts-sync] run failed:", error)
        } finally {
            isRunning = false
        }
    }

    await runSafely(reason)

    const timer = setInterval(() => {
        void runSafely("interval-runner")
    }, intervalMs)

    console.log(`[parts-sync] runner active; interval=${intervalMinutes}m`)

    const shutdown = () => {
        clearInterval(timer)
        console.log("[parts-sync] runner stopped")
        process.exit(0)
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)
}

main().catch((error) => {
    console.error("[parts-sync] fatal error:", error)
    process.exit(1)
})
