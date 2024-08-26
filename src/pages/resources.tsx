import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Button, Col, Container, Row, Stack } from "react-bootstrap"
import Footer from "../components/Footer"
import MetaData from "../components/MetaData"
import Navbar from "../components/Navbar"
import { PartSubmissionEmail } from "../util/SiteVariables"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="Resources | PubParts.xyz" />
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar isHomepage={true} />

                <h1 className="flex-center">
                    Useful Resources
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main>
                <Container>
                    <Stack direction="vertical" gap={1}>
                        <a href="https://docs.google.com/spreadsheets/d/1EPqBROovzQ03iRKpK6Xfy0T7oEG6ZpiBP0-BecQBbUA/edit" target="_blank">Spreadsheet: All Things VESC Battery Comparison</a>
                        <a href="https://docs.google.com/spreadsheets/d/1EPqBROovzQ03iRKpK6Xfy0T7oEG6ZpiBP0-BecQBbUA/edit" target="_blank">Spreadsheet: ADV 3d Printed List</a>
                    </Stack>
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default IndexPage