import allParts from "./parts/allParts"
import allResources from "./resources/allResources"

export default [...new Set([
    allParts,
    allResources
].flat())] as (ItemData | ResourceData)[]