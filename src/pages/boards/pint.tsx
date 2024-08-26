import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import Footer from "../../components/Footer"
import ItemCard from "../../components/ItemCard"
import { ItemListSearchbar } from "../../components/ItemListSearchbar"
import MetaData from "../../components/MetaData"
import Navbar from "../../components/Navbar"
import pintparts from "../../parts/pintparts"
import "../../scss/pages/items.scss"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData
            title="Pint Parts | PubParts.xyz"
            description="Open source or otherwise aftermarket parts for the Pint frame platform" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
        <header>
            <Navbar />

            <h1 className="flex-center">
                Pint Frame Parts
            </h1>

            <p className="tagline flex-center">
                <br />
            </p>
        </header>

        <main>
            <Container>
                <ItemListSearchbar />

                <h2 id="itemListHeader" style={{display: "unset"}}>Items</h2>
                <Row>
                    {!pintparts.length &&
                        <Col xs={{span: 12}}>
                            <p>No items.</p>
                        </Col>
                    }
                    {!!pintparts.length &&
                        pintparts.sort((a, b) => a.title.localeCompare(b.title)).map(ItemCard)
                    }
                </Row>
            </Container>
        </main>
            
        <Footer />
        </>
    )
}

export default IndexPage