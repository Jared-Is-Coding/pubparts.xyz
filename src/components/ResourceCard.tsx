import React from "react"
import { Badge, Card, Col, Stack } from "react-bootstrap"
import toTitleCase from "../hooks/toTitleCase"
import windowIsDefined from "../hooks/windowIsDefined"
import CopyLinkBadge from "./CopyLinkBadge"

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/components/cards | React-Bootstrap Card}
 * with resource information from an
 * {@link ResourceData} object array.
 * Intended to be used in conjunction
 * with the Array map function.
 * 
 * @param item - an {@link ResourceData} object
 * @param index - a number from a map
 */
export default (resource: ResourceData, index: number) => {
    return (
        <Col
            xs={{ span: 12, offset: 0 }}
            md={{ span: 12, offset: 0 }}
            lg={{ span: 12, offset: 0 }}
            className="searchableResource"
            key={`resource-card-${index}`}
            resourcetitle={resource.title}
            resourcetypes={resource.typeOfResource}
            resourcedescription={resource.description ?? ""}>
            <Card className={`resource-${resource.typeOfResource}`}>
                <Card.Header>
                    {resource.title}
                </Card.Header>
                <Card.Body>
                    {/* Resource type badges */}
                    {resource.typeOfResource.length > 0 &&
                        <Stack className="display-over-top-right" direction="vertical" gap={1}>
                            {resource.typeOfResource.map((r, pillIndex) => (
                                <Badge key={`resource-card-${index}-pill-${pillIndex}`} pill bg="dark">{toTitleCase(r)}</Badge>
                            ))}
                        </Stack>
                    }

                    {/* Resource information */}
                    {(resource.externalUrl || resource.appStoreLink || resource.playStoreLink) &&
                        <div className="mb-2">
                            {resource.externalUrl &&
                                <>
                                    <CopyLinkBadge link={!windowIsDefined() ? "#" : "http://" + window.location.host + window.location.pathname + `?search=${encodeURIComponent(resource.title)}`} />
                                    <> | </>
                                    <a href={resource.externalUrl} target="_blank">
                                        Visit Resource
                                    </a>
                                </>
                            }

                            {!resource.externalUrl && (resource.appStoreLink || resource.playStoreLink) &&
                                <>
                                    <CopyLinkBadge link={!windowIsDefined() ? "#" : "http://" + window.location.host + window.location.pathname + `?search=${encodeURIComponent(resource.title)}`} />
                                    <> | </>
                                    Available on:
                                    {resource.appStoreLink && <><a href={resource.appStoreLink} target="_blank" className="ms-1">App Store</a></>}
                                    {resource.playStoreLink && <><span className="mx-1">or</span><a href={resource.playStoreLink} target="_blank">Play Store</a></>}
                                </>
                            }
                        </div>
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