import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Container } from "react-bootstrap"
import PartTypesLinks from "../../components/PartTypesLinks"
import SiteFooter from "../../components/SiteFooter"
import SiteMetaData from "../../components/SiteMetaData"
import SiteNavbar from "../../components/SiteNavbar"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <SiteMetaData title="Boards | PubParts.xyz" />
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
                    <p>What are you doing here?</p>

                    <PartTypesLinks />
                </Container>
            </main>
                
            <SiteFooter />
        </>
    )
}

export default Page