import { graphql, useStaticQuery } from "gatsby"

export const useMetaData = () => {
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