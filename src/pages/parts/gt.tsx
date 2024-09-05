import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import CopyrightCard from "../../components/CopyrightCard"
import Footer from "../../components/Footer"
import ItemCard from "../../components/ItemCard"
import ItemListSearchbar from "../../components/ItemListSearchbar"
import MetaData from "../../components/MetaData"
import Navbar from "../../components/Navbar"
import "../../scss/pages/items.scss"
import gtParts from "../../util/parts/gtParts"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData
            title="GT/GT-S Parts | PubParts.xyz"
            description="Open source or otherwise aftermarket parts for the GT/GT-S platform" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar />

                <h1 className="flex-center">
                    GT/GT-S Parts
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main className="page-items">
                <Container>
                    <ItemListSearchbar />

                    <h2 id="itemListHeader" style={{display: "block"}}>Items</h2>
                    <h2 id="noResultsText" style={{display: "none", minHeight: "200px"}}>No results.</h2>

                    <Row>
                        {!!gtParts.length &&
                            gtParts.sort((a, b) => a.title.localeCompare(b.title)).map(ItemCard)
                        }
                    
                        <CopyrightCard />
                    </Row>
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default IndexPage