import React from "react"
import { Badge, Card, Col, Stack } from "react-bootstrap"
import isBrowser from "../hooks/isBrowser"
import { toTitleCase } from "../hooks/toTitleCase"
import CopyLinkBadge from "./CopyLinkBadge"

export default (resource: ResourceData, index: number) => {
    // Check for browser window
    if (!isBrowser()) return

    return (
        <Col
            xs={{span: 12, offset: 0}}
            md={{span: 12, offset: 0}}
            lg={{span: 12, offset: 0}}
            className="searchableResource"
            key={`resource-card-${index}`}
            resourcetitle={resource.title}
            resourcetypes={resource.typeOfResource.join(",")}
            resourcedescription={resource.description ?? ""}>
                <Card className={resource.typeOfResource?.map((r) => `resource-${r.toLowerCase()}`).join(" ")}>
                    <Card.Body>
                        {/* Resource type badges */}
                        {resource.typeOfResource?.length &&
                            <Stack className="display-over-top-right" direction="vertical" gap={1}>
                                {resource.typeOfResource.map((r, pillIndex) => (
                                    <Badge key={`resource-card-${index}-pill-${pillIndex}`} pill bg="dark">{toTitleCase(r)}</Badge>
                                ))}
                            </Stack>
                        }

                        {/* Copy Link to this item button */}
                        {/* <Stack className="display-over-top-left" direction="vertical" gap={1}>
                            <CopyLinkBadge link={"https://" + window.location.host + window.location.pathname + `?search=${resource.title}`} />
                        </Stack> */}

                        {/* Resource information */}
                        {(resource.externalUrl || resource.appStoreLink || resource.playStoreLink) &&
                            <Card.Title as="h3">
                                {resource.externalUrl &&
                                    <a href={resource.externalUrl} target="_blank">
                                        {resource.title}
                                    </a>
                                }
                                
                                {!resource.externalUrl && (resource.appStoreLink || resource.playStoreLink) &&
                                    <>
                                        {resource.title}
                                        <> (</>
                                        {resource.appStoreLink && <><a href={resource.appStoreLink} target="_blank">App Store</a></>}
                                        {resource.playStoreLink && <> | <a href={resource.playStoreLink} target="_blank">Play Store</a></>}
                                        <>)</>
                                    </>
                                }
                            </Card.Title>
                        }
                        
                        {resource.description &&
                            <Card.Text>
                                {resource.description}
                            </Card.Text>
                        }
                    </Card.Body>
                </Card>
        </Col>
    )
}