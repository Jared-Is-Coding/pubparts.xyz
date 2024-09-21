import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container } from "react-bootstrap"
import PartTypesLinks from "../../components/PartTypesLinks"
import Footer from "../../components/SiteFooter"
import MetaData from "../../components/SiteMetaData"
import Navbar from "../../components/SiteNavbar"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="Boards | PubParts.xyz" />
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
                    <p>What are you doing here?</p>

                    <PartTypesLinks />
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default Page