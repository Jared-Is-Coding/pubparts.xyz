import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container, Row } from "react-bootstrap"
import CopyrightCard from "../../components/CopyrightCard"
import ItemCard from "../../components/ItemCard"
import ItemListSearchbar from "../../components/ItemListSearchbar"
import SiteFooter from "../../components/SiteFooter"
import SiteMetaData from "../../components/SiteMetaData"
import SiteNavbar from "../../components/SiteNavbar"
import "../../scss/pages/items.scss"
import { gtParts } from "../../util/allParts"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <SiteMetaData
            title="GT/GT-S Parts | PubParts.xyz"
            description="Open source or otherwise aftermarket parts for the GT/GT-S platform" />
    </>
)

const Page: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <SiteNavbar />

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
                            gtParts.map(ItemCard)
                        }

                        {/* Copyright card */}
                        <CopyrightCard />
                    </Row>
                </Container>
            </main>
                
            <SiteFooter />
        </>
    )
}

export default Page