import React from "react"
import { Card, Col } from "react-bootstrap"
import { ImageRequestEmail } from "../util/siteVariables"

export default () => (
    <Col
        xs={{span: 12}}
        md={{span: 12}}
        lg={{span: 12}}
        key={`item-card-copyright`}>
        <div className="flex-center flex-top">
            <Card className="full-width">
                <Card.Body>
                    <Card.Text>
                        All images are copyright to their respective owners.
                        <br />However, if you would like to claim an image, brand or logo and want it to be removed please <a href={`mailto:${ImageRequestEmail}`}>contact us</a>.
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    </Col>
)