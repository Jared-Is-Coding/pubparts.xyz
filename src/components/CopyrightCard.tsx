import * as React from "react"
import { Card, Col, Stack } from "react-bootstrap"
import { ImageRequestEmail } from "../util/SiteVariables"

export default () => (
    <>
        <Col
            xs={{span: 12}}
            md={{span: 12}}
            lg={{span: 12}}
            className="flex-center flex-top">
            <Card>
                <Card.Body>
                    <Card.Text className="flex-center">
                        <Stack direction="vertical" gap={0}>
                            <p>All images are copyright to their respective owners.</p>
                            <p>However, if you would like to claim an image, brand or logo and want it to be removed please <a href={`mailto:${ImageRequestEmail}`}>contact us</a>.</p>
                        </Stack>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    </>
)