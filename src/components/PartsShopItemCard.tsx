import React, { useState } from "react"
import { Badge, Button, Card, Col, Modal, Row, Stack } from "react-bootstrap"
import toTitleCase from "../hooks/toTitleCase"
import windowIsDefined from "../hooks/windowIsDefined"
import CopyLinkBadge from "./CopyLinkBadge"
import Lightbox from "./Lightbox"

function createMarkup(dirty: string) {
    return { __html: dirty };
}

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/components/cards | React-Bootstrap Card}
 * with item information from an {@link PartsShopData}
 * object array. Intended to be used in
 * conjunction with the Array map function.
 * 
 * @param item - an {@link PartsShopData} object
 * @param index - a number from a map
 */
export default (item: PartsShopData, index: number) => {
    const [showModal, setShowModal] = useState(false)
    const [lightboxToggler, setLightboxToggler] = useState(false)

    return (
        <Col
            xs={{ span: 10, offset: 1 }}
            md={{ span: 6, offset: 0 }}
            lg={{ span: 6, offset: 0 }}
            className="flex-top searchableItem"
            key={`item-card-${index}`}
            parttitle={item.title}
            platform={item.platform}
            parttypes={item.typeOfPart.join(",")}
            partitemcondition={item.condition}>
            <Card>
                {/* Part image */}
                <div className="card-img-holder" onClick={() => setLightboxToggler(!lightboxToggler)}>
                    {item.imageSrc ? (
                        <img
                            src={
                                Array.isArray(item.imageSrc)
                                    ? (item.imageSrc[0]?.startsWith("http") || item.imageSrc[0]?.startsWith("//") ? item.imageSrc[0] : `/.netlify/images?url=${item.imageSrc[0]}`)
                                    : (item.imageSrc.startsWith("http") || item.imageSrc.startsWith("//") ? item.imageSrc : `/.netlify/images?url=${item.imageSrc}`)
                            }
                            alt={"Preview image of part, " + item.title}
                            loading="lazy"
                        />
                    ) : null}
                </div>

                {/* Part image lightbox */}
                {/* https://fslightbox.com/react */}
                {item.imageSrc &&
                    <Lightbox
                        src={[item.imageSrc].flat().map((i) => i.startsWith("http") || i.startsWith("//") ? i : `/.netlify/images?url=${i}`)}
                        toggler={lightboxToggler}
                    />
                }

                {/* Part type badges */}
                {item.typeOfPart?.length &&
                    <Stack className="display-over-top-right" direction="vertical" gap={1}>
                        {item.featured &&
                            <Badge key={`item-card-${index}-pill-featured`} pill bg="dark">Featured Item</Badge>
                        }

                        <Badge pill bg="dark">{item.platform}</Badge>
                        <Badge pill bg="dark">{item.condition}</Badge>

                        {item.typeOfPart.map((p, pillIndex) => (
                            <Badge key={`item-card-${index}-pill-${pillIndex}`} pill bg="dark">{toTitleCase(p)}</Badge>
                        ))}
                    </Stack>
                }

                {/* Copy Link to this item button */}
                <Stack className="display-over-top-left" direction="vertical" gap={1}>
                    <CopyLinkBadge link={!windowIsDefined() ? "#" : "http://" + window.location.host + window.location.pathname + `?search=${encodeURIComponent(item.title)}`} />
                </Stack>

                {/* Part information */}
                <Card.Body>
                    <Card.Title as="h3" className="flex-center">{item.title}</Card.Title>

                    {item.price &&
                        <Card.Text className="flex-center flex-row flex-gap-5">
                            <i>Price: {item.price ? `$${item.price}` : "???"}</i>
                            |
                            <i>Available: {item.availableCount > 0 ? item.availableCount : "∞"}</i>
                        </Card.Text>
                    }

                    {(item.externalUrl || item.description) &&
                        <Row className="flex-center full-width">
                            {item.description &&
                                <Col xs={{ span: 6 }}>
                                    <Button variant="outline-info" onClick={() => setShowModal(true)} aria-label="Item description modal trigger">Item Description</Button>
                                </Col>
                            }

                            {item.externalUrl &&
                                <Col xs={{ span: 6 }}>
                                    <Button variant="outline-info" href={item.externalUrl} target="_blank">External Reference</Button>
                                </Col>
                            }
                        </Row>
                    }

                    {item.description &&
                        <Modal
                            show={showModal}
                            variant="outline-info"
                            size="lg"
                            centered={true}
                            onHide={() => setShowModal(false)}
                            scrollable={true}
                            fullscreen="md-down">
                            <Modal.Header>
                                <Modal.Title>{item.title}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body dangerouslySetInnerHTML={createMarkup(item.description)} />

                            <Modal.Footer>
                                <Button variant="outline-info" onClick={() => setShowModal(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    }
                </Card.Body>
            </Card>
        </Col>
    )
}