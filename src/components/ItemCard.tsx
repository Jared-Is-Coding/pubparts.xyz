import * as React from "react"
import { Card } from "react-bootstrap"

type MerchCardProps = {
    item: itemData
}

export default ({item}: MerchCardProps) => (
    <Card>
        <Card.Img variant="top" src={item.imageSrc} />
        <Card.Body>
            <Card.Title>
                <a target="_blank" href={item.url}>
                    {item.title}
                </a>
            </Card.Title>
            {item.price &&
                <Card.Text>
                    <i>Price: {item.price ?? "???"}</i>
                </Card.Text>
            }
        </Card.Body>
    </Card>
)