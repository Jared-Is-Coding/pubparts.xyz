import React, { useState } from "react"
import { Button, Container, Modal, Nav, Navbar, NavDropdown, Stack } from "react-bootstrap"
import { FaBars, FaMagnifyingGlass } from "react-icons/fa6"
import allPartsAndResources from "../util/allPartsAndResources"
import { DiscordInvite, DiscordThread } from "../util/siteVariables"
import SearchModalCard from "./SearchModalCard"
import SearchModalSearchbar from "./SearchModalSearchbar"

type NavbarProps = {
    isHomepage?: boolean
}

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/components/navbar | React-Bootstrap Navbar}
 * for use navigating at the top of a page.
 * 
 * @param NavbarProps - a {@link NavbarProps} object
 */
export default ({isHomepage}: NavbarProps) => {
    const [showModal, setShowModal] = useState(false)

    return (
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

                <Stack direction="horizontal" gap={3}>
                    {/* Mobile Search Button */}
                    <Nav.Link className="d-md-block d-lg-none navbar-toggler" onClick={() => setShowModal(true)}><FaMagnifyingGlass style={{height: "1rem", width: "1rem"}} /></Nav.Link>
                    {/* Mobile Navigation Toggle */}
                    <Navbar.Toggle label="Menu toggle" aria-controls="site-navbar"><FaBars style={{height: "1rem", width: "1rem"}} /></Navbar.Toggle>
                </Stack>

                {/* Navbar */}
                <Navbar.Collapse id="site-navbar">
                    <Nav variant="underline" justify>
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Parts" renderMenuOnMount={true} focusFirstItemOnShow="keyboard" id="nav-parts-dropdown">
                            <NavDropdown.Item href="/parts/floatwheel" target="_self">Floatwheel</NavDropdown.Item>
                            <NavDropdown.Item href="/parts/gt" target="_self">GT/GT-S</NavDropdown.Item>
                            <NavDropdown.Item href="/parts/pint" target="_self">Pint/X/S</NavDropdown.Item>
                            <NavDropdown.Item href="/parts/xr" target="_self">XR/+</NavDropdown.Item>
                            <NavDropdown.Item href="/parts/misc" target="_self">Miscellaneous Items</NavDropdown.Item>
                            <NavDropdown.Item href="/parts/electronics" target="_self">VESC Electronics</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Resources" renderMenuOnMount={true} focusFirstItemOnShow="keyboard" id="nav-resources-dropdown">
                            <NavDropdown.Item href="/resources/applications" target="_self">Applications</NavDropdown.Item>
                            <NavDropdown.Item href="/resources/repositories" target="_self">Code Repositories</NavDropdown.Item>
                            <NavDropdown.Item href="/resources/guides" target="_self">Guides</NavDropdown.Item>
                            <NavDropdown.Item href="/resources/spreadsheets" target="_self">Spreadsheets</NavDropdown.Item>
                            <NavDropdown.Item href="/resources/websites" target="_self">Websites</NavDropdown.Item>
                            <NavDropdown.Item href="/resources/vendors" target="_self">Vendors</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Submit Changes" renderMenuOnMount={true} focusFirstItemOnShow="keyboard" id="nav-contribute-dropdown">
                            <NavDropdown.Item href={DiscordInvite} target="_blank">1. Join Vescify Discord</NavDropdown.Item>
                            <NavDropdown.Item href={DiscordThread} target="_blank">2. Post in Thread</NavDropdown.Item>
                        </NavDropdown>
                        {/* Desktop Search Button */}
                        <Nav.Link className="d-none d-lg-block" onClick={() => setShowModal(true)}><FaMagnifyingGlass /></Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                {/* Search Modal */}
                <Modal
                    show={showModal}
                    variant="outline-info"
                    size="lg"
                    fullscreen="md-down"
                    centered={true}
                    onHide={() => setShowModal(false)}
                    scrollable={true}>
                    <Modal.Header>
                        <Modal.Title>Sitewide Search</Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                        {/* Search area */}
                        <SearchModalSearchbar />

                        <Stack direction="vertical" gap={3}>
                            {/* List parts */}
                            {!!allPartsAndResources.length &&
                                allPartsAndResources.map(SearchModalCard)
                            }
                        </Stack>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="outline-info" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Navbar>
    )
}