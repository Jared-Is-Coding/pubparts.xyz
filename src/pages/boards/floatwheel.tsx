import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import Footer from "../../components/Footer"
import ItemCard from "../../components/ItemCard"
import { ItemListSearchbar } from "../../components/ItemListSearchbar"
import MetaData from "../../components/MetaData"
import Navbar from "../../components/Navbar"
import floatwheelparts from "../../parts/floatwheelparts"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="Floatwheel Parts | PubParts.xyz" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
        <header>
            <Navbar isHomepage={true} />

            <h1 className="flex-center">
                Floatwheel Frame Parts
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
                    {!floatwheelparts.length &&
                        <Col xs={{span: 12}}>
                            <p>No items.</p>
                        </Col>
                    }
                    {!!floatwheelparts.length &&
                        floatwheelparts.sort((a, b) => a.title.localeCompare(b.title)).map(ItemCard)
                    }
                </Row>
            </Container>
        </main>
            
        <Footer />
        </>
    )
}

export default IndexPage