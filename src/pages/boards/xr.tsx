import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import Footer from "../../components/Footer"
import ItemCard from "../../components/ItemCard"
import MetaData from "../../components/MetaData"
import Navbar from "../../components/Navbar"
import "../../scss/pages/items.scss"
import { ItemListSearchbar } from "../../components/ItemListSearchbar"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <MetaData title="Home | PubParts.xyz" />
    </>
)

const allItems: itemData[] = [
    {
        title: "PubHubs: SuperFlux to XR Rails",
        price: "~$80/pair from JLCPCB",
        type: "CNC",
        url: "https://www.printables.com/model/586255",
        imageSrc: "https://media.printables.com/media/prints/586255/images/4964504_0f8fbf2f-b3ef-44ef-8772-385c40e328fb_b19f6052-cc12-4a16-a812-f954cdec0a16/thumbs/inside/1280x960/png/pubhubsfxr.webp"
    },
    {
        title: "PubHubs: Clamping SuperFlux to XR Rails",
        price: "~$80/pair from JLCPCB",
        type: "CNC",
        url: "https://www.printables.com/model/838327",
        imageSrc: "https://media.printables.com/media/prints/838327/images/6457046_40be565c-8fbf-4d66-933b-eff05fd599e3_3c44b72d-0718-4923-838f-b0dfc344cd77/thumbs/inside/1280x960/jpg/clamp.webp"
    },
    {
        title: "PubHubs: CannonCore to XR Rails",
        price: "~$80/pair from JLCPCB",
        type: "CNC",
        url: "https://www.printables.com/model/586242",
        imageSrc: "https://media.printables.com/media/prints/586242/images/4677933_4520e176-b44e-47cc-9eb7-18a89bd93207/thumbs/inside/1280x960/png/cc-to-xr-pubhub-no-rail.webp"
    },
    {
        title: "PubHubs: HyperCore to XR Rails",
        price: "~$80/pair from JLCPCB",
        type: "CNC",
        url: "https://www.printables.com/model/586260",
        imageSrc: "https://media.printables.com/media/prints/586260/images/4678089_c757787e-b678-47a4-9594-5ceb82f712a4/thumbs/inside/1280x960/png/pubhub1.webp"
    },
    {
        title: "CNC PubBox V1 - XR VESC Box",
        type: "CNC",
        url: "https://www.printables.com/model/586518",
        imageSrc: "https://media.printables.com/media/prints/586518/images/4972379_3be303b5-bb1c-46fd-826f-b16d964dfd93_e2a8e05b-4f0a-402d-ac37-e718008ccdf5/thumbs/inside/1280x960/png/pubbox1.webp"
    },
    {
        title: "CNC PubBox V2 - XR VESC Box",
        type: "CNC",
        url: "https://www.printables.com/model/882071",
        imageSrc: "https://media.printables.com/media/prints/882071/images/6805730_d4772e6d-58e7-47c7-8696-a02077548a8f_2e2dd769-80d3-440b-9724-c4f895f93e90/thumbs/inside/1280x960/png/cnc-pubbox-v20-handle-v34-lfoc-2s2p.webp"
    },
    {
        title: "3DP PubBox V1 - XR VESC Box",
        type: "3d Printed",
        url: "https://www.printables.com/model/670275",
        imageSrc: "https://media.printables.com/media/prints/670275/images/6065874_a6347037-184b-427e-b683-124167242c89_efe5dcf6-e025-4200-bf45-de189efffa9a/thumbs/inside/1280x960/png/3dp-home.webp"
    },
    {
        title: "6in Hub Rim Saver",
        type: "3d Printed",
        url: "https://www.printables.com/model/662104",
        imageSrc: "https://media.printables.com/media/prints/662104/images/5214682_631ba4a0-2218-4c14-9839-34426e5e4018_08a4158e-4fe0-44a9-9761-bd6018465d63/thumbs/inside/1280x960/png/rimsaver1.webp"
    },
    {
        title: "SuperFlux Motor Plates",
        type: "CNC",
        url: "https://www.printables.com/model/675082",
        imageSrc: "https://media.printables.com/media/prints/675082/images/5328357_81abee0f-57ec-4351-a2d6-92976e695b98_76f4b5f0-5f66-44ac-86ab-cac4e7334214/thumbs/inside/1280x960/png/finned-hub-plate-v3-v4.webp"
    },
    {
        title: "Funwheel Controller Lid Fungineers",
        type: "CNC",
        url: "https://www.printables.com/model/968563",
        imageSrc: "https://media.printables.com/media/prints/968563/images/7391295_111ecec1-9550-4956-ac57-719bc9a02c1c_b379309a-d258-4328-ab8d-a41ce6191c3c/thumbs/inside/1280x960/png/screenshot-2024-08-09-at-005213.webp"
    },
    {
        title: "Mushies Footpads - VOW systems",
        type: "3d Printed",
        url: "https://www.printables.com/model/967377",
        imageSrc: "https://media.printables.com/media/prints/967377/images/7383151_42dd71a7-35fe-45a3-a832-7998116b5ae7_4dad2734-5063-4db7-8ce8-5cccc360069b/thumbs/inside/1280x960/png/screenshot-2024-08-07-at-212054.webp"
    },
    {
        title: "Extended battery box - VOW systems",
        type: "3d Printed",
        url: "https://www.printables.com/model/967352",
        imageSrc: "https://media.printables.com/media/prints/967352/images/7383039_4c6f3c2a-7702-4e44-9990-17a23e322e90_7d2edc3f-44de-4113-bec1-5e1cfb223ec3/thumbs/inside/1280x960/png/screenshot-2024-08-07-at-211107.webp"
    },
    {
        title: "Stock XR/+ Fender",
        type: "3d Printed",
        url: "https://www.printables.com/model/960339",
        imageSrc: "https://media.printables.com/media/prints/960339/images/7333748_6d6f5346-2405-4c23-8566-0513c67f4c43_b796b20d-ff4e-4190-9979-6e5f7dc42a10/thumbs/inside/1280x960/png/screenshot-2024-07-31-at-212639.webp"
    },
    {
        title: "Stock XR Battery Box",
        type: "3d Printed",
        url: "https://www.printables.com/model/960336",
        imageSrc: "https://media.printables.com/media/prints/960336/images/7333737_d4ad250b-0958-46b2-bd56-1c029dd59cf7_5620337b-ae73-4f4b-8aab-7ed0e5270e74/thumbs/inside/1280x960/png/screenshot-2024-07-31-at-212101.webp"
    },
    {
        title: "Stock XR Connector Cover",
        type: "3d Printed",
        url: "https://www.printables.com/model/960109",
        imageSrc: "https://media.printables.com/media/prints/960109/images/7332235_bb80b444-95db-4a85-bb93-aca4e9215a3d_e1cba53e-da5b-48a5-909c-fc7e1d0b7ee3/thumbs/inside/1280x960/png/screenshot-2024-07-31-at-162458.webp"
    },
    {
        title: "XLR Charger Plug Cover",
        type: "3d Printed",
        url: "https://www.printables.com/model/960104",
        imageSrc: "https://media.printables.com/media/prints/960104/images/7332212_7de0442a-40a1-4b68-ad13-c71be93fed95_99676bf0-d136-46d4-9679-3f1de84a9374/thumbs/inside/1280x960/png/screenshot-2024-07-31-at-162051.webp"
    },
    {
        title: "Stock XR Battery Lid",
        type: "CNC",
        url: "https://www.printables.com/model/960093",
        imageSrc: "https://media.printables.com/media/prints/960093/images/7332097_e3e1137b-d626-4e20-9f62-bee6873dfeef_2ee94bcc-f082-404f-9551-cd8668dd52d9/thumbs/inside/1280x960/png/screenshot-2024-07-31-at-161042.webp"
    },
    {
        title: "FlightFins",
        type: "3d Printed",
        url: "https://www.printables.com/model/960086",
        imageSrc: "https://media.printables.com/media/prints/960086/images/7332056_04ab3d42-9c0a-4bb4-b9d2-b758696e9962_08694c12-e680-4804-96f4-e9592767b9e6/thumbs/inside/1280x960/png/screenshot-2024-07-31-at-160440.webp"
    },
    {
        title: "Stock XR Bumpers",
        type: "3d Printed",
        url: "https://www.printables.com/model/960081",
        imageSrc: "https://media.printables.com/media/prints/960081/images/7331999_f26e12e2-30c9-49a2-9bee-cdd10b4ce7de_9168edff-c37b-4df8-97bd-34dcdceeb191/thumbs/inside/1280x960/png/screenshot-2024-07-31-at-155954.webp"
    },
    {
        title: "Stock XR Rails",
        type: "CNC",
        url: "https://www.printables.com/model/957776",
        imageSrc: "https://media.printables.com/media/prints/957776/images/7302743_6d5df488-8c8d-4bcc-be7c-409768d28c62_578b145e-63d6-4196-9f9e-dabee0b707db/thumbs/inside/1280x960/png/screenshot-2024-07-29-at-164109.webp"
    }
]

const mapItem = (item: itemData, index: number) => (
    <>
        <Col
            xs={{span: 10, offset: 1}}
            md={{span: 6, offset: 0}}
            lg={{span: 4, offset: 0}}
            className="flex-center flex-top"
            key={`merch-card-item-${item.title}-${index}`}>
                <ItemCard item={item} />
        </Col>
    </>
)

const IndexPage: React.FC<PageProps> = () => {
    return (
        <>
            <header>
                <Navbar isHomepage={true} />

                <h1 className="flex-center">
                    XR Frame Parts
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main>                
                <Container>
                    <ItemListSearchbar />

                    <Row>
                        {!allItems.length &&
                            <Col xs={{span: 12}}>
                                <p>No items.</p>
                            </Col>
                        }
                        {!!allItems.length &&
                            allItems.sort((a, b) => a.title.localeCompare(b.title)).map(mapItem)
                        }
                    </Row>
                </Container>
            </main>
                
            <Footer />
        </>
    )
}

export default IndexPage