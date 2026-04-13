const NETLIFY_IMAGE_ENDPOINT = "/.netlify/images?url="

const shouldUseNetlifyImageEndpoint = process.env.NODE_ENV === "production"

export const getImageUrl = (src: string) => {
    if (!shouldUseNetlifyImageEndpoint) {
        return src
    }

    return `${NETLIFY_IMAGE_ENDPOINT}${encodeURIComponent(src)}`
}

export const getImageUrls = (src: string | string[]) => {
    return [src].flat().map(getImageUrl)
}

export const getPrimaryImageUrl = (src?: string | string[]) => {
    if (!src) {
        return undefined
    }

    return getImageUrls(src).at(0)
}