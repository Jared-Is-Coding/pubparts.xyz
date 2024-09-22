import React from "react"
import { Button, Col, Row } from "react-bootstrap"

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/layout/grid | React-Bootstrap Row}
 * containing buttons for clicking to navigate the
 * website parts lists.
 * 
 * @param NavbarProps - a {@link NavbarProps} object
 */
export default () => (
    <Row className="flex-center flex-row">
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/parts/floatwheel" variant="outline-info">Floatwheel</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/parts/gt" variant="outline-info">GT/GT-S</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/parts/pint" variant="outline-info">Pint/X/S</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/parts/xr" variant="outline-info">XR/+</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/parts/misc" variant="outline-info">Miscellaneous Items</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 3, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/parts/electronics" variant="outline-info">VESC Electronics</Button>
        </Col>
    </Row>
)
