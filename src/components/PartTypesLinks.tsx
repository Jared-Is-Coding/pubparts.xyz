import React from "react"
import { Button, Col, Row } from "react-bootstrap"

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/layout/grid | React-Bootstrap Row}
 * containing buttons for clicking to navigate
 * the website parts lists.
 */
export default () => {
    const types = [
        { href: "/parts/floatwheel", label: "Floatwheel" },
        { href: "/parts/gt", label: "GT/GT-S" },
        { href: "/parts/pint", label: "Pint/X/S" },
        { href: "/parts/xr", label: "XR/Funwheel" },
        { href: "/parts/xrclassic", label: "XR Classic" },
        { href: "/parts/misc", label: "Miscellaneous Items" },
        { href: "/parts/electronics", label: "VESC Electronics" }
    ]

    return (
        <Row className="flex-row">
            {types.map((t) => (
                <Col
                    key={t.label}
                    xs={{ span: 6, offset: 0 }}
                    md={{ span: 4, offset: 0 }}
                    lg={{ span: 3, offset: 0 }}
                    className="flex-center flex-top">
                    <Button className="full-width text-truncate" href={t.href} variant="outline-info">
                        {t.label}
                    </Button>
                </Col>
            ))}
        </Row>
    )
}
