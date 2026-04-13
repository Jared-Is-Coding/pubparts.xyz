import allPartsSnapshot from "../data/synced/partsCatalogSnapshot"

const sortedParts = [...allPartsSnapshot].sort((a, b) => a.title.localeCompare(b.title))

const platform = (platformName: PlatformType): ItemData[] => {
    return sortedParts.filter((part) => part.platform.includes(platformName))
}

export default sortedParts
export const floatwheelParts = platform("Floatwheel")
export const gtParts = platform("GT/GT-S")
export const miscParts = platform("Miscellaneous Items")
export const pintParts = platform("Pint/X/S")
export const vescElectronicsParts = platform("VESC Electronics")
export const xrParts = platform("XR/Funwheel")
export const xrClassicParts = platform("XR Classic")
