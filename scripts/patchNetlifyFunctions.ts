import fs from "node:fs"
import path from "node:path"

export function patchNetlifyFunctions(): void {
	const functionsInternalDir = path.resolve(".netlify", "functions-internal")
	if (!fs.existsSync(functionsInternalDir)) {
		console.log("[patchNetlifyFunctions] No .netlify/functions-internal directory found, skipping.")
		return
	}

	const entries = fs.readdirSync(functionsInternalDir, { withFileTypes: true })
	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue
		}

		const functionDir = path.join(functionsInternalDir, entry.name)
		const manifestPath = path.join(functionDir, `${entry.name}.json`)

		if (!fs.existsSync(manifestPath)) {
			continue
		}

		try {
			const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
			if (!manifest.config) {
				manifest.config = {}
			}

			const includedFiles = new Set<string>(manifest.config.includedFiles || [])
			includedFiles.add("node_modules/.prisma/client/**")
			includedFiles.add("node_modules/@prisma/client/**")
			includedFiles.add("prisma/schema.prisma")
			manifest.config.includedFiles = Array.from(includedFiles)

			const externalModules = new Set<string>(manifest.config.externalNodeModules || [])
			externalModules.add("@prisma/client")
			externalModules.add(".prisma/client")
			manifest.config.externalNodeModules = Array.from(externalModules)

			fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8")
			console.log(`[patchNetlifyFunctions] Patched ${entry.name}.json with Prisma dependencies.`)
		} catch (err) {
			console.warn(`[patchNetlifyFunctions] Could not patch ${manifestPath}:`, err)
		}
	}
}

patchNetlifyFunctions()
