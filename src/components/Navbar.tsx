import React from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { NewPartEmail, RemovedPartEmail, UpdatedPartEmail } from "../util/siteVariables"

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
                    <Nav.Link href="/resources">Resources</Nav.Link>
                    <NavDropdown title="Frame Types" renderMenuOnMount={true} focusFirstItemOnShow="keyboard" id="nav-frames-dropdown">
                        <NavDropdown.Item href="/boards/floatwheel" target="_self">Floatwheel</NavDropdown.Item>
                        <NavDropdown.Item href="/boards/gt" target="_self">GT/GT-S</NavDropdown.Item>
                        <NavDropdown.Item href="/boards/pint" target="_self">Pint/Pint X</NavDropdown.Item>
                        <NavDropdown.Item href="/boards/xr" target="_self">XR/+</NavDropdown.Item>
                        <NavDropdown.Item href="/boards/misc" target="_self">VESC Misc Parts</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Contribute" renderMenuOnMount={true} focusFirstItemOnShow="keyboard" id="nav-contribute-dropdown">
                        <NavDropdown.Item href={`mailto:${NewPartEmail}`}>New Part</NavDropdown.Item>
                        <NavDropdown.Item href={`mailto:${UpdatedPartEmail}`}>Updated Part</NavDropdown.Item>
                        <NavDropdown.Item href={`mailto:${RemovedPartEmail}`}>Removed Part</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
)