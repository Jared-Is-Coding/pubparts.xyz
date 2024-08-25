import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Container } from "react-bootstrap"
import Footer from "../../components/Footer"
import MetaData from "../../components/MetaData"
import Navbar from "../../components/Navbar"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="Home | PubParts.xyz" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar isHomepage={true} />

                <h1 className="flex-center">
                    Pint Frame Parts
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main>
                <Container>
                    {/* Desktop View */}
                    <div className="d-none d-lg-inline">
                        <p>So I hear you've got a OneWheel...</p>
                    </div>

                    {/* Mobile View */}
                    <div className="d-inline d-lg-none">
                        <p>So I hear you've got a OneWheel...</p>
                    </div>
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default IndexPage