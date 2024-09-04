import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container } from "react-bootstrap"
import Footer from "../components/Footer"
import FrameTypesLinks from "../components/FrameTypesLinks"
import MetaData from "../components/MetaData"
import Navbar from "../components/Navbar"
import { NewPartEmail } from "../util/siteVariables"

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
                    PubParts.xyz
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main>
                <Container>
                    <p>A collection of open source or otherwise aftermarket OneWheel parts.</p>
                    <p>Your <a href={`mailto:${NewPartEmail}`}>contributions</a> are welcome (and encouraged) to help make this a well-stocked library!</p>
                    <p>Here's a list of the current frame types I've started indexing:</p>

                    <FrameTypesLinks />
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default IndexPage