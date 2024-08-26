import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import Footer from "../../components/Footer"
import ItemCard from "../../components/ItemCard"
import { ItemListSearchbar } from "../../components/ItemListSearchbar"
import MetaData from "../../components/MetaData"
import Navbar from "../../components/Navbar"
import gtparts from "../../parts/gtparts"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="GT Parts | PubParts.xyz" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
        <header>
            <Navbar />

            <h1 className="flex-center">
                GT Frame Parts
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
                    {!gtparts.length &&
                        <Col xs={{span: 12}}>
                            <p>No items.</p>
                        </Col>
                    }
                    {!!gtparts.length &&
                        gtparts.sort((a, b) => a.title.localeCompare(b.title)).map(ItemCard)
                    }
                </Row>
            </Container>
        </main>
            
        <Footer />
        </>
    )
}

export default IndexPage