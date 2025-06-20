import { type HeadFC, type PageProps } from "gatsby"
import React, { useEffect, useState } from "react"
import { Button, Container, Row, Stack } from "react-bootstrap"
import { FaArrowDown, FaArrowUp } from "react-icons/fa6"
import PartsShopItemCard from "../components/PartsShopItemCard"
import PartsShopListSearchbar from "../components/PartsShopListSearchbar"
import SiteFooter from "../components/SiteFooter"
import SiteMetaData from "../components/SiteMetaData"
import SiteNavbar from "../components/SiteNavbar"
import "../scss/pages/shop.scss"
import allPartsShopItems from "../util/partsShop"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <SiteMetaData
            title="ZiNc's Parts Shop | PubParts.xyz"
            description="Welcome to my shop" />
    </>
)

const Page: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <SiteNavbar />

                <h1 className="flex-center">
                    ZiNc's Parts Shop
                </h1>
            </header>

            <main className="page-items">
                <Container>
                    <p>This is a collection of parts I'm personally selling. If you're interested in something here, reach out to me on Discord at <code>iam_zinc</code> and just include a link to the listing (you can copy this by clicking the little link icon on the listed item). Buyer pays shipping unless otherwise noted.</p>

                    {/* Search area */}
                    <PartsShopListSearchbar partList={allPartsShopItems} />

                    {/* Search results headers */}
                    <h2 id="itemListHeader" style={{display: "block"}}>Items</h2>
                    <h2 id="noResultsText" style={{display: "none", minHeight: "200px"}}>No results.</h2>

                    <Row>
                        {/* List parts */}
                        {!!allPartsShopItems.length &&
                            allPartsShopItems
                                .filter((p) => p.availableCount != 0)
                                .map(PartsShopItemCard)
                        }
                    </Row>
                </Container>
            </main>
                
            <SiteFooter />
        </>
    )
}

export default Page