import { graphql, useStaticQuery } from "gatsby"

/**
 * @returns siteMetadata object from graphql query
 */
export default () => {
    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                    description
                    image
                    siteUrl
                }
            }
        }
    `)

    return data.site.siteMetadata
}