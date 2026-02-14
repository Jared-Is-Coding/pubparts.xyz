import React from "react"
import { Button, Col, Row } from "react-bootstrap"

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/layout/grid | React-Bootstrap Row}
 * containing buttons for clicking to navigate
 * the website resources lists.
 * 
 * @param NavbarProps - a {@link NavbarProps} object
 */
export default () => (
    <Row className="flex-row">
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width text-truncate" href="/resources/applications" variant="outline-info">Applications</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width text-truncate" href="/resources/repositories" variant="outline-info">Code Repositories</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width text-truncate" href="/resources/spreadsheets" variant="outline-info">Spreadsheets</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width text-truncate" href="/resources/vendors" variant="outline-info">Vendors</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width text-truncate" href="/resources/videoguides" variant="outline-info">Video Guides</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width text-truncate" href="/resources/websites" variant="outline-info">Websites</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width text-truncate" href="/resources/writtenguides" variant="outline-info">Written Guides</Button>
        </Col>
    </Row>
)
