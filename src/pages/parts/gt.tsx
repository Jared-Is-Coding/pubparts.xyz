import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container, Row } from "react-bootstrap"
import CopyrightCard from "../../components/CopyrightCard"
import ItemCard from "../../components/ItemCard"
import ItemListSearchbar from "../../components/ItemListSearchbar"
import Footer from "../../components/SiteFooter"
import MetaData from "../../components/SiteMetaData"
import Navbar from "../../components/SiteNavbar"
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

const Page: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar />

                <h1 className="flex-center">
                    GT/GT-S Parts
                </h1>
            </header>

            <main className="page-items">
                <Container>
                    {/* Search area */}
                    <ItemListSearchbar partList={gtParts} />

                    {/* Search results headers */}
                    <h2 id="itemListHeader" style={{display: "block"}}>Items</h2>
                    <h2 id="noResultsText" style={{display: "none", minHeight: "200px"}}>No results.</h2>

                    <Row>
                        {/* List parts */}
                        {!!gtParts.length &&
                            gtParts.sort((a, b) => a.title.localeCompare(b.title)).map(ItemCard)
                        }

                        {/* Copyright card */}
                        <CopyrightCard />
                    </Row>
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default Page