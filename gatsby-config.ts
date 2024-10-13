import type { GatsbyConfig } from "gatsby"
import dotenv from "dotenv"

dotenv.config()

const config: GatsbyConfig = {
    siteMetadata: {
        title: "PubParts",
        description: "A collection of open source or otherwise aftermarket OneWheel parts.",
        image: "/favicon.ico",
        siteUrl: process.env.SITE_URL
    },
    // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
    // If you use VSCode you can also use the GraphQL plugin
    // Learn more at: https://gatsby.dev/graphql-typegen
    graphqlTypegen: true,
    plugins: [
        "gatsby-plugin-image",
        "gatsby-plugin-sass",
        "gatsby-plugin-sharp",
        "gatsby-plugin-sitemap",
        "gatsby-plugin-robots-txt"
    ]
}

export default config
