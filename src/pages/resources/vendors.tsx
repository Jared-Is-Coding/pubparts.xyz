import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container, Row } from "react-bootstrap"
import Footer from "../../components/SiteFooter"
import MetaData from "../../components/SiteMetaData"
import Navbar from "../../components/SiteNavbar"
import ResourceCard from "../../components/ResourceCard"
import ResourceListSearchbar from "../../components/ResourceListSearchbar"
import "../../scss/pages/resources.scss"
import resources from "../../util/resources/vendors"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData
            title="Resources | PubParts.xyz"
            description="Various web resources for VESC builders" />
    </>
)

const Page: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar />

                <h1 className="flex-center">
                    Known Vendors
                </h1>
            </header>

            <main className="page-resources">
                <Container>
                    {/* Search area */}
                    <ResourceListSearchbar resourceList={resources} />

                    {/* Search results headers */}
                    <h2 id="resourceListHeader" style={{display: "block"}}>Vendors</h2>
                    <h2 id="noResultsText" style={{display: "none", minHeight: "200px"}}>No results.</h2>

                    <Row>
                        {/* List resources */}
                        {!!resources.length &&
                            resources.sort((a, b) => a.title.localeCompare(b.title)).map(ResourceCard)
                        }
                    </Row>
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default Page