import allParts from "./allParts"
import allResources from "./allResources"

export default [...new Set([
    allParts,
    allResources
].flat())] as (ItemData | ResourceData)[]