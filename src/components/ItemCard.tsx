import * as React from "react"
import { Card, Col, Image } from "react-bootstrap"

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
                    {/* <Image className="card-img-top" src={item.imageSrc} /> */}
                    <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        {item.price &&
                            <Card.Text>
                                <i>Price: {item.price ?? "???"}</i>
                            </Card.Text>
                        }
                        {item.externalUrl &&
                            <Card.Link href={item.externalUrl} target="_blank">External Listing</Card.Link>
                        }
                        {item.zipUrl &&
                            <Card.Link href={item.zipUrl}>ZIP Download</Card.Link>
                        }
                        {item.zipUrl && item.zipLastUpdated &&
                            <Card.Text>ZIP Date: {item.zipLastUpdated}</Card.Text>
                        }
                    </Card.Body>
                </Card>
        </Col>
    </>
)