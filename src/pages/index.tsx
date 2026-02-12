import { type HeadFC, type PageProps } from "gatsby"
import React from "react"
import { Card, Container } from "react-bootstrap"
import PartTypesLinks from "../components/PartTypesLinks"
import ResourceTypesLinks from "../components/ResourceTypesLinks"
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
                    <Card className="mb-4">
                        <Card.Header>Welcome to PubParts.xyz</Card.Header>
                        <Card.Body>
                            <p>A collection of open source or otherwise aftermarket OneWheel parts, electronics, and resources.</p>
                            <p>Your part contributions via the project's Discord thread are welcome (and encouraged) to help make this a well-stocked library!</p>
                            <p>To quickly locate a part or resource you can use the sitewide search in the navbar. Otherwise, you can also view specific collections:</p>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Header>Browse Parts</Card.Header>
                        <Card.Body>
                            <PartTypesLinks />
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Header>Resource Library</Card.Header>
                        <Card.Body>
                            <ResourceTypesLinks />
                        </Card.Body>
                    </Card>
                </Container>
            </main>

            <SiteFooter />
        </>
    )
}

export default Page