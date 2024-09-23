import { Link, type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container } from "react-bootstrap"
import PartTypesLinks from "../components/PartTypesLinks"
import SiteFooter from "../components/SiteFooter"
import SiteMetaData from "../components/SiteMetaData"
import SiteNavbar from "../components/SiteNavbar"

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
                    <p>Check out the collected <Link to="/resources">resources</Link>, or browse the parts lists:</p>

                    <PartTypesLinks />
                </Container>
            </main>
                
            <SiteFooter />
        </>
    )
}

export default Page