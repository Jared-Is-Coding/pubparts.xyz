import React from "react"
import { Button, Col, Row } from "react-bootstrap"

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/layout/grid | React-Bootstrap Row}
 * containing buttons for clicking to navigate
 * the website resources lists.
 */
export default () => {
    const resources = [
        { href: "/resources/applications", label: "Applications" },
        { href: "/resources/repositories", label: "Code Repositories" },
        { href: "/resources/spreadsheets", label: "Spreadsheets" },
        { href: "/resources/vendors", label: "Vendors" },
        { href: "/resources/videoguides", label: "Video Guides" },
        { href: "/resources/websites", label: "Websites" },
        { href: "/resources/writtenguides", label: "Written Guides" }
    ]
    
    return (
        <Row className="flex-row">
            {resources.map((r) => (
                <Col
                    key={r.label}
                    xs={{ span: 6, offset: 0 }}
                    md={{ span: 4, offset: 0 }}
                    lg={{ span: 3, offset: 0 }}
                    className="flex-center flex-top">
                    <Button className="full-width text-truncate" href={r.href} variant="outline-info">
                        {r.label}
                    </Button>
                </Col>
            ))}
        </Row>
    )
}