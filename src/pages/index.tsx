import { Link, type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import PartTypesLinks from "../components/PartTypesLinks"
import SiteFooter from "../components/SiteFooter"
import SiteMetaData from "../components/SiteMetaData"
import SiteNavbar from "../components/SiteNavbar"
import ResourceTypesLinks from "../components/ResourceTypesLinks"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <SiteMetaData title="Home | PubParts.xyz" />
    </>
)

const Page: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <SiteNavbar isHomepage={true} />

                <h1 className="flex-center">
                    PubParts.xyz
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main>
                <Container>
                    <p>A collection of open source or otherwise aftermarket OneWheel parts, electronics, and resources.</p>
                    <p>Your part contributions via the project's Discord thread are welcome (and encouraged) to help make this a well-stocked library!</p>
                    <p>You'll find all available <Link to="/parts">parts</Link> and <Link to="/resources">resources</Link> available through the site navigation bar.</p>
                </Container>
            </main>
                
            <SiteFooter />
        </>
    )
}

export default Page