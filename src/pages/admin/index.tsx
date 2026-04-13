import { type HeadFC, type PageProps } from "gatsby"
import React, { useEffect, useMemo, useState } from "react"
import { Alert, Badge, Button, Col, Container, Form, Modal, Row, Stack, Tab, Tabs } from "react-bootstrap"
import SiteFooter from "@components/SiteFooter"
import SiteMetaData from "@components/SiteMetaData"
import SiteNavbar from "@components/SiteNavbar"
import NotFoundPage from "../404"

type AdminPart = ItemData & { id: number }
type AdminResource = ResourceData & { id: number }
type AdminShopItem = PartsShopData & { id: number }

type AdminPartDraft = {
    id?: number
    title: string
    imageSrcList: string[]
    fabricationMethod: FabricationMethod[]
    typeOfPart: PartType[]
    platform: PlatformType[]
    externalUrl: string
    dropboxUrl: string
    dropboxZipLastUpdated: string
}

type AdminResourceDraft = {
    id?: number
    title: string
    typeOfResource: ResourceType[]
    externalUrl: string
    appStoreLink: string
    playStoreLink: string
    description: string
}

type AdminShopDraft = {
    id?: number
    title: string
    imageSrcList: string[]
    typeOfPart: PartShopType[]
    platform: PlatformType[]
    availableCount: string
    price: string
    condition: ItemCondition
    description: string
    externalUrl: string
    featured: boolean
}

const FABRICATION_METHODS: FabricationMethod[] = ["3d Printed", "CNC", "Laser", "Other", "PCB"]
const PLATFORMS: PlatformType[] = ["Floatwheel", "GT/GT-S", "Miscellaneous Items", "Pint/X/S", "VESC Electronics", "XR/Funwheel", "XR Classic"]
const PART_TYPES: PartType[] = [
    "Adapter",
    "Axle Block",
    "Battery Assembly",
    "Battery Box",
    "Bearing Cover",
    "BMS",
    "Bracket",
    "Breakout Board",
    "Bumper",
    "Connector Cover",
    "Controller Box",
    "Controller",
    "Fender",
    "Fender Attachment",
    "Fender Delete",
    "Footpad",
    "Footpad Attachment",
    "Gasket",
    "Hall Sensor",
    "LED",
    "Miscellaneous",
    "Motor",
    "Motor Cover",
    "Plug",
    "Port Cover",
    "Rail Attachment",
    "Rails",
    "Remote",
    "Rim Saver",
    "Stand",
    "Tire",
    "Tool"
]
const PART_SHOP_TYPES: PartShopType[] = [...PART_TYPES, "Axle Block Attachment", "Battery", "Bolt", "Charger", "Complete Board", "Display", "Sensor"]
const RESOURCE_TYPES: ResourceType[] = ["App", "Github Repository", "Written Guide", "Video Guide", "Spreadsheet", "Vendor", "Website"]
const ITEM_CONDITIONS: ItemCondition[] = ["New", "Like New", "Used", "For Parts"]
const API_PATHS = ["/api/admin-db", "/.netlify/functions/__api/admin-db"]

type AdminApiData = {
    parts: AdminPart[]
    resources: AdminResource[]
    shopItems: AdminShopItem[]
    buildTrigger?: {
        attempted: boolean
        ok: boolean
        message: string
    }
}

type DeleteTarget = {
    entity: "parts" | "resources" | "shop"
    id: number
    title: string
} | null

export const Head: HeadFC = () => {
    const isDevelopment = typeof window !== "undefined" && process.env.NODE_ENV === "development"

    return (
        <>
            <html lang="en" />
            {isDevelopment ? (
                <SiteMetaData
                    title="Admin | DB"
                    description="Development-only database admin portal" />
            ) : (
                <>
                    <title>404 - Not Found</title>
                    <meta name="robots" content="noindex" />
                </>
            )}
        </>
    )
}

const emptyPartDraft = (): AdminPartDraft => ({
    title: "",
    imageSrcList: [""],
    fabricationMethod: [],
    typeOfPart: [],
    platform: [],
    externalUrl: "",
    dropboxUrl: "",
    dropboxZipLastUpdated: ""
})

const emptyResourceDraft = (): AdminResourceDraft => ({
    title: "",
    typeOfResource: [],
    externalUrl: "",
    appStoreLink: "",
    playStoreLink: "",
    description: ""
})

const emptyShopDraft = (): AdminShopDraft => ({
    title: "",
    imageSrcList: [""],
    typeOfPart: [],
    platform: [],
    availableCount: "0",
    price: "0",
    condition: "New",
    description: "",
    externalUrl: "",
    featured: false
})

function toPartDraft(part: AdminPart): AdminPartDraft {
    const imageSrcList = [part.imageSrc].flat().filter(Boolean)

    return {
        id: part.id,
        title: part.title,
        imageSrcList: imageSrcList.length ? imageSrcList : [""],
        fabricationMethod: part.fabricationMethod,
        typeOfPart: part.typeOfPart,
        platform: part.platform,
        externalUrl: part.externalUrl ?? "",
        dropboxUrl: part.dropboxUrl ?? "",
        dropboxZipLastUpdated: part.dropboxZipLastUpdated ?? ""
    }
}

function toResourceDraft(resource: AdminResource): AdminResourceDraft {
    return {
        id: resource.id,
        title: resource.title,
        typeOfResource: resource.typeOfResource,
        externalUrl: resource.externalUrl ?? "",
        appStoreLink: resource.appStoreLink ?? "",
        playStoreLink: resource.playStoreLink ?? "",
        description: resource.description ?? ""
    }
}

function toShopDraft(item: AdminShopItem): AdminShopDraft {
    const imageSrcList = [item.imageSrc ?? ""].flat().filter(Boolean)

    return {
        id: item.id,
        title: item.title,
        imageSrcList: imageSrcList.length ? imageSrcList : [""],
        typeOfPart: item.typeOfPart,
        platform: item.platform,
        availableCount: String(item.availableCount),
        price: String(item.price),
        condition: item.condition,
        description: item.description ?? "",
        externalUrl: item.externalUrl ?? "",
        featured: !!item.featured
    }
}

function parseImageList(values: string[]): string | string[] | undefined {
    const images = values
        .map((entry) => entry.trim())
        .filter(Boolean)

    if (!images.length) {
        return undefined
    }

    return images.length === 1 ? images[0] : images
}

async function requestAdminApi(init?: RequestInit): Promise<AdminApiData> {
    let lastError: Error | null = null

    for (const path of API_PATHS) {
        try {
            const response = await fetch(path, init)
            const rawText = await response.text()

            let data: unknown
            try {
                data = rawText ? JSON.parse(rawText) : {}
            } catch {
                if (response.status === 404 || rawText.startsWith("<!DOCTYPE") || rawText.startsWith("<html")) {
                    continue
                }

                throw new Error(`Unexpected non-JSON response from ${path}.`)
            }

            const payload = data as { error?: string } & Partial<AdminApiData>
            if (!response.ok) {
                throw new Error(payload.error || `Request failed with status ${response.status}.`)
            }

            if (!payload.parts || !payload.resources || !payload.shopItems) {
                throw new Error("API response missing one or more datasets.")
            }

            return {
                parts: payload.parts,
                resources: payload.resources,
                shopItems: payload.shopItems
            }
        } catch (error) {
            lastError = error instanceof Error ? error : new Error("Unknown API error")
        }
    }

    throw lastError ?? new Error("Admin API endpoint could not be reached.")
}

const Page: React.FC<PageProps> = (pageProps) => {
    const isDevelopment = process.env.NODE_ENV === "development"
    const [tabKey, setTabKey] = useState<string>("parts")
    const [partFilter, setPartFilter] = useState("")
    const [resourceFilter, setResourceFilter] = useState("")
    const [shopFilter, setShopFilter] = useState("")
    const [parts, setParts] = useState<AdminPart[]>([])
    const [resources, setResources] = useState<AdminResource[]>([])
    const [shopItems, setShopItems] = useState<AdminShopItem[]>([])
    const [selectedPartId, setSelectedPartId] = useState<number | undefined>(undefined)
    const [selectedResourceId, setSelectedResourceId] = useState<number | undefined>(undefined)
    const [selectedShopId, setSelectedShopId] = useState<number | undefined>(undefined)
    const [partDraft, setPartDraft] = useState<AdminPartDraft>(emptyPartDraft())
    const [resourceDraft, setResourceDraft] = useState<AdminResourceDraft>(emptyResourceDraft())
    const [shopDraft, setShopDraft] = useState<AdminShopDraft>(emptyShopDraft())
    const [busy, setBusy] = useState(false)
    const [status, setStatus] = useState("")
    const [warning, setWarning] = useState("")
    const [error, setError] = useState("")
    const [buildSyncBusy, setBuildSyncBusy] = useState(false)
    const [buildSyncStatus, setBuildSyncStatus] = useState("")
    const [buildSyncError, setBuildSyncError] = useState("")
        // Handler for manual build hook trigger
        const handleSyncWithProduction = async () => {
            setBuildSyncBusy(true)
            setBuildSyncStatus("")
            setBuildSyncError("")
            try {
                const response = await fetch("/api/admin-db", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "triggerBuildHook", reason: "manual-admin-sync" })
                })
                const data = await response.json()
                if (data.buildTrigger?.ok) {
                    setBuildSyncStatus("Production rebuild triggered.")
                } else {
                    setBuildSyncError(data.buildTrigger?.message || "Failed to trigger production build.")
                }
            } catch (err) {
                setBuildSyncError(err instanceof Error ? err.message : "Failed to trigger production build.")
            } finally {
                setBuildSyncBusy(false)
            }
        }
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)

    const selectedPart = useMemo(() => parts.find((item) => item.id === selectedPartId), [parts, selectedPartId])
    const selectedResource = useMemo(() => resources.find((item) => item.id === selectedResourceId), [resources, selectedResourceId])
    const selectedShop = useMemo(() => shopItems.find((item) => item.id === selectedShopId), [shopItems, selectedShopId])
    const filteredParts = useMemo(() => {
        const query = partFilter.trim().toLowerCase()

        if (!query) {
            return parts
        }

        return parts.filter((item) => {
            return item.title.toLowerCase().includes(query) || String(item.id).includes(query)
        })
    }, [parts, partFilter])
    const filteredResources = useMemo(() => {
        const query = resourceFilter.trim().toLowerCase()

        if (!query) {
            return resources
        }

        return resources.filter((item) => {
            return item.title.toLowerCase().includes(query) || String(item.id).includes(query)
        })
    }, [resources, resourceFilter])
    const filteredShopItems = useMemo(() => {
        const query = shopFilter.trim().toLowerCase()

        if (!query) {
            return shopItems
        }

        return shopItems.filter((item) => {
            return item.title.toLowerCase().includes(query) || String(item.id).includes(query)
        })
    }, [shopItems, shopFilter])

    const toggleArrayValue = <T extends string>(current: T[], value: T): T[] => {
        return current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    }

    const updateImageAt = (current: string[], index: number, value: string): string[] => {
        return current.map((entry, entryIndex) => (entryIndex === index ? value : entry))
    }

    const addImageField = (current: string[]): string[] => {
        return [...current, ""]
    }

    const removeImageField = (current: string[], index: number): string[] => {
        if (current.length <= 1) {
            return [""]
        }

        const next = current.filter((_, entryIndex) => entryIndex !== index)
        return next.length ? next : [""]
    }

    const loadAll = async (): Promise<void> => {
        setBusy(true)
        setWarning("")
        setError("")

        try {
            const data = await requestAdminApi()
            setParts(data.parts)
            setResources(data.resources)
            setShopItems(data.shopItems)
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load data.")
        } finally {
            setBusy(false)
        }
    }

    const mutate = async (body: object, successMessage: string): Promise<void> => {
        setBusy(true)
        setStatus("")
        setWarning("")
        setError("")

        try {
            const data = await requestAdminApi({
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            setParts(data.parts)
            setResources(data.resources)
            setShopItems(data.shopItems)
            if (data.buildTrigger?.attempted && !data.buildTrigger.ok) {
                setStatus(successMessage)
                setWarning(`Saved, but production deploy was not triggered: ${data.buildTrigger.message}`)
            } else {
                const buildMessage = data.buildTrigger?.attempted ? ` ${data.buildTrigger.message}` : ""
                setStatus(`${successMessage}${buildMessage}`)
            }
        } catch (mutateError) {
            setError(mutateError instanceof Error ? mutateError.message : "Request failed.")
        } finally {
            setBusy(false)
        }
    }

    const confirmDelete = (): void => {
        if (!deleteTarget) {
            return
        }

        const { entity, id } = deleteTarget
        setDeleteTarget(null)

        if (entity === "parts") {
            void mutate({ entity: "parts", action: "delete", id }, "Part deleted.")
            setSelectedPartId(undefined)
            setPartDraft(emptyPartDraft())
            return
        }

        if (entity === "resources") {
            void mutate({ entity: "resources", action: "delete", id }, "Resource deleted.")
            setSelectedResourceId(undefined)
            setResourceDraft(emptyResourceDraft())
            return
        }

        void mutate({ entity: "shop", action: "delete", id }, "Shop item deleted.")
        setSelectedShopId(undefined)
        setShopDraft(emptyShopDraft())
    }

    useEffect(() => {
        if (!isDevelopment) {
            return
        }

        void loadAll()
    }, [isDevelopment])

    useEffect(() => {
        if (!selectedPart) {
            setPartDraft(emptyPartDraft())
            return
        }

        setPartDraft(toPartDraft(selectedPart))
    }, [selectedPart])

    useEffect(() => {
        if (!selectedResource) {
            setResourceDraft(emptyResourceDraft())
            return
        }

        setResourceDraft(toResourceDraft(selectedResource))
    }, [selectedResource])

    useEffect(() => {
        if (!selectedShop) {
            setShopDraft(emptyShopDraft())
            return
        }

        setShopDraft(toShopDraft(selectedShop))
    }, [selectedShop])

    if (!isDevelopment) {
        return (
            <NotFoundPage {...pageProps} />
        )
    }

    return (
        <>
            <header>
            <SiteNavbar />
                <h1 className="flex-center">
                    Database Admin (Dev-Only)
                </h1>

                <p className="tagline flex-center">
                    <br />
                </p>
            </header>

            <main className="page-items" style={{ paddingBottom: "6rem" }}>
                <Container>

                    {status && <Alert variant="success">{status}</Alert>}
                    {warning && <Alert variant="warning">{warning}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {buildSyncStatus && <Alert variant="success">{buildSyncStatus}</Alert>}
                    {buildSyncError && <Alert variant="danger">{buildSyncError}</Alert>}

                    <Stack direction="horizontal" gap={2} className="mb-3">
                        <Button variant="dark" className="text-nowrap" disabled={busy} onClick={() => void loadAll()}>
                            Reload All
                        </Button>
                        <Button
                            variant="outline-primary"
                            disabled={buildSyncBusy}
                            onClick={handleSyncWithProduction}
                            title="Trigger a production rebuild to sync the latest DB changes to the live site."
                            className="text-nowrap"
                        >
                            {buildSyncBusy ? "Syncing..." : "Sync with Production"}
                        </Button>
                    </Stack>

                    <Tabs activeKey={tabKey} onSelect={(key) => setTabKey(key ?? "parts")} className="mb-3">
                        <Tab eventKey="parts" title={`Parts (${parts.length})`}>
                            <Row>
                                <Col md={4}>
                                    <Stack gap={2}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Filter parts by id or title"
                                            value={partFilter}
                                            onChange={(event) => setPartFilter(event.target.value)} />

                                        <Button variant="outline-info" disabled={busy} onClick={() => { setSelectedPartId(undefined); setPartDraft(emptyPartDraft()); }}>
                                            New Part
                                        </Button>

                                        <Button
                                            variant="primary"
                                            disabled={busy || !selectedPart}
                                            onClick={() => {
                                                if (!selectedPart) {
                                                    return
                                                }

                                                const copiedDraft = toPartDraft(selectedPart)
                                                setPartDraft({ ...copiedDraft, id: undefined, title: `${copiedDraft.title} - Copy` })
                                                setStatus(`Copied \"${selectedPart.title}\" to a new draft.`)
                                                setError("")
                                            }}>
                                            Copy Selected
                                        </Button>

                                        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                                            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                                {filteredParts.map((part) => (
                                                    <li key={part.id} style={{ marginBottom: "0.5rem" }}>
                                                        <Button
                                                            className="w-100 text-start"
                                                            variant={selectedPartId === part.id ? "info" : "outline-info"}
                                                            disabled={busy}
                                                            onClick={() => setSelectedPartId(part.id)}>
                                                            {part.title}
                                                        </Button>
                                                    </li>
                                                ))}

                                                {!filteredParts.length && (
                                                    <li>
                                                        <Alert variant="light" className="mb-0">
                                                            No parts match the current filter.
                                                        </Alert>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </Stack>
                                </Col>

                                <Col md={8}>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control value={partDraft.title} onChange={(event) => setPartDraft({ ...partDraft, title: event.target.value })} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Image URLs</Form.Label>
                                            <Stack gap={2}>
                                                {partDraft.imageSrcList.map((imageSrc, index) => (
                                                    <Stack key={`part-image-${index}`} direction="horizontal" gap={2}>
                                                        <Form.Control
                                                            value={imageSrc}
                                                            placeholder="https://..."
                                                            onChange={(event) => setPartDraft({
                                                                ...partDraft,
                                                                imageSrcList: updateImageAt(partDraft.imageSrcList, index, event.target.value)
                                                            })} />

                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() => setPartDraft({ ...partDraft, imageSrcList: addImageField(partDraft.imageSrcList) })}>
                                                            +
                                                        </Button>

                                                        <Button
                                                            variant="outline-danger"
                                                            disabled={partDraft.imageSrcList.length === 1}
                                                            onClick={() => setPartDraft({ ...partDraft, imageSrcList: removeImageField(partDraft.imageSrcList, index) })}>
                                                            -
                                                        </Button>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Form.Group>

                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>External URL</Form.Label>
                                                    <Form.Control value={partDraft.externalUrl} onChange={(event) => setPartDraft({ ...partDraft, externalUrl: event.target.value })} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Dropbox URL</Form.Label>
                                                    <Form.Control value={partDraft.dropboxUrl} onChange={(event) => setPartDraft({ ...partDraft, dropboxUrl: event.target.value })} />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Dropbox ZIP Last Updated (YYYY-MM-DD)</Form.Label>
                                            <Form.Control type="date" value={partDraft.dropboxZipLastUpdated} onChange={(event) => setPartDraft({ ...partDraft, dropboxZipLastUpdated: event.target.value })} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Fabrication Methods</Form.Label>
                                            <div>
                                                {FABRICATION_METHODS.map((value) => (
                                                    <Form.Check
                                                        key={value}
                                                        inline
                                                        type="checkbox"
                                                        label={value}
                                                        checked={partDraft.fabricationMethod.includes(value)}
                                                        onChange={() => setPartDraft({ ...partDraft, fabricationMethod: toggleArrayValue(partDraft.fabricationMethod, value) })}
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Platforms</Form.Label>
                                            <div>
                                                {PLATFORMS.map((value) => (
                                                    <Form.Check
                                                        key={value}
                                                        inline
                                                        type="checkbox"
                                                        label={value}
                                                        checked={partDraft.platform.includes(value)}
                                                        onChange={() => setPartDraft({ ...partDraft, platform: toggleArrayValue(partDraft.platform, value) })}
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Part Types</Form.Label>
                                            <div>
                                                {PART_TYPES.map((value) => (
                                                    <Form.Check
                                                        key={value}
                                                        inline
                                                        type="checkbox"
                                                        label={value}
                                                        checked={partDraft.typeOfPart.includes(value)}
                                                        onChange={() => setPartDraft({ ...partDraft, typeOfPart: toggleArrayValue(partDraft.typeOfPart, value) })}
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>

                                        <Stack direction="horizontal" gap={2}>
                                            <Button
                                                variant="info"
                                                disabled={busy}
                                                onClick={() => {
                                                    const payload = {
                                                        id: partDraft.id,
                                                        title: partDraft.title.trim(),
                                                        imageSrc: parseImageList(partDraft.imageSrcList) ?? "",
                                                        fabricationMethod: partDraft.fabricationMethod,
                                                        typeOfPart: partDraft.typeOfPart,
                                                        platform: partDraft.platform,
                                                        externalUrl: partDraft.externalUrl.trim() || undefined,
                                                        dropboxUrl: partDraft.dropboxUrl.trim() || undefined,
                                                        dropboxZipLastUpdated: partDraft.dropboxZipLastUpdated.trim() || undefined
                                                    }

                                                    void mutate(
                                                        {
                                                            entity: "parts",
                                                            action: partDraft.id ? "update" : "create",
                                                            item: payload
                                                        },
                                                        partDraft.id ? "Part updated." : "Part created."
                                                    )
                                                }}>
                                                {partDraft.id ? "Save Changes" : "Create Part"}
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                disabled={busy || !selectedPart}
                                                onClick={() => {
                                                    if (!selectedPart) {
                                                        return
                                                    }

                                                    setDeleteTarget({ entity: "parts", id: selectedPart.id, title: selectedPart.title })
                                                }}>
                                                Delete Selected
                                            </Button>
                                        </Stack>
                                    </Form>
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="resources" title={`Resources (${resources.length})`}>
                            <Row>
                                <Col md={4}>
                                    <Stack gap={2}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Filter resources by id or title"
                                            value={resourceFilter}
                                            onChange={(event) => setResourceFilter(event.target.value)} />

                                        <Button variant="outline-info" disabled={busy} onClick={() => { setSelectedResourceId(undefined); setResourceDraft(emptyResourceDraft()); }}>
                                            New Resource
                                        </Button>

                                        <Button
                                            variant="primary"
                                            disabled={busy || !selectedResource}
                                            onClick={() => {
                                                if (!selectedResource) {
                                                    return
                                                }

                                                const copiedDraft = toResourceDraft(selectedResource)
                                                setResourceDraft({ ...copiedDraft, id: undefined, title: `${copiedDraft.title} - Copy` })
                                                setStatus(`Copied \"${selectedResource.title}\" to a new draft.`)
                                                setError("")
                                            }}>
                                            Copy Selected
                                        </Button>

                                        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                                            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                                {filteredResources.map((resource) => (
                                                    <li key={resource.id} style={{ marginBottom: "0.5rem" }}>
                                                        <Button
                                                            className="w-100 text-start"
                                                            variant={selectedResourceId === resource.id ? "info" : "outline-info"}
                                                            disabled={busy}
                                                            onClick={() => setSelectedResourceId(resource.id)}>
                                                            {resource.title}
                                                        </Button>
                                                    </li>
                                                ))}

                                                {!filteredResources.length && (
                                                    <li>
                                                        <Alert variant="light" className="mb-0">
                                                            No resources match the current filter.
                                                        </Alert>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </Stack>
                                </Col>

                                <Col md={8}>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control value={resourceDraft.title} onChange={(event) => setResourceDraft({ ...resourceDraft, title: event.target.value })} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Resource Types</Form.Label>
                                            <div>
                                                {RESOURCE_TYPES.map((value) => (
                                                    <Form.Check
                                                        key={value}
                                                        inline
                                                        type="checkbox"
                                                        label={value}
                                                        checked={resourceDraft.typeOfResource.includes(value)}
                                                        onChange={() => setResourceDraft({ ...resourceDraft, typeOfResource: toggleArrayValue(resourceDraft.typeOfResource, value) })}
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>External URL</Form.Label>
                                            <Form.Control value={resourceDraft.externalUrl} onChange={(event) => setResourceDraft({ ...resourceDraft, externalUrl: event.target.value })} />
                                        </Form.Group>

                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>App Store Link</Form.Label>
                                                    <Form.Control value={resourceDraft.appStoreLink} onChange={(event) => setResourceDraft({ ...resourceDraft, appStoreLink: event.target.value })} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Play Store Link</Form.Label>
                                                    <Form.Control value={resourceDraft.playStoreLink} onChange={(event) => setResourceDraft({ ...resourceDraft, playStoreLink: event.target.value })} />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control as="textarea" rows={3} value={resourceDraft.description} onChange={(event) => setResourceDraft({ ...resourceDraft, description: event.target.value })} />
                                        </Form.Group>

                                        <Stack direction="horizontal" gap={2}>
                                            <Button
                                                variant="info"
                                                disabled={busy}
                                                onClick={() => {
                                                    const payload = {
                                                        id: resourceDraft.id,
                                                        title: resourceDraft.title.trim(),
                                                        typeOfResource: resourceDraft.typeOfResource,
                                                        externalUrl: resourceDraft.externalUrl.trim() || undefined,
                                                        appStoreLink: resourceDraft.appStoreLink.trim() || undefined,
                                                        playStoreLink: resourceDraft.playStoreLink.trim() || undefined,
                                                        description: resourceDraft.description.trim() || undefined
                                                    }

                                                    void mutate(
                                                        {
                                                            entity: "resources",
                                                            action: resourceDraft.id ? "update" : "create",
                                                            item: payload
                                                        },
                                                        resourceDraft.id ? "Resource updated." : "Resource created."
                                                    )
                                                }}>
                                                {resourceDraft.id ? "Save Changes" : "Create Resource"}
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                disabled={busy || !selectedResource}
                                                onClick={() => {
                                                    if (!selectedResource) {
                                                        return
                                                    }

                                                    setDeleteTarget({ entity: "resources", id: selectedResource.id, title: selectedResource.title })
                                                }}>
                                                Delete Selected
                                            </Button>
                                        </Stack>
                                    </Form>
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="shop" title={`Shop Items (${shopItems.length})`}>
                            <Row>
                                <Col md={4}>
                                    <Stack gap={2}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Filter shop items by id or title"
                                            value={shopFilter}
                                            onChange={(event) => setShopFilter(event.target.value)} />

                                        <Button variant="outline-info" disabled={busy} onClick={() => { setSelectedShopId(undefined); setShopDraft(emptyShopDraft()); }}>
                                            New Shop Item
                                        </Button>

                                        <Button
                                            variant="primary"
                                            disabled={busy || !selectedShop}
                                            onClick={() => {
                                                if (!selectedShop) {
                                                    return
                                                }

                                                const copiedDraft = toShopDraft(selectedShop)
                                                setShopDraft({ ...copiedDraft, id: undefined, title: `${copiedDraft.title} - Copy` })
                                                setStatus(`Copied \"${selectedShop.title}\" to a new draft.`)
                                                setError("")
                                            }}>
                                            Copy Selected
                                        </Button>

                                        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                                            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                                {filteredShopItems.map((item) => (
                                                    <li key={item.id} style={{ marginBottom: "0.5rem" }}>
                                                        <Button
                                                            className="w-100 text-start"
                                                            variant={selectedShopId === item.id ? "info" : "outline-info"}
                                                            disabled={busy}
                                                            onClick={() => setSelectedShopId(item.id)}>
                                                            {item.title}
                                                        </Button>
                                                    </li>
                                                ))}

                                                {!filteredShopItems.length && (
                                                    <li>
                                                        <Alert variant="light" className="mb-0">
                                                            No shop items match the current filter.
                                                        </Alert>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </Stack>
                                </Col>

                                <Col md={8}>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control value={shopDraft.title} onChange={(event) => setShopDraft({ ...shopDraft, title: event.target.value })} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Image URLs</Form.Label>
                                            <Stack gap={2}>
                                                {shopDraft.imageSrcList.map((imageSrc, index) => (
                                                    <Stack key={`shop-image-${index}`} direction="horizontal" gap={2}>
                                                        <Form.Control
                                                            value={imageSrc}
                                                            placeholder="https://..."
                                                            onChange={(event) => setShopDraft({
                                                                ...shopDraft,
                                                                imageSrcList: updateImageAt(shopDraft.imageSrcList, index, event.target.value)
                                                            })} />

                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() => setShopDraft({ ...shopDraft, imageSrcList: addImageField(shopDraft.imageSrcList) })}>
                                                            +
                                                        </Button>

                                                        <Button
                                                            variant="outline-danger"
                                                            disabled={shopDraft.imageSrcList.length === 1}
                                                            onClick={() => setShopDraft({ ...shopDraft, imageSrcList: removeImageField(shopDraft.imageSrcList, index) })}>
                                                            -
                                                        </Button>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Form.Group>

                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Available Count</Form.Label>
                                                    <Form.Control value={shopDraft.availableCount} onChange={(event) => setShopDraft({ ...shopDraft, availableCount: event.target.value })} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Price</Form.Label>
                                                    <Form.Control value={shopDraft.price} onChange={(event) => setShopDraft({ ...shopDraft, price: event.target.value })} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Condition</Form.Label>
                                                    <Form.Select value={shopDraft.condition} onChange={(event) => setShopDraft({ ...shopDraft, condition: event.target.value as ItemCondition })}>
                                                        {ITEM_CONDITIONS.map((value) => (
                                                            <option key={value} value={value}>{value}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>External URL</Form.Label>
                                            <Form.Control value={shopDraft.externalUrl} onChange={(event) => setShopDraft({ ...shopDraft, externalUrl: event.target.value })} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Description (HTML allowed)</Form.Label>
                                            <Form.Control as="textarea" rows={3} value={shopDraft.description} onChange={(event) => setShopDraft({ ...shopDraft, description: event.target.value })} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Featured"
                                                checked={shopDraft.featured}
                                                onChange={(event) => setShopDraft({ ...shopDraft, featured: event.target.checked })}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Platforms</Form.Label>
                                            <div>
                                                {PLATFORMS.map((value) => (
                                                    <Form.Check
                                                        key={value}
                                                        inline
                                                        type="checkbox"
                                                        label={value}
                                                        checked={shopDraft.platform.includes(value)}
                                                        onChange={() => setShopDraft({ ...shopDraft, platform: toggleArrayValue(shopDraft.platform, value) })}
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Part Types</Form.Label>
                                            <div>
                                                {PART_SHOP_TYPES.map((value) => (
                                                    <Form.Check
                                                        key={value}
                                                        inline
                                                        type="checkbox"
                                                        label={value}
                                                        checked={shopDraft.typeOfPart.includes(value)}
                                                        onChange={() => setShopDraft({ ...shopDraft, typeOfPart: toggleArrayValue(shopDraft.typeOfPart, value) })}
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>

                                        <Stack direction="horizontal" gap={2}>
                                            <Button
                                                variant="info"
                                                disabled={busy}
                                                onClick={() => {
                                                    const payload = {
                                                        id: shopDraft.id,
                                                        title: shopDraft.title.trim(),
                                                        imageSrc: parseImageList(shopDraft.imageSrcList),
                                                        typeOfPart: shopDraft.typeOfPart,
                                                        platform: shopDraft.platform,
                                                        availableCount: Number(shopDraft.availableCount) || 0,
                                                        price: Number(shopDraft.price) || 0,
                                                        condition: shopDraft.condition,
                                                        description: shopDraft.description.trim() || undefined,
                                                        externalUrl: shopDraft.externalUrl.trim() || undefined,
                                                        featured: shopDraft.featured
                                                    }

                                                    void mutate(
                                                        {
                                                            entity: "shop",
                                                            action: shopDraft.id ? "update" : "create",
                                                            item: payload
                                                        },
                                                        shopDraft.id ? "Shop item updated." : "Shop item created."
                                                    )
                                                }}>
                                                {shopDraft.id ? "Save Changes" : "Create Shop Item"}
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                disabled={busy || !selectedShop}
                                                onClick={() => {
                                                    if (!selectedShop) {
                                                        return
                                                    }

                                                    setDeleteTarget({ entity: "shop", id: selectedShop.id, title: selectedShop.title })
                                                }}>
                                                Delete Selected
                                            </Button>
                                        </Stack>
                                    </Form>
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Container>
            </main>

            <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {deleteTarget && (
                        <p className="mb-0">
                            Delete {deleteTarget.entity === "shop" ? "shop item" : deleteTarget.entity.slice(0, -1)} <strong>"{deleteTarget.title}"</strong>?
                        </p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setDeleteTarget(null)} disabled={busy}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete} disabled={busy || !deleteTarget}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <SiteFooter />
        </>
    )
}

export default Page