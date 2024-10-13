import React from "react"
import { Badge, Card, Col, Stack } from "react-bootstrap"
import isBrowser from "../hooks/isBrowser"
import toTitleCase from "../hooks/toTitleCase"
import CopyLinkBadge from "./CopyLinkBadge"

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
    // Check for browser window
    if (!isBrowser()) return

    return (
        <Col
            xs={{span: 10, offset: 1}}
            md={{span: 6, offset: 0}}
            lg={{span: 4, offset: 0}}
            className="flex-center flex-top searchableItem"
            key={`item-card-${index}`}
            parttitle={item.title}
            parttypes={item.typeOfPart.join(",")}
            partfabricationmethod={item.fabricationMethod}>
                <Card>
                    {/* Part image */}
                    {!!item.imageSrc &&
                        <div className="card-img-holder" style={{backgroundImage: `url('${item.imageSrc}')`}}>
                            <span role="img" aria-label={"Preview imagine of part, " + item.title}></span>
                        </div>
                    }

                    {/* Part type badges */}
                    {item.typeOfPart?.length &&
                        <Stack className="display-over-top-right" direction="vertical" gap={1}>
                            {item.typeOfPart.map((p, pillIndex) => (
                                <Badge key={`item-card-${index}-pill-${pillIndex}`} pill bg="dark">{toTitleCase(p)}</Badge>
                            ))}
                            
                            <Badge pill bg="dark">{item.fabricationMethod}</Badge>
                        </Stack>
                    }

                    {/* Copy Link to this item button */}
                    <Stack className="display-over-top-left" direction="vertical" gap={1}>
                        <CopyLinkBadge link={"http://" + window.location.host + window.location.pathname + `?search=${item.title}`} />
                    </Stack>
                    
                    {/* Part information */}
                    <Card.Body>
                        <Card.Title as="h3">{item.title}</Card.Title>

                        {item.price &&
                            <Card.Text>
                                <i>Price: {item.price ?? "???"}</i>
                            </Card.Text>
                        } 

                        {(item.externalUrl || item.dropboxUrl) &&
                            <Stack direction="vertical" gap={1}>
                                {item.externalUrl &&
                                    <Card.Link href={item.externalUrl} target="_blank">External Listing</Card.Link>
                                }

                                {item.dropboxUrl &&
                                    <Card.Link href={item.dropboxUrl}>ZIP Download{!!item.dropboxZipLastUpdated &&
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