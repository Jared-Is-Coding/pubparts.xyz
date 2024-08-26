import React from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { PartSubmissionEmail } from "../util/SiteVariables"

type NavbarProps = {
    isHomepage?: boolean
}

export default ({isHomepage}: NavbarProps) => (
    <Navbar fixed="top" expand="lg" data-bs-theme="dark">
        <Container>
            <Navbar.Brand href="/">
                <img
                    src="/images/logo.png"
                    width="55"
                    height="55"
                    className={(isHomepage ? "d-inline-block" : "d-xs-inline-block d-md-none") + " align-top"}
                    alt="PubParts.xyz logo"/>
                <span className={(isHomepage ? "d-none" : "d-none d-md-inline-block")}>
                    PubParts.xyz
                </span>
            </Navbar.Brand>

            <Navbar.Toggle label="Menu toggle" aria-controls="site-navbar" />

            <Navbar.Collapse id="site-navbar">
                <Nav variant="underline" justify>
                    <Nav.Link href="/">Home</Nav.Link>
                    <NavDropdown title="Frame Types" renderMenuOnMount={true} focusFirstItemOnShow="keyboard" id="nav-frames-dropdown">
                        <NavDropdown.Item href="/boards/floatwheel" target="_self">Floatwheel</NavDropdown.Item>
                        <NavDropdown.Item href="/boards/gt" target="_self">GT/GT-S</NavDropdown.Item>
                        <NavDropdown.Item href="/boards/pint" target="_self">Pint/Pint X</NavDropdown.Item>
                        <NavDropdown.Item href="/boards/xr" target="_self">XR/+</NavDropdown.Item>
                        <NavDropdown.Item href="/boards/misc" target="_self">Misc Parts</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href={`mailto:${PartSubmissionEmail}`}>Contribute</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
)