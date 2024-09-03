import * as React from "react"
import { Badge, Card, Col, Stack } from "react-bootstrap"

export default (resource: ResourceData, index: number) => (
    <Col
        xs={{span: 12, offset: 0}}
        md={{span: 12, offset: 0}}
        lg={{span: 12, offset: 0}}
        className="searchableResource"
        key={`resource-card-${index}`}
        resourcename={`${resource.title}`}
        resourcetypes={`${resource.typeOfResource.join(",").replaceAll(" ", "")}`}
        resourcedescription={`${resource.description ?? ""}`}>
            <Card className={resource.typeOfResource.includes("Spreadsheet") ? "resource-spreadsheet" : "resource-website"}>
                <Card.Body>
                    {resource.typeOfResource?.length &&
                        <Stack className="display-over-top" direction="vertical" gap={1}>
                            {resource.typeOfResource.map((part, pillIndex) => (
                                <Badge key={`resource-card-${index}-pill-${pillIndex}`} pill bg="dark">{part}</Badge>
                            ))}
                        </Stack>
                    }

                    <Card.Title as="h3">
                        <a href={resource.externalUrl} target="_blank">
                            {resource.title}
                        </a>
                    </Card.Title>
                    
                    {resource.description &&
                        <Card.Text>
                            {resource.description}
                        </Card.Text>
                    }
                </Card.Body>
            </Card>
    </Col>
)