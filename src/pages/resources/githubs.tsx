import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container, Row } from "react-bootstrap"
import Footer from "../../components/SiteFooter"
import MetaData from "../../components/SiteMetaData"
import Navbar from "../../components/SiteNavbar"
import ResourceCard from "../../components/ResourceCard"
import ResourceListSearchbar from "../../components/ResourceListSearchbar"
import "../../scss/pages/resources.scss"
import githubs from "../../util/resources/githubs"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData
            title="Github Repositories | PubParts.xyz"
            description="A collection of pertinent repo's" />
    </>
)

const Page: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar />

                <h1 className="flex-center">
                    Github Repositories
                </h1>
            </header>

            <main className="page-resources">
                <Container>
                    {/* Search area */}
                    <ResourceListSearchbar resourceList={githubs} />

                    {/* Search results headers */}
                    <h2 id="resourceListHeader" style={{display: "block"}}>Github Repositories</h2>
                    <h2 id="noResultsText" style={{display: "none", minHeight: "200px"}}>No results.</h2>

                    <Row>
                        {/* List resources */}
                        {!!githubs.length &&
                            githubs.sort((a, b) => a.title.localeCompare(b.title)).map(ResourceCard)
                        }
                    </Row>
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default Page