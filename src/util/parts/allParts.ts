import floatwheelParts from "./floatwheelParts"
import gtParts from "./gtParts"
import miscParts from "./miscParts"
import pintParts from "./pintParts"
import vescElectronicsParts from "./vescElectronicsParts"
import xrClassicParts from "./xrClassicParts"
import xrParts from "./xrParts"

export default [...new Set([
    floatwheelParts.sort((a, b) => a.title.localeCompare(b.title)),
    gtParts.sort((a, b) => a.title.localeCompare(b.title)),
    miscParts.sort((a, b) => a.title.localeCompare(b.title)),
    pintParts.sort((a, b) => a.title.localeCompare(b.title)),
    vescElectronicsParts.sort((a, b) => a.title.localeCompare(b.title)),
    xrClassicParts.sort((a, b) => a.title.localeCompare(b.title)),
    xrParts.sort((a, b) => a.title.localeCompare(b.title))
].flat())] as ItemData[]