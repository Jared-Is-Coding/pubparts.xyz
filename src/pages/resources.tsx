import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import Footer from "../components/Footer"
import MetaData from "../components/MetaData"
import Navbar from "../components/Navbar"
import ResourceCard from "../components/ResourceCard"
import ResourceListSearchbar from "../components/ResourceListSearchbar"
import resources from "../util/resources"
import "../scss/pages/resources.scss"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData
            title="Resources | PubParts.xyz"
            description="Various web resources for VESC builders" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar />

                <h1 className="flex-center">
                    Useful Resources
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main className="page-resources">
                <Container>
                    <ResourceListSearchbar />

                    <h2 id="resourceListHeader" style={{display: "block"}}>Resources</h2>
                    <h2 id="noResultsText" style={{display: "none", minHeight: "200px"}}>No results.</h2>

                    <Row>
                        {!resources.length &&
                            <Col xs={{span: 12}}>
                                <p>No resources.</p>
                            </Col>
                        }
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

export default IndexPage