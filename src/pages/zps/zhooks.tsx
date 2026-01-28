import { type HeadFC, type PageProps } from "gatsby"
import React, { useState } from "react"
import { Button, Card, Col, Container, Row } from "react-bootstrap"
import { FaArrowLeft } from "react-icons/fa6"
import Lightbox from "../../components/Lightbox"
import SiteFooter from "../../components/SiteFooter"
import SiteMetaData from "../../components/SiteMetaData"
import "../../scss/pages/shop.scss"
import allPartsShopItems from "../../util/partsShop"

export const Head: HeadFC = () => (
    <>
        <html lang="en" />
        <SiteMetaData
            title="Z-Hooks | ZiNc's Parts Shop on PubParts.xyz"
            description="Heard you like hooks?" />
    </>
)

const Page: React.FC<PageProps> = () => {
    const item = allPartsShopItems.find((p) => p.title.includes("Z-Hooks") && p.typeOfPart.includes("Footpad Attachment")) as PartsShopData
    const [previewLightboxToggler, setPreviewLightboxToggler] = useState(false)
    const [step0LightboxToggler, setStep0LightboxToggler] = useState(false)
    const [step1LightboxToggler, setStep1LightboxToggler] = useState(false)
    const [step2LightboxToggler, setStep2LightboxToggler] = useState(false)
    const [step3LightboxToggler, setStep3LightboxToggler] = useState(false)
    const [step4LightboxToggler, setStep4LightboxToggler] = useState(false)
    const [step5LightboxToggler, setStep5LightboxToggler] = useState(false)

    return (
        <>
            <main className="page-items">
                <h1 className="flex-center">
                    Z-Hooks
                </h1>

                <Container>
                    <Row>
                        <Col xs={12}>
                            <p className="full-width">
                                <Button className="full-width" href="/zps" variant="outline-info" type="button" size="sm"><FaArrowLeft /> Back to ZiNc's Parts Shop</Button>
                            </p>
                        </Col>

                        <Col xs={12} md={6}>
                            <Card>
                                {/* Part image */}
                                <div className="card-img-holder" onClick={() => setPreviewLightboxToggler(!previewLightboxToggler)} style={{backgroundImage: item.imageSrc ? `url('${Array.isArray(item.imageSrc) ? `/.netlify/images?url=${item.imageSrc.at(0)}` : `/.netlify/images?url=${item.imageSrc}`}')` : ""}}>
                                    {item.imageSrc &&
                                        <span role="img" aria-label={"Preview imagine of step i"}></span>
                                    }
                                </div>

                                {/* Part image lightbox */}
                                {/* https://fslightbox.com/react */}
                                {item.imageSrc &&
                                    <Lightbox src={[item.imageSrc].flat().map((i) => `/.netlify/images?url=${i}`)} toggler={previewLightboxToggler} />
                                }
                            </Card>
                        </Col>

                        <Col xs={12} md={6}>
                            <h2>Description</h2>
                            <p>Paired with hooks modified from original designs by @seanbrowntown, this hook-and-wedge system offers mounted foot hooks paired with carefully crafted wedges - They work with most popular sensors and perfectly angle the hooks to lock in your ride.</p>
                            <p>Designed to work around common sensor shapes, these hooks can be mounted on most footpads with common sensors applied without causing any activation issues.</p>
                            <p>Printed in TPU, these hooks are indestructible.</p>

                            <h2>Parts</h2>
                            <ul>
                                <li>2 x Hooks</li>
                                <li>2 x Wedges</li>
                                <li>2 x Foam cutouts for padding the hook</li>
                                <li>7 x M5x25mm countersunk screws</li>
                                <li>7 x M6x20mm flat head screws</li>
                            </ul>

                            <h2>Cost</h2>
                            <p>The full set of Z-Hooks (2 hooks, 2 wedges, and all necessary hardware) is $130.</p>
                            <p>In cases where not a full set of hooks and wedges is needed, or additional individual parts are requested, here are the individual parts costs for reference:</p>
                            <ul>
                                <li>$35 per hook</li>
                                <li>$35 per wedge (with hardware)</li>
                            </ul>
                            
                            <h2>Resources</h2>
                            <ul>
                                <li>
                                    <a target="_blank" href="https://www.dropbox.com/scl/fi/h4ogm66scm2e0gt4n0fnm/wedges_flattened_image.zip?rlkey=avggggr6f00hf0synag1gk15q&st=an59jt15&dl=0">Printed screw hole placement guide for wedges</a>
                                </li>
                                <li>
                                    <a target="_blank" href="https://www.dropbox.com/scl/fi/6kml4yc77ubg22uhqeg82/hooks_flattened_image.zip?rlkey=dfheg4gb4t2m5j4u7wp32fzr1&st=6jrvsez2&dl=0">Printed cutout guide for foam padding</a>
                                </li>
                            </ul>
                        </Col>

                        <Col xs={12} md={12}>
                            <h2>Installation</h2>

                            <Row>
                                <Col xs={12} md={4}>
                                    <Card>
                                        {/* Part image */}
                                        <div className="card-img-holder" onClick={() => setStep0LightboxToggler(!step0LightboxToggler)} style={{backgroundImage: `url('/.netlify/images?url=/images/shop/zhooks/step0.jpg')`}}>
                                            {item.imageSrc &&
                                                <span role="img" aria-label={"Preview imagine of step 0"}></span>
                                            }
                                        </div>

                                        <Card.Body>
                                            <Card.Title as="h3" className="flex-center">Prerequisites</Card.Title>

                                            <Card.Text>
                                                Remove your footpad from your setup. Prepare a drill with a small (1-2mm) bit for initial tapping, and a ~5.5mm drill bit and a countersink bit for the final hole diameters.
                                            </Card.Text>
                                            <Card.Text>
                                                Separate the hook and wedge components from each other by removing the M6 screws holding them together.
                                            </Card.Text>
                                            <Card.Text>
                                                Ensure you have some ~M5x25 screws for mounting the wedge (depending on your footpad, these may need to be longer or shorter), and M6x20 screws for mounting the hook to the wedge.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    
                                    <Lightbox src={["/.netlify/images?url=/images/shop/zhooks/step0.jpg"]} toggler={step0LightboxToggler} />
                                </Col>

                                <Col xs={12} md={4}>
                                    <Card>
                                        {/* Part image */}
                                        <div className="card-img-holder" onClick={() => setStep1LightboxToggler(!step1LightboxToggler)} style={{backgroundImage: `url('/.netlify/images?url=/images/shop/zhooks/step1.2.jpg')`}}>
                                            {item.imageSrc &&
                                                <span role="img" aria-label={"Preview imagine of step 1"}></span>
                                            }
                                        </div>

                                        <Card.Body>
                                            <Card.Title as="h3" className="flex-center">Step 1a (Stompies, SS v1-4, non-cuttable)</Card.Title>

                                            <Card.Text>
                                                Front footpad with Stompie Sensor, StokedStock Sensor, or other non-FM sensor:
                                                Place the wedge on the footpad, aligning the outer hole of the wedge with the front hole of the footpad (You can place a screw down through the the wedge into footpad hole to help hold it in place).
                                            </Card.Text>
                                            <Card.Text>
                                                If your footpad does not have a front hole, reference the above image to align the wedge as far forward as possible without interfering with the sensor.
                                            </Card.Text>
                                            <Card.Text>
                                                Mark where to drill holes through the footpad accordingly.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    
                                    <Lightbox src={["/.netlify/images?url=/images/shop/zhooks/step1.2.jpg", "/.netlify/images?url=/images/shop/zhooks/step1.1.jpg"]} toggler={step1LightboxToggler} />
                                </Col>

                                <Col xs={12} md={4}>
                                    <Card>
                                        {/* Part image */}
                                        <div className="card-img-holder" onClick={() => setStep1LightboxToggler(!step1LightboxToggler)} style={{backgroundImage: `url('/.netlify/images?url=/images/shop/zhooks/step1.2.jpg')`}}>
                                            {item.imageSrc &&
                                                <span role="img" aria-label={"Preview imagine of step 1"}></span>
                                            }
                                        </div>

                                        <Card.Body>
                                            <Card.Title as="h3" className="flex-center">Step 1b (Magnet, SSv5, or other cuttable sensor)</Card.Title>

                                            <Card.Text>
                                                Front footpad with magnet sensor, SS V5, or other cuttable sensor:
                                                Place the wedge on the footpad wherever you would like, so long as it does not interfere with your sensor!
                                            </Card.Text>
                                            <Card.Text>
                                                If it is placed too close to your sensor, it may cause activation issues.
                                            </Card.Text>
                                            <Card.Text>
                                                Mark where to drill holes through the footpad accordingly.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    
                                    <Lightbox src={["/.netlify/images?url=/images/shop/zhooks/step1.2.jpg", "/.netlify/images?url=/images/shop/zhooks/step1.1.jpg"]} toggler={step1LightboxToggler} />
                                </Col>

                                <Col xs={12} md={4}>
                                    <Card>
                                        {/* Part image */}
                                        <div className="card-img-holder" onClick={() => setStep2LightboxToggler(!step2LightboxToggler)} style={{backgroundImage: `url('/.netlify/images?url=/images/shop/zhooks/step2.jpg')`}}>
                                            {item.imageSrc &&
                                                <span role="img" aria-label={"Preview imagine of step 2"}></span>
                                            }
                                        </div>

                                        <Card.Body>
                                            <Card.Title as="h3" className="flex-center">Step 2</Card.Title>

                                            <Card.Text>
                                                Drill holes for the wedge screws (at least 5.5mm diameter) and countersink them the bottom of the footpad. Clean out any debris from drilling.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>

                                    <Lightbox src={["/.netlify/images?url=/images/shop/zhooks/step2.jpg"]} toggler={step2LightboxToggler} />
                                </Col>

                                <Col xs={12} md={4}>
                                    <Card>
                                        {/* Part image */}
                                        <div className="card-img-holder" onClick={() => setStep3LightboxToggler(!step3LightboxToggler)} style={{backgroundImage: `url('/.netlify/images?url=/images/shop/zhooks/step3.jpg')`}}>
                                            {item.imageSrc &&
                                                <span role="img" aria-label={"Preview imagine of step 3"}></span>
                                            }
                                        </div>

                                        <Card.Body>
                                            <Card.Title as="h3" className="flex-center">Step 3</Card.Title>

                                            <Card.Text>
                                                Tightly fasten the wedge to the footpad using your M5 screws, going up from the bottom of the footpad into the wedge.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>

                                    <Lightbox src={["/.netlify/images?url=/images/shop/zhooks/step3.jpg"]} toggler={step3LightboxToggler} />
                                </Col>

                                <Col xs={12} md={4}>
                                    <Card>
                                        {/* Part image */}
                                        <div className="card-img-holder" onClick={() => setStep4LightboxToggler(!step4LightboxToggler)} style={{backgroundImage: `url('/.netlify/images?url=/images/shop/zhooks/step4.jpg')`}}>
                                            {item.imageSrc &&
                                                <span role="img" aria-label={"Preview imagine of step 4"}></span>
                                            }
                                        </div>

                                        <Card.Body>
                                            <Card.Title as="h3" className="flex-center">Step 4</Card.Title>

                                            <Card.Text>
                                                Attach the hook to the wedge using your M6 screws and reinstall the footpad.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>

                                    <Lightbox src={["/.netlify/images?url=/images/shop/zhooks/step4.jpg"]} toggler={step4LightboxToggler} />
                                </Col>

                                <Col xs={12} md={4}>
                                    <Card>
                                        {/* Part image */}
                                        <div className="card-img-holder" onClick={() => setStep5LightboxToggler(!step5LightboxToggler)} style={{backgroundImage: `url('/.netlify/images?url=/images/shop/zhooks/step5.jpg')`}}>
                                            {item.imageSrc &&
                                                <span role="img" aria-label={"Preview imagine of step 5"}></span>
                                            }
                                        </div>

                                        <Card.Body>
                                            <Card.Title as="h3" className="flex-center">Note for Rear Footpad</Card.Title>

                                            <Card.Text>
                                                On the rear footpad, you may place the wedge wherever you like and fasten the wedge using the same steps as above.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>

                                    <Lightbox src={["/.netlify/images?url=/images/shop/zhooks/step5.jpg"]} toggler={step5LightboxToggler} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </main>
                
            <SiteFooter />
        </>
    )
}

export default Page