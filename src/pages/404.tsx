import { HeadFC, Link, PageProps } from "gatsby"
import React from "react"
import { Container } from "react-bootstrap"
import Footer from "../components/SiteFooter"
import MetaData from "../components/SiteMetaData"
import Navbar from "../components/SiteNavbar"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="404 | PubParts.xyz" />
    </>
)

const NotFoundPage: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar />

                <h1 className="flex-center">
                    404
                </h1>

                <p className="tagline flex-center">That page doesn't exist</p>
            </header>
            
            <main>
                <Container>
                    <div className="flex-center">
                        <p><Link to="/">ᐊ Home</Link>.</p>
                    </div>
                </Container>
            </main>

            <Footer />
        </>
    )
}

export default NotFoundPage
