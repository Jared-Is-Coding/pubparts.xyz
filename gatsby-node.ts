import path from "path"
import { promises as fs } from "fs"
import type { CreateDevServerArgs, CreatePagesArgs, CreateWebpackConfigArgs } from "gatsby"
import allParts, {
    floatwheelParts,
    gtParts,
    miscParts,
    pintParts,
    vescElectronicsParts,
    xrClassicParts,
    xrParts
} from "./src/util/partsSynced"
import allResources, {
    applicationsResources,
    codeRepositoriesResources,
    spreadsheetsResources,
    vendorsResources,
    videoGuidesResources,
    websitesResources,
    writtenGuidesResources
} from "./src/util/resourcesSynced"

exports.createPages = ({ actions }: CreatePagesArgs) => {
    const { createRedirect } = actions

    const redirects = [
        { from: "/boards/floatwheel", to: "/parts/floatwheel", permanent: true },
        { from: "/boards/gt", to: "/parts/gt", permanent: true },
        { from: "/boards/pint", to: "/parts/pint", permanent: true },
        { from: "/boards/xr", to: "/parts/xr", permanent: true },
        { from: "/boards/misc", to: "/parts/misc", permanent: true },
        { from: "/boards", to: "/parts", permanent: true }
    ]

    for (const thisRedirect of redirects) {
        createRedirect({
            fromPath: thisRedirect.from,
            toPath: thisRedirect.to,
            isPermanent: thisRedirect.permanent,
            force: true,
            redirectInBrowser: true
        })
    }
}

exports.onCreateWebpackConfig = ({ actions }: CreateWebpackConfigArgs) => {
    actions.setWebpackConfig({
        resolve: {
            alias: {
                "@scss": path.resolve(__dirname, "src/scss"),
                "@components": path.resolve(__dirname, "src/components"),
                "@util": path.resolve(__dirname, "src/util")
            }
        }
    })
}

const jsonEndpoints: Array<[string, unknown]> = [
    ["parts.json", allParts],
    ["parts/electronics.json", vescElectronicsParts],
    ["parts/floatwheel.json", floatwheelParts],
    ["parts/gt.json", gtParts],
    ["parts/misc.json", miscParts],
    ["parts/pint.json", pintParts],
    ["parts/xr.json", xrParts],
    ["parts/xrclassic.json", xrClassicParts],
    ["resources.json", allResources],
    ["resources/applications.json", applicationsResources],
    ["resources/repositories.json", codeRepositoriesResources],
    ["resources/spreadsheets.json", spreadsheetsResources],
    ["resources/vendors.json", vendorsResources],
    ["resources/videoguides.json", videoGuidesResources],
    ["resources/websites.json", websitesResources],
    ["resources/writtenguides.json", writtenGuidesResources]
]

exports.onCreateDevServer = ({ app }: CreateDevServerArgs) => {
    for (const [endpointPath, data] of jsonEndpoints) {
        app.get(`/${endpointPath}`, (_req: unknown, res: { type: (contentType: string) => void; send: (body: string) => void }) => {
            res.type("application/json")
            res.send(JSON.stringify(data))
        })
    }
}

const writeJsonEndpoint = async (publicPath: string, data: unknown): Promise<void> => {
    const filePath = path.join(__dirname, "public", publicPath)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(data), "utf8")
}

exports.onPostBuild = async () => {
    await Promise.all(jsonEndpoints.map(([publicPath, data]) => writeJsonEndpoint(publicPath, data)))
}