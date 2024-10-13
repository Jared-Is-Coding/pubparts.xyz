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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"></link>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></Script>
            
            {/* Font */}
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        </>
    )
}