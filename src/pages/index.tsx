import { Link, type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container } from "react-bootstrap"
import Footer from "../components/SiteFooter"
import MetaData from "../components/SiteMetaData"
import Navbar from "../components/SiteNavbar"
import PartTypesLinks from "../components/PartTypesLinks"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="Home | PubParts.xyz" />
    </>
)

const Page: React.FC<PageProps> = () => {
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
                    <p>A collection of open source or otherwise aftermarket OneWheel parts, electronics, and resources.</p>
                    <p>Your part contributions via the project's Discord thread are welcome (and encouraged) to help make this a well-stocked library!</p>
                    <p>Check out the collected <Link to="/resources">resources</Link>, or browse the parts lists:</p>

                    <PartTypesLinks />
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default Page