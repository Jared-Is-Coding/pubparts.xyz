import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import Footer from "../../components/Footer"
import MetaData from "../../components/MetaData"
import Navbar from "../../components/Navbar"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="Boards | PubParts.xyz" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar isHomepage={true} />

                <h1 className="flex-center">
                    PubParts.xyz
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main>
                <Container>
                    <p>What are you doing here?</p>
                    
                    <Row className="flex-center flex-row">
                        <Col
                            xs={{span: 6, offset: 0}}
                            md={{span: 4, offset: 0}}
                            lg={{span: 2, offset: 0}}
                            className="flex-center flex-top">
                            <Button className="full-width" href="/boards/floatwheel" variant="info">Floatwheel</Button>
                        </Col>
                        <Col
                            xs={{span: 6, offset: 0}}
                            md={{span: 4, offset: 0}}
                            lg={{span: 2, offset: 0}}
                            className="flex-center flex-top">
                            <Button className="full-width" href="/boards/gt" variant="info">GT/GT-S</Button>
                        </Col>
                        <Col
                            xs={{span: 6, offset: 0}}
                            md={{span: 4, offset: 0}}
                            lg={{span: 2, offset: 0}}
                            className="flex-center flex-top">
                            <Button className="full-width" href="/boards/pint" variant="info">Pint/Pint X</Button>
                        </Col>
                        <Col
                            xs={{span: 6, offset: 0}}
                            md={{span: 4, offset: 0}}
                            lg={{span: 2, offset: 0}}
                            className="flex-center flex-top">
                            <Button className="full-width" href="/boards/xr" variant="info">XR/+</Button>
                        </Col>
                        <Col
                            xs={{span: 6, offset: 0}}
                            md={{span: 4, offset: 0}}
                            lg={{span: 2, offset: 0}}
                            className="flex-center flex-top">
                            <Button className="full-width" href="/boards/misc" variant="info">Misc</Button>
                        </Col>
                    </Row>

                    {/* Desktop View */}
                    {/* <div className="d-none d-lg-inline">
                    </div> */}

                    {/* Mobile View */}
                    {/* <div className="d-inline d-lg-none">
                    </div> */}
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default IndexPage