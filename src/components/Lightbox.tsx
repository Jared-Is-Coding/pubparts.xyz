import FsLightbox from "fslightbox-react"
import React from "react"

type LightboxProps = {
    src: string | string[]
    toggler: boolean
}

/**
 * Creates a {@link https://fslightbox.com/react | Lightbox}
 * with provided image sources
 * 
 * @param src - a string or array of strings representing image URLs
 * @param toggler - a {@type Boolean} to open/close the lightbox
 */
export default ({ src, toggler }: LightboxProps) => {
    return (
        <FsLightbox
            toggler={toggler}
            loadOnlyCurrentSource={true}
            sources={[src].flat()}
        />
    )
}