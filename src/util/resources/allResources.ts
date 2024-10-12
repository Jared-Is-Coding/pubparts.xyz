import applicationsResources from "./applicationsResources"
import codeRepositoriesResources from "./codeRepositoriesResources"
import guidesResources from "./guidesResources"
import spreadsheetsResources from "./spreadsheetsResources"
import vendorsResources from "./vendorsResources"
import websitesResources from "./websitesResources"

export default [...new Set([
    applicationsResources.sort((a, b) => a.title.localeCompare(b.title)),
    codeRepositoriesResources.sort((a, b) => a.title.localeCompare(b.title)),
    guidesResources.sort((a, b) => a.title.localeCompare(b.title)),
    spreadsheetsResources.sort((a, b) => a.title.localeCompare(b.title)),
    vendorsResources.sort((a, b) => a.title.localeCompare(b.title)),
    websitesResources.sort((a, b) => a.title.localeCompare(b.title))
].flat())] as ResourceData[]