import { Script } from "gatsby"
import React from "react"
import useMetaData from "../hooks/useMetaData"
import "../scss/styles.scss"

type MetaDataProps = {
    title?: string
    description?: string
    image?: string
}

export default ({ title, description, image }: MetaDataProps) => {
    const { title: defaultTitle, description: defaultDescription, image: defaultImage, siteUrl } = useMetaData()

    return (
        <>
            {/* Site name */}
            <title>{title || defaultTitle}</title>
            <meta name="site_name" content={title || defaultTitle} />
            <meta property="og:title" content={title || defaultTitle} />

            {/* Site icon */}
            <meta property="og:image" content={image || siteUrl + defaultImage}></meta>
            <link rel="icon" href={image || siteUrl + defaultImage} />
            <link rel="apple-touch-icon" href={image || siteUrl + defaultImage} />

            {/* Site description */}
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content="public, parts, pubparts, pubwheel, onewheel, pev, aftermarket"/>
            
            {/* Site properties */}
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="en_US" />

            {/* Manifest */}
            <link rel="manifest" href="/manifest.webmanifest"></link>

            {/* Bootstrap */}
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </>
    )
}