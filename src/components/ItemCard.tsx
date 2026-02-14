import React, { useState } from "react"
import { Badge, Card, Col, Stack } from "react-bootstrap"
import toTitleCase from "../hooks/toTitleCase"
import windowIsDefined from "../hooks/windowIsDefined"
import CopyLinkBadge from "./CopyLinkBadge"
import Lightbox from "./Lightbox"

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/components/cards | React-Bootstrap Card}
 * with item information from an {@link ItemData}
 * object array. Intended to be used in
 * conjunction with the Array map function.
 * 
 * @param item - an {@link ItemData} object
 * @param index - a number from a map
 */
export default (item: ItemData, index: number) => {
    const [lightboxToggler, setLightboxToggler] = useState(false)

    return (
        <Col
            xs={{ span: 10, offset: 1 }}
            md={{ span: 6, offset: 0 }}
            lg={{ span: 4, offset: 0 }}
            className="flex-center flex-top searchableItem"
            key={`item-card-${index}`}
            parttitle={item.title}
            parttypes={item.typeOfPart.join(",")}
            partfabricationmethods={item.fabricationMethod.join(",")}>
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
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                        {item.typeOfPart.map((p, pillIndex) => (
                            <Badge key={`item-card-${index}-pill-t-${pillIndex}`} pill bg="dark">{toTitleCase(p)}</Badge>
                        ))}

                        {item.fabricationMethod.map((f, pillIndex) => (
                            <Badge key={`item-card-${index}-pill-f-${pillIndex}`} pill bg="dark">{f}</Badge>
                        ))}
                    </Stack>
                }

                {/* Copy Link to this item button */}
                <Stack className="display-over-top-left" direction="vertical" gap={1}>
                    <CopyLinkBadge link={!windowIsDefined() ? "#" : "http://" + window.location.host + window.location.pathname + `?search=${encodeURIComponent(item.title)}`} />
                </Stack>

                {/* Part information */}
                <Card.Body>
                    <Card.Title as="h3">{item.title}</Card.Title>

                    {(item.externalUrl || item.dropboxUrl) &&
                        <Stack direction="vertical" gap={1}>
                            {item.externalUrl &&
                                <Card.Link href={item.externalUrl} target="_blank">External Listing</Card.Link>
                            }

                            {item.dropboxUrl &&
                                <Card.Link href={item.dropboxUrl} target="_blank">ZIP Download{!!item.dropboxZipLastUpdated &&
                                    <>{` (${item.dropboxZipLastUpdated})`}</>
                                }</Card.Link>
                            }
                        </Stack>
                    }
                </Card.Body>
            </Card>
        </Col>
    )
}