import allPartsShopSnapshot from "../data/synced/partsShopSnapshot"

const sortedShopItems = [...allPartsShopSnapshot].sort((a, b) => {
    if (a.featured !== b.featured) {
        return a.featured ? -1 : 1
    }

    return a.title.localeCompare(b.title)
})

export default sortedShopItems
