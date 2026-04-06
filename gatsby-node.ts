import path from "path"
import type { CreatePagesArgs, CreateWebpackConfigArgs } from "gatsby"

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