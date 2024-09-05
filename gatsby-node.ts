import type { CreatePagesArgs } from "gatsby"

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