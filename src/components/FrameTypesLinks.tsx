import React from "react"
import { Button, Col, Row } from "react-bootstrap"

export default () => (
    <Row className="flex-center flex-row">
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 2, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/boards/floatwheel" variant="outline-info">Floatwheel</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 2, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/boards/gt" variant="outline-info">GT/GT-S</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 2, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/boards/pint" variant="outline-info">Pint/Pint X</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 2, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/boards/xr" variant="outline-info">XR/+</Button>
        </Col>
        <Col
            xs={{span: 6, offset: 0}}
            md={{span: 4, offset: 0}}
            lg={{span: 2, offset: 0}}
            className="flex-center flex-top">
            <Button className="full-width" href="/boards/misc" variant="outline-info">VESC Misc</Button>
        </Col>
    </Row>
)
