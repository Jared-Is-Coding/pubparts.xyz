import * as React from "react"
import { Card, Col, Stack } from "react-bootstrap"

export default (item: itemData, index: number) => (
    <>
        <Col
            xs={{span: 10, offset: 1}}
            md={{span: 6, offset: 0}}
            lg={{span: 4, offset: 0}}
            className="flex-center flex-top searchableItem"
            key={`merch-card-item-${item.title}-${index}`}
            partName={`${item.title}`}>
                <Card>
                    <div className="card-img-holder" style={{backgroundImage: `url('${item.imageSrc}')`}}>
                        <Card.Img variant="top" src={item.imageSrc} />
                    </div>
                    <Card.Body>
                        <Card.Title as="h3">{item.title}</Card.Title>
                        {item.price &&
                            <Card.Text>
                                <i>Price: {item.price ?? "???"}</i>
                            </Card.Text>
                        } 
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
                    </Card.Body>
                </Card>
        </Col>
    </>
)