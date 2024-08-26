import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import Footer from "../../components/Footer"
import ItemCard from "../../components/ItemCard"
import { ItemListSearchbar } from "../../components/ItemListSearchbar"
import MetaData from "../../components/MetaData"
import Navbar from "../../components/Navbar"
import xrparts from "../../parts/xrparts"
import "../../scss/pages/items.scss"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="XR Parts | PubParts.xyz" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar />

                <h1 className="flex-center">
                    XR Frame Parts
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
                        {!xrparts.length &&
                            <Col xs={{span: 12}}>
                                <p>No items.</p>
                            </Col>
                        }
                        {!!xrparts.length &&
                            xrparts.sort((a, b) => a.title.localeCompare(b.title)).map(ItemCard)
                        }
                    </Row>
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default IndexPage