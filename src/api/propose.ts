import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"
import { PrismaClient } from "@prisma/client"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, parse } from "node:path"
import { isAllowedImageUrl, isAllowedPartUrl } from "../util/catalogConstants"

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

let tablesEnsured = false
async function ensurePendingTables(): Promise<void> {
    if (tablesEnsured) {
        return
    }

    try {
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "parts_pending" (
                "id" SERIAL PRIMARY KEY,
                "title" TEXT NOT NULL,
                "external_url" TEXT NOT NULL,
                "image_urls" TEXT[] NOT NULL DEFAULT '{}',
                "fabrication_methods" TEXT[] NOT NULL DEFAULT '{}',
                "platform_types" TEXT[] NOT NULL DEFAULT '{}',
                "part_types" TEXT[] NOT NULL DEFAULT '{}',
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `)

        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "resources_pending" (
                "id" SERIAL PRIMARY KEY,
                "title" TEXT NOT NULL,
                "resource_types" TEXT[] NOT NULL DEFAULT '{}',
                "external_url" TEXT NOT NULL,
                "app_store_link" TEXT,
                "play_store_link" TEXT,
                "description" TEXT NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `)

        tablesEnsured = true
    } catch (err) {
        console.warn("Could not ensure pending tables via DDL:", err)
    }
}

async function verifyTurnstileToken(token: string | undefined, ip?: string): Promise<{ ok: boolean; message?: string }> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim()
    if (!secretKey) {
        // If not set, Turnstile is optional
        return { ok: true }
    }

    if (!token?.trim()) {
        return { ok: false, message: "Turnstile verification is required." }
    }

    try {
        const formData = new URLSearchParams()
        formData.append("secret", secretKey)
        formData.append("response", token.trim())
        if (ip) {
            formData.append("remoteip", ip)
        }

        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: formData
        })

        const data = (await response.json()) as { success: boolean; "error-codes"?: string[] }
        if (!data.success) {
            return { ok: false, message: "Turnstile verification failed. Please try again." }
        }

        return { ok: true }
    } catch (error) {
        return {
            ok: false,
            message: error instanceof Error ? `Turnstile check failed: ${error.message}` : "Turnstile check failed."
        }
    }
}

export default async function handler(req: GatsbyFunctionRequest, res: GatsbyFunctionResponse): Promise<void> {
    if (req.method === "GET") {
        res.status(200).json({
            turnstileSiteKey: process.env.TURNSTILE_SITE_KEY?.trim() || ""
        })
        return
    }

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed." })
        return
    }

    await ensurePendingTables()

    let body: any
    try {
        body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    } catch {
        res.status(400).json({ error: "Invalid JSON body." })
        return
    }

    const { type, turnstileToken, item } = body || {}

    if (!type || !item) {
        res.status(400).json({ error: "Missing submission type or item data." })
        return
    }

    // Verify Turnstile
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket?.remoteAddress
    const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp)
    if (!turnstileResult.ok) {
        res.status(400).json({ error: turnstileResult.message || "Turnstile verification failed." })
        return
    }

    if (type === "part") {
        const title = (item.title || "").trim()
        const externalUrl = (item.externalUrl || "").trim()
        const imageUrls = (Array.isArray(item.imageUrls) ? item.imageUrls : [item.imageUrls])
            .map((url: unknown) => (typeof url === "string" ? url.trim() : ""))
            .filter(Boolean)
        const fabricationMethods = Array.isArray(item.fabricationMethods) ? item.fabricationMethods : []
        const platformTypes = Array.isArray(item.platformTypes) ? item.platformTypes : []
        const partTypes = Array.isArray(item.partTypes) ? item.partTypes : []

        if (!title) {
            res.status(400).json({ error: "Part title is required." })
            return
        }

        if (!externalUrl) {
            res.status(400).json({ error: "Part external URL is required." })
            return
        }

        if (!isAllowedPartUrl(externalUrl)) {
            res.status(400).json({
                error: "External URL must be from an allowed repository (MakerWorld, Printables, Thingiverse, Cults, MyMiniFactory, Sketchfab, CGTrader, TurboSquid, Fab, Yeggi, STLFinder, or Thangs)."
            })
            return
        }

        if (!imageUrls.length) {
            res.status(400).json({ error: "At least one image URL is required." })
            return
        }

        for (const imgUrl of imageUrls) {
            if (!isAllowedImageUrl(imgUrl)) {
                res.status(400).json({
                    error: `Image URL "${imgUrl}" must be hosted on an allowed repository domain.`
                })
                return
            }
        }

        if (!fabricationMethods.length) {
            res.status(400).json({ error: "At least one fabrication method must be selected." })
            return
        }

        if (!platformTypes.length) {
            res.status(400).json({ error: "At least one platform type must be selected." })
            return
        }

        if (!partTypes.length) {
            res.status(400).json({ error: "At least one part type must be selected." })
            return
        }

        try {
            await (prisma as any).partPending.create({
                data: {
                    title,
                    externalUrl,
                    imageUrls,
                    fabricationMethods,
                    platformTypes,
                    partTypes
                }
            })

            res.status(200).json({
                ok: true,
                message: "Part submission received! Thank you for contributing."
            })
            return
        } catch (dbError) {
            console.error("Failed to insert pending part:", dbError)
            res.status(500).json({ error: "Failed to save submission. Please try again." })
            return
        }
    }

    if (type === "resource") {
        const title = (item.title || "").trim()
        const resourceTypes = Array.isArray(item.resourceTypes) ? item.resourceTypes : []
        const externalUrl = (item.externalUrl || "").trim()
        const appStoreLink = (item.appStoreLink || "").trim() || null
        const playStoreLink = (item.playStoreLink || "").trim() || null
        const description = (item.description || "").trim()

        if (!title) {
            res.status(400).json({ error: "Resource title is required." })
            return
        }

        if (!resourceTypes.length) {
            res.status(400).json({ error: "At least one resource type must be selected." })
            return
        }

        if (!externalUrl) {
            res.status(400).json({ error: "External URL is required." })
            return
        }

        if (!description) {
            res.status(400).json({ error: "Description is required." })
            return
        }

        try {
            await (prisma as any).resourcePending.create({
                data: {
                    title,
                    resourceTypes,
                    externalUrl,
                    appStoreLink,
                    playStoreLink,
                    description
                }
            })

            res.status(200).json({
                ok: true,
                message: "Resource submission received! Thank you for contributing."
            })
            return
        } catch (dbError) {
            console.error("Failed to insert pending resource:", dbError)
            res.status(500).json({ error: "Failed to save submission. Please try again." })
            return
        }
    }

    res.status(400).json({ error: `Unknown submission type "${type}".` })
}
