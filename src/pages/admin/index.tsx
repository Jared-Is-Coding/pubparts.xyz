import SiteFooter from "@components/SiteFooter"
import SiteMetaData from "@components/SiteMetaData"
import SiteNavbar from "@components/SiteNavbar"
import { getImageUrl } from "@util/images"
import { type HeadFC, type PageProps } from "gatsby"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
	Alert,
	Badge,
	Button,
	Card,
	Col,
	Container,
	Form,
	Modal,
	OverlayTrigger,
	Popover,
	Row,
	Stack,
	Tab,
	Tabs,
} from "react-bootstrap"
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
const PLATFORMS: PlatformType[] = [
	"Floatwheel",
	"GT/GT-S",
	"Miscellaneous Items",
	"Pint/X/S",
	"VESC Electronics",
	"XR/Funwheel",
	"XR Classic",
]
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
	"Tool",
]
const PART_SHOP_TYPES: PartShopType[] = [
	...PART_TYPES,
	"Axle Block Attachment",
	"Battery",
	"Bolt",
	"Charger",
	"Complete Board",
	"Display",
	"Sensor",
]
const RESOURCE_TYPES: ResourceType[] = [
	"App",
	"Github Repository",
	"Written Guide",
	"Video Guide",
	"Spreadsheet",
	"Vendor",
	"Website",
]
const ITEM_CONDITIONS: ItemCondition[] = ["New", "Like New", "Used", "For Parts"]
const API_PATHS = ["/api/admin-db", "/.netlify/functions/__api/admin-db"]

type AdminApiData = {
	parts: AdminPart[]
	resources: AdminResource[]
	shopItems: AdminShopItem[]
	pendingParts?: PartPendingData[]
	pendingResources?: ResourcePendingData[]
	partTypes?: string[]
	resourceTypes?: string[]
	buildTrigger?: {
		attempted: boolean
		ok: boolean
		message: string
	}
}

type DeleteTarget = {
	entity: "parts" | "resources" | "shop" | "pending-parts" | "pending-resources"
	id: number
	title: string
} | null

export const Head: HeadFC = () => {
	const isDevelopment = typeof window !== "undefined" && process.env.NODE_ENV === "development"

	return (
		<>
			<html lang="en" />
			{isDevelopment ? (
				<SiteMetaData title="Admin | DB" description="Development-only database admin portal" />
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
	dropboxZipLastUpdated: "",
})

const emptyResourceDraft = (): AdminResourceDraft => ({
	title: "",
	typeOfResource: [],
	externalUrl: "",
	appStoreLink: "",
	playStoreLink: "",
	description: "",
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
	featured: false,
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
		dropboxZipLastUpdated: part.dropboxZipLastUpdated ?? "",
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
		description: resource.description ?? "",
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
		featured: !!item.featured,
	}
}

function parseImageList(values: string[]): string | string[] | undefined {
	const images = values.map((entry) => entry.trim()).filter(Boolean)

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
				shopItems: payload.shopItems,
			}
		} catch (error) {
			lastError = error instanceof Error ? error : new Error("Unknown API error")
		}
	}

	throw lastError ?? new Error("Admin API endpoint could not be reached.")
}

const AdminImageUrlInputRow: React.FC<{
	value: string
	index: number
	canRemove: boolean
	disabled?: boolean
	onChange: (value: string) => void
	onAdd: () => void
	onRemove: () => void
}> = ({ value, index, canRemove, disabled, onChange, onAdd, onRemove }) => {
	const [imgError, setImgError] = useState(false)
	const trimmedValue = value.trim()
	const displaySrc = trimmedValue ? getImageUrl(trimmedValue) : ""

	useEffect(() => {
		setImgError(false)
	}, [trimmedValue])

	return (
		<Stack direction="horizontal" gap={2} className="align-items-center">
			{displaySrc && !imgError && (
				<OverlayTrigger
					trigger={["hover", "focus"]}
					rootClose
					placement="auto"
					overlay={
						<Popover
							id={`popover-image-${index}`}
							style={{
								maxWidth: "320px",
								backgroundColor: "#1e1e1e",
								borderColor: "rgba(255, 255, 255, 0.2)",
								boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
							}}>
							<Popover.Body className="p-1 text-center">
								<img
									src={displaySrc}
									alt={`Preview ${index + 1} enlarged`}
									style={{
										maxWidth: "100%",
										maxHeight: "260px",
										objectFit: "contain",
										borderRadius: "4px",
										display: "block",
										margin: "0 auto",
									}}
								/>
							</Popover.Body>
						</Popover>
					}>
					<a
						href={displaySrc}
						target="_blank"
						rel="noreferrer"
						title="Click to view full image in a new tab"
						style={{ flexShrink: 0, display: "inline-flex" }}>
						<img
							src={displaySrc}
							alt={`Preview ${index + 1}`}
							onError={() => setImgError(true)}
							style={{
								width: "42px",
								height: "42px",
								objectFit: "cover",
								borderRadius: "6px",
								border: "1px solid rgba(255, 255, 255, 0.2)",
								backgroundColor: "#111",
							}}
						/>
					</a>
				</OverlayTrigger>
			)}

			{trimmedValue && imgError && (
				<div
					title="Image preview failed to load. Check that the URL is valid."
					style={{
						width: "42px",
						height: "42px",
						borderRadius: "6px",
						border: "1px solid rgba(220, 53, 69, 0.6)",
						backgroundColor: "rgba(220, 53, 69, 0.15)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
						fontSize: "14px",
						cursor: "help",
					}}>
					⚠️
				</div>
			)}

			<Form.Control
				value={value}
				placeholder="https://..."
				disabled={disabled}
				onChange={(event) => onChange(event.target.value)}
			/>

			<Button variant="outline-success" disabled={disabled} onClick={onAdd} title="Add image field">
				+
			</Button>

			<Button
				variant="outline-danger"
				disabled={disabled || !canRemove}
				onClick={onRemove}
				title="Remove image field">
				-
			</Button>
		</Stack>
	)
}

const AdminHtmlEditorModal: React.FC<{
	show: boolean
	title: string
	value: string
	onChange: (value: string) => void
	onHide: () => void
}> = ({ show, title, value, onChange, onHide }) => {
	const editorRef = useRef<HTMLTextAreaElement>(null)
	const previewRef = useRef<HTMLDivElement>(null)
	const isSyncingScroll = useRef<"editor" | "preview" | null>(null)

	const handleEditorScroll = () => {
		if (isSyncingScroll.current === "preview") {
			return
		}
		const editor = editorRef.current
		const preview = previewRef.current
		if (!editor || !preview) return

		isSyncingScroll.current = "editor"
		const editorScrollMax = editor.scrollHeight - editor.clientHeight
		if (editorScrollMax > 0) {
			const percentage = editor.scrollTop / editorScrollMax
			const previewScrollMax = preview.scrollHeight - preview.clientHeight
			preview.scrollTop = percentage * previewScrollMax
		} else {
			preview.scrollTop = 0
		}
		requestAnimationFrame(() => {
			isSyncingScroll.current = null
		})
	}

	const handlePreviewScroll = () => {
		if (isSyncingScroll.current === "editor") {
			return
		}
		const editor = editorRef.current
		const preview = previewRef.current
		if (!editor || !preview) return

		isSyncingScroll.current = "preview"
		const previewScrollMax = preview.scrollHeight - preview.clientHeight
		if (previewScrollMax > 0) {
			const percentage = preview.scrollTop / previewScrollMax
			const editorScrollMax = editor.scrollHeight - editor.clientHeight
			editor.scrollTop = percentage * editorScrollMax
		} else {
			editor.scrollTop = 0
		}
		requestAnimationFrame(() => {
			isSyncingScroll.current = null
		})
	}

	return (
		<Modal show={show} onHide={onHide} fullscreen={true} centered={false} contentClassName="bg-dark text-light">
			<Modal.Header closeButton closeVariant="white" className="border-secondary py-2">
				<Modal.Title className="fs-5">HTML Description Editor {title ? `— ${title}` : ""}</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-3" style={{ height: "calc(100vh - 120px)" }}>
				<div className="d-flex flex-column flex-md-row h-100 gap-3">
					{/* Left / Top (Mobile): Source Input */}
					<div className="d-flex flex-column flex-grow-1" style={{ flex: "1 1 0", minHeight: 0 }}>
						<div className="d-flex justify-content-between align-items-center mb-1">
							<small
								className="text-uppercase fw-semibold"
								style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
								HTML Source (Editor)
							</small>
							<small style={{ fontSize: "11px" }}>{value.length} characters</small>
						</div>
						<Form.Control
							ref={editorRef}
							as="textarea"
							value={value}
							onChange={(event) => onChange(event.target.value)}
							onScroll={handleEditorScroll}
							className="flex-grow-1 font-monospace bg-dark text-light border-secondary"
							style={{
								resize: "none",
								minHeight: 0,
								height: "100%",
								lineHeight: "1.5",
								fontSize: "13px",
								padding: "12px",
							}}
							placeholder="<p>Enter HTML description here...</p>"
						/>
					</div>

					{/* Right / Bottom (Mobile): Rendered Preview */}
					<div className="d-flex flex-column flex-grow-1" style={{ flex: "1 1 0", minHeight: 0 }}>
						<div className="d-flex justify-content-between align-items-center mb-1">
							<small
								className="text-uppercase fw-semibold"
								style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
								Live Preview (Rendered Output)
							</small>
							<Badge bg="info" className="text-dark" style={{ fontSize: "10px" }}>
								Live Synced
							</Badge>
						</div>
						<div
							ref={previewRef}
							onScroll={handlePreviewScroll}
							className="flex-grow-1 p-3 rounded border border-secondary overflow-auto"
							style={{
								backgroundColor: "#161616",
								minHeight: 0,
								height: "100%",
								wordBreak: "break-word",
								color: "#e0e0e0",
							}}>
							{value.trim() ? (
								<div dangerouslySetInnerHTML={{ __html: value }} />
							) : (
								<p className="fst-italic mb-0">No HTML description provided.</p>
							)}
						</div>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer className="border-secondary py-2">
				<Button variant="outline-light" size="sm" onClick={onHide}>
					Close / Done
				</Button>
			</Modal.Footer>
		</Modal>
	)
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
	const [showShopHtmlModal, setShowShopHtmlModal] = useState(false)
	const [showShopInlinePreview, setShowShopInlinePreview] = useState(false)
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
				body: JSON.stringify({
					action: "triggerBuildHook",
					reason: "manual-admin-sync",
				}),
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
	const [pendingParts, setPendingParts] = useState<PartPendingData[]>([])
	const [pendingResources, setPendingResources] = useState<ResourcePendingData[]>([])
	const [allPartTypes, setAllPartTypes] = useState<string[]>(PART_TYPES)
	const [allResourceTypes, setAllResourceTypes] = useState<string[]>(RESOURCE_TYPES)
	const [selectedPendingPartId, setSelectedPendingPartId] = useState<number | undefined>(undefined)
	const [selectedPendingResourceId, setSelectedPendingResourceId] = useState<number | undefined>(undefined)
	const [pendingPartFilter, setPendingPartFilter] = useState("")
	const [pendingResourceFilter, setPendingResourceFilter] = useState("")
	const [pendingPartToResolveOnSave, setPendingPartToResolveOnSave] = useState<number | undefined>(undefined)
	const [pendingResourceToResolveOnSave, setPendingResourceToResolveOnSave] = useState<number | undefined>(undefined)
	const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)

	const selectedPart = useMemo(() => parts.find((item) => item.id === selectedPartId), [parts, selectedPartId])
	const selectedResource = useMemo(
		() => resources.find((item) => item.id === selectedResourceId),
		[resources, selectedResourceId],
	)
	const selectedShop = useMemo(
		() => shopItems.find((item) => item.id === selectedShopId),
		[shopItems, selectedShopId],
	)
	const selectedPendingPart = useMemo(
		() => pendingParts.find((item) => item.id === selectedPendingPartId),
		[pendingParts, selectedPendingPartId],
	)
	const selectedPendingResource = useMemo(
		() => pendingResources.find((item) => item.id === selectedPendingResourceId),
		[pendingResources, selectedPendingResourceId],
	)
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
	const filteredPendingParts = useMemo(() => {
		const query = pendingPartFilter.trim().toLowerCase()

		if (!query) {
			return pendingParts
		}

		return pendingParts.filter((item) => {
			return item.title.toLowerCase().includes(query) || String(item.id).includes(query)
		})
	}, [pendingParts, pendingPartFilter])
	const filteredPendingResources = useMemo(() => {
		const query = pendingResourceFilter.trim().toLowerCase()

		if (!query) {
			return pendingResources
		}

		return pendingResources.filter((item) => {
			return item.title.toLowerCase().includes(query) || String(item.id).includes(query)
		})
	}, [pendingResources, pendingResourceFilter])

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
			setPendingParts(data.pendingParts ?? [])
			setPendingResources(data.pendingResources ?? [])
			if (data.partTypes?.length) {
				setAllPartTypes(Array.from(new Set([...PART_TYPES, ...data.partTypes])))
			}
			if (data.resourceTypes?.length) {
				setAllResourceTypes(Array.from(new Set([...RESOURCE_TYPES, ...data.resourceTypes])))
			}
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
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			})

			setParts(data.parts)
			setResources(data.resources)
			setShopItems(data.shopItems)
			setPendingParts(data.pendingParts ?? [])
			setPendingResources(data.pendingResources ?? [])
			if (data.partTypes?.length) {
				setAllPartTypes(Array.from(new Set([...PART_TYPES, ...data.partTypes])))
			}
			if (data.resourceTypes?.length) {
				setAllResourceTypes(Array.from(new Set([...RESOURCE_TYPES, ...data.resourceTypes])))
			}
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

	const handleAcceptSuggestedPartType = async (name: string): Promise<void> => {
		await mutate(
			{ entity: "part-types", action: "create", name },
			`Part type "${name}" accepted and added to database.`,
		)
	}

	const handleAcceptSuggestedResourceType = async (name: string): Promise<void> => {
		await mutate(
			{ entity: "resource-types", action: "create", name },
			`Resource type "${name}" accepted and added to database.`,
		)
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

		if (entity === "pending-parts") {
			void mutate({ entity: "pending-parts", action: "delete", id }, "Pending part submission denied and deleted.")
			setSelectedPendingPartId(undefined)
			return
		}

		if (entity === "pending-resources") {
			void mutate({ entity: "pending-resources", action: "delete", id }, "Pending resource submission denied and deleted.")
			setSelectedPendingResourceId(undefined)
			return
		}

		void mutate({ entity: "shop", action: "delete", id }, "Shop item deleted.")
		setSelectedShopId(undefined)
		setShopDraft(emptyShopDraft())
	}

	const handleAcceptPendingPart = (item: PartPendingData): void => {
		const imageList = item.imageUrls.length ? item.imageUrls : [""]
		setPartDraft({
			id: undefined,
			title: item.title,
			imageSrcList: imageList,
			fabricationMethod: item.fabricationMethods,
			typeOfPart: item.partTypes,
			platform: item.platformTypes,
			externalUrl: item.externalUrl || "",
			dropboxUrl: "",
			dropboxZipLastUpdated: "",
		})
		setSelectedPartId(undefined)
		setPendingPartToResolveOnSave(item.id)
		setTabKey("parts")
		setStatus(`Accepting pending part "${item.title}". Pre-filled into a new part draft. Review or add Dropbox details, then click "Create Part" to save.`)
		setError("")
		setWarning("")
	}

	const handleAcceptPendingResource = (item: ResourcePendingData): void => {
		setResourceDraft({
			id: undefined,
			title: item.title,
			typeOfResource: item.resourceTypes,
			externalUrl: item.externalUrl || "",
			appStoreLink: item.appStoreLink || "",
			playStoreLink: item.playStoreLink || "",
			description: item.description || "",
		})
		setSelectedResourceId(undefined)
		setPendingResourceToResolveOnSave(item.id)
		setTabKey("resources")
		setStatus(`Accepting pending resource "${item.title}". Pre-filled into a new resource draft. Review, then click "Create Resource" to save.`)
		setError("")
		setWarning("")
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
		return <NotFoundPage {...pageProps} />
	}

	return (
		<>
			<header>
				<SiteNavbar />
				<h1 className="flex-center">Database Admin (Dev-Only)</h1>

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
							className="text-nowrap">
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
											onChange={(event) => setPartFilter(event.target.value)}
										/>

										<Button
											variant="outline-info"
											disabled={busy}
											onClick={() => {
												setSelectedPartId(undefined)
												setPartDraft(emptyPartDraft())
											}}>
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
												setPartDraft({
													...copiedDraft,
													id: undefined,
													title: `${copiedDraft.title} - Copy`,
												})
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
															variant={
																selectedPartId === part.id ? "info" : "outline-info"
															}
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
									{pendingPartToResolveOnSave && (
										<Alert
											variant="info"
											className="d-flex justify-content-between align-items-center mb-3">
											<div>
												<strong>Accepting Pending Part (#{pendingPartToResolveOnSave}):</strong>{" "}
												Data prefilled into draft. Add Dropbox link/date, review fields, and
												click &quot;Create Part&quot; to save to catalog and remove pending entry.
											</div>
											<Button
												variant="outline-secondary"
												size="sm"
												onClick={() => {
													setPendingPartToResolveOnSave(undefined)
													setPartDraft(emptyPartDraft())
												}}>
												Cancel Acceptance
											</Button>
										</Alert>
									)}
									<Form>
										<Form.Group className="mb-3">
											<Form.Label>Title</Form.Label>
											<Form.Control
												value={partDraft.title}
												onChange={(event) =>
													setPartDraft({
														...partDraft,
														title: event.target.value,
													})
												}
											/>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>External URL</Form.Label>
											<Form.Control
												value={partDraft.externalUrl}
												onChange={(event) =>
													setPartDraft({
														...partDraft,
														externalUrl: event.target.value,
													})
												}
											/>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Image URLs</Form.Label>
											<Stack gap={2}>
												{partDraft.imageSrcList.map((imageSrc, index) => (
													<AdminImageUrlInputRow
														key={`part-image-${index}`}
														value={imageSrc}
														index={index}
														disabled={busy}
														canRemove={partDraft.imageSrcList.length > 1}
														onChange={(value) =>
															setPartDraft({
																...partDraft,
																imageSrcList: updateImageAt(
																	partDraft.imageSrcList,
																	index,
																	value,
																),
															})
														}
														onAdd={() =>
															setPartDraft({
																...partDraft,
																imageSrcList: addImageField(partDraft.imageSrcList),
															})
														}
														onRemove={() =>
															setPartDraft({
																...partDraft,
																imageSrcList: removeImageField(
																	partDraft.imageSrcList,
																	index,
																),
															})
														}
													/>
												))}
											</Stack>
										</Form.Group>

										<Row>
											<Col xs={12} md={6}>
												<Form.Group className="mb-3">
													<Form.Label>Dropbox URL</Form.Label>
													<Form.Control
														value={partDraft.dropboxUrl}
														onChange={(event) =>
															setPartDraft({
																...partDraft,
																dropboxUrl: event.target.value,
															})
														}
													/>
												</Form.Group>
											</Col>
											<Col xs={12} md={6}>
												<Form.Group className="mb-3">
													<Form.Label>Dropbox ZIP Last Updated</Form.Label>
													<Form.Control
														type="date"
														value={partDraft.dropboxZipLastUpdated}
														onChange={(event) =>
															setPartDraft({
																...partDraft,
																dropboxZipLastUpdated: event.target.value,
															})
														}
													/>
												</Form.Group>
											</Col>
										</Row>

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
														onChange={() =>
															setPartDraft({
																...partDraft,
																fabricationMethod: toggleArrayValue(
																	partDraft.fabricationMethod,
																	value,
																),
															})
														}
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
														onChange={() =>
															setPartDraft({
																...partDraft,
																platform: toggleArrayValue(partDraft.platform, value),
															})
														}
													/>
												))}
											</div>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Part Types</Form.Label>
											<div>
												{Array.from(new Set([...allPartTypes, ...partDraft.typeOfPart])).map((value) => (
													<Form.Check
														key={value}
														inline
														type="checkbox"
														label={value}
														checked={partDraft.typeOfPart.includes(value)}
														onChange={() =>
															setPartDraft({
																...partDraft,
																typeOfPart: toggleArrayValue(
																	partDraft.typeOfPart,
																	value,
																),
															})
														}
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
														dropboxZipLastUpdated:
															partDraft.dropboxZipLastUpdated.trim() || undefined,
													}

													const isAccepting =
														!partDraft.id && pendingPartToResolveOnSave !== undefined

													void mutate(
														{
															entity: "parts",
															action: partDraft.id ? "update" : "create",
															item: payload,
															resolvedPendingId: isAccepting
																? pendingPartToResolveOnSave
																: undefined,
														},
														partDraft.id
															? "Part updated."
															: isAccepting
																? "Part created and pending submission accepted/removed."
																: "Part created.",
													)

													if (isAccepting) {
														setPendingPartToResolveOnSave(undefined)
													}
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

													setDeleteTarget({
														entity: "parts",
														id: selectedPart.id,
														title: selectedPart.title,
													})
												}}>
												Delete Selected
											</Button>
										</Stack>
									</Form>
								</Col>
							</Row>
						</Tab>

						<Tab eventKey="pending-parts" title={`Pending Parts (${pendingParts.length})`}>
							<Row>
								<Col md={4}>
									<Stack gap={2}>
										<Form.Control
											type="text"
											placeholder="Filter pending parts by id or title"
											value={pendingPartFilter}
											onChange={(event) => setPendingPartFilter(event.target.value)}
										/>

										<div style={{ maxHeight: "60vh", overflowY: "auto" }}>
											<ul style={{ listStyle: "none", paddingLeft: 0 }}>
												{filteredPendingParts.map((item) => (
													<li key={item.id} style={{ marginBottom: "0.5rem" }}>
														<Button
															className="w-100 text-start d-flex justify-content-between align-items-center"
															variant={
																selectedPendingPartId === item.id ? "info" : "outline-info"
															}
															disabled={busy}
															onClick={() => setSelectedPendingPartId(item.id)}>
															<span className="text-truncate">{item.title}</span>
															<Badge bg="secondary">
																#{item.id}
															</Badge>
														</Button>
													</li>
												))}

												{!filteredPendingParts.length && (
													<li>
														<Alert variant="light" className="mb-0">
															{pendingParts.length
																? "No pending parts match the filter."
																: "No pending parts to review."}
														</Alert>
													</li>
												)}
											</ul>
										</div>
									</Stack>
								</Col>

								<Col md={8}>
									{selectedPendingPart ? (
										<Card className="bg-dark text-light border-secondary p-4">
											<div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2 flex-wrap gap-2">
												<div>
													<h3 className="h5 text-info mb-0">{selectedPendingPart.title}</h3>
													<p className="mb-0 text-info">
														Submitted: {new Date(selectedPendingPart.createdAt).toLocaleString()}
													</p>
												</div>
												<Stack direction="horizontal" gap={2}>
													<Button
														variant="success"
														disabled={busy}
														onClick={() => handleAcceptPendingPart(selectedPendingPart)}>
														Accept Submission
													</Button>
													<Button
														variant="outline-danger"
														disabled={busy}
														onClick={() => {
															setDeleteTarget({
																entity: "pending-parts",
																id: selectedPendingPart.id,
																title: selectedPendingPart.title,
															})
														}}>
														Deny Submission
													</Button>
												</Stack>
											</div>

											<div className="mb-3">
												<p className="fw-semibold mb-1">
													External URL
												</p>
												<div>
													<a
														href={selectedPendingPart.externalUrl}
														target="_blank"
														rel="noreferrer"
														className="text-info text-break">
														{selectedPendingPart.externalUrl}
													</a>
												</div>
											</div>

											<div className="mb-3">
												<p className="fw-semibold mb-1">
													Image URL(s)
												</p>
												<Stack gap={2} className="mt-1">
													{selectedPendingPart.imageUrls.map((img, idx) => (
														<div
															key={idx}
															className="d-flex align-items-center gap-3 p-2 rounded bg-black bg-opacity-25 border border-secondary-subtle">
															<img
																src={img}
																alt=""
																style={{
																	width: "48px",
																	height: "48px",
																	objectFit: "cover",
																	borderRadius: "4px",
																}}
																onError={(e) => {
																	;(e.target as HTMLElement).style.display = "none"
																}}
															/>
															<a
																href={img}
																target="_blank"
																rel="noreferrer"
																className="text-info text-break">
																{img}
															</a>
														</div>
													))}
												</Stack>
											</div>

											<Row className="mb-3">
												<Col sm={6}>
													<p className="fw-semibold mb-1">
														Fabrication Methods
													</p>
													<div className="d-flex flex-wrap gap-1 mt-1">
														{selectedPendingPart.fabricationMethods.map((m) => (
															<Badge bg="secondary" key={m}>
																{m}
															</Badge>
														))}
													</div>
												</Col>
												<Col sm={6}>
													<p className="fw-semibold mb-1">
														Platforms
													</p>
													<div className="d-flex flex-wrap gap-1 mt-1">
														{selectedPendingPart.platformTypes.map((p) => (
															<Badge bg="primary" key={p}>
																{p}
															</Badge>
														))}
													</div>
												</Col>
											</Row>

											<div className="mb-3">
												<p className="fw-semibold mb-1">
													Part Types
												</p>
												<div className="d-flex flex-wrap gap-2 mt-1 align-items-center">
													{selectedPendingPart.partTypes.map((t) => {
														const isKnown = allPartTypes.includes(t)
														return (
															<div key={t} className="d-inline-flex align-items-center gap-1">
																<Badge bg={isKnown ? "info" : "warning"} text="dark">
																	{t}
																	{!isKnown && " (Suggested / New)"}
																</Badge>
																{!isKnown && (
																	<Button
																		size="sm"
																		variant="outline-warning"
																		className="py-0 px-2"
																		style={{ fontSize: "0.75rem" }}
																		disabled={busy}
																		onClick={() => void handleAcceptSuggestedPartType(t)}>
																		Add to Database
																	</Button>
																)}
															</div>
														)
													})}
												</div>
											</div>
										</Card>
									) : (
										<Alert variant="secondary" className="text-center py-5">
											Select a pending part submission from the list on the left to review, accept, or deny.
										</Alert>
									)}
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
											onChange={(event) => setResourceFilter(event.target.value)}
										/>

										<Button
											variant="outline-info"
											disabled={busy}
											onClick={() => {
												setSelectedResourceId(undefined)
												setResourceDraft(emptyResourceDraft())
											}}>
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
												setResourceDraft({
													...copiedDraft,
													id: undefined,
													title: `${copiedDraft.title} - Copy`,
												})
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
															variant={
																selectedResourceId === resource.id
																	? "info"
																	: "outline-info"
															}
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
									{pendingResourceToResolveOnSave && (
										<Alert
											variant="info"
											className="d-flex justify-content-between align-items-center mb-3">
											<div>
												<strong>Accepting Pending Resource (#{pendingResourceToResolveOnSave}):</strong>{" "}
												Data prefilled into draft. Review fields and click &quot;Create Resource&quot; to save to catalog and remove pending entry.
											</div>
											<Button
												variant="outline-secondary"
												size="sm"
												onClick={() => {
													setPendingResourceToResolveOnSave(undefined)
													setResourceDraft(emptyResourceDraft())
												}}>
												Cancel Acceptance
											</Button>
										</Alert>
									)}
									<Form>
										<Form.Group className="mb-3">
											<Form.Label>Title</Form.Label>
											<Form.Control
												value={resourceDraft.title}
												onChange={(event) =>
													setResourceDraft({
														...resourceDraft,
														title: event.target.value,
													})
												}
											/>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Resource Types</Form.Label>
											<div>
												{Array.from(new Set([...allResourceTypes, ...resourceDraft.typeOfResource])).map((value) => (
													<Form.Check
														key={value}
														inline
														type="checkbox"
														label={value}
														checked={resourceDraft.typeOfResource.includes(value)}
														onChange={() =>
															setResourceDraft({
																...resourceDraft,
																typeOfResource: toggleArrayValue(
																	resourceDraft.typeOfResource,
																	value,
																),
															})
														}
													/>
												))}
											</div>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>External URL</Form.Label>
											<Form.Control
												value={resourceDraft.externalUrl}
												onChange={(event) =>
													setResourceDraft({
														...resourceDraft,
														externalUrl: event.target.value,
													})
												}
											/>
										</Form.Group>

										<Row>
											<Col>
												<Form.Group className="mb-3">
													<Form.Label>App Store Link</Form.Label>
													<Form.Control
														value={resourceDraft.appStoreLink}
														onChange={(event) =>
															setResourceDraft({
																...resourceDraft,
																appStoreLink: event.target.value,
															})
														}
													/>
												</Form.Group>
											</Col>
											<Col>
												<Form.Group className="mb-3">
													<Form.Label>Play Store Link</Form.Label>
													<Form.Control
														value={resourceDraft.playStoreLink}
														onChange={(event) =>
															setResourceDraft({
																...resourceDraft,
																playStoreLink: event.target.value,
															})
														}
													/>
												</Form.Group>
											</Col>
										</Row>

										<Form.Group className="mb-3">
											<Form.Label>Description</Form.Label>
											<Form.Control
												as="textarea"
												rows={3}
												value={resourceDraft.description}
												onChange={(event) =>
													setResourceDraft({
														...resourceDraft,
														description: event.target.value,
													})
												}
											/>
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
														description: resourceDraft.description.trim() || undefined,
													}

													const isAccepting =
														!resourceDraft.id &&
														pendingResourceToResolveOnSave !== undefined

													void mutate(
														{
															entity: "resources",
															action: resourceDraft.id ? "update" : "create",
															item: payload,
															resolvedPendingId: isAccepting
																? pendingResourceToResolveOnSave
																: undefined,
														},
														resourceDraft.id
															? "Resource updated."
															: isAccepting
																? "Resource created and pending submission accepted/removed."
																: "Resource created.",
													)

													if (isAccepting) {
														setPendingResourceToResolveOnSave(undefined)
													}
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

													setDeleteTarget({
														entity: "resources",
														id: selectedResource.id,
														title: selectedResource.title,
													})
												}}>
												Delete Selected
											</Button>
										</Stack>
									</Form>
								</Col>
							</Row>
						</Tab>

						<Tab eventKey="pending-resources" title={`Pending Resources (${pendingResources.length})`}>
							<Row>
								<Col md={4}>
									<Stack gap={2}>
										<Form.Control
											type="text"
											placeholder="Filter pending resources by id or title"
											value={pendingResourceFilter}
											onChange={(event) => setPendingResourceFilter(event.target.value)}
										/>

										<div style={{ maxHeight: "60vh", overflowY: "auto" }}>
											<ul style={{ listStyle: "none", paddingLeft: 0 }}>
												{filteredPendingResources.map((item) => (
													<li key={item.id} style={{ marginBottom: "0.5rem" }}>
														<Button
															className="w-100 text-start d-flex justify-content-between align-items-center"
															variant={
																selectedPendingResourceId === item.id
																	? "info"
																	: "outline-info"
															}
															disabled={busy}
															onClick={() => setSelectedPendingResourceId(item.id)}>
															<span className="text-truncate">{item.title}</span>
															<Badge bg="secondary">
																#{item.id}
															</Badge>
														</Button>
													</li>
												))}

												{!filteredPendingResources.length && (
													<li>
														<Alert variant="light" className="mb-0">
															{pendingResources.length
																? "No pending resources match the filter."
																: "No pending resources to review."}
														</Alert>
													</li>
												)}
											</ul>
										</div>
									</Stack>
								</Col>

								<Col md={8}>
									{selectedPendingResource ? (
										<Card className="bg-dark text-light border-secondary p-4">
											<div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2 flex-wrap gap-2">
												<div>
													<h3 className="h5 text-info mb-0">{selectedPendingResource.title}</h3>
													<p className="mb-0 text-info">
														Submitted: {new Date(selectedPendingResource.createdAt).toLocaleString()}
													</p>
												</div>
												<Stack direction="horizontal" gap={2}>
													<Button
														variant="success"
														disabled={busy}
														onClick={() =>
															handleAcceptPendingResource(selectedPendingResource)
														}>
														Accept Submission
													</Button>
													<Button
														variant="outline-danger"
														disabled={busy}
														onClick={() => {
															setDeleteTarget({
																entity: "pending-resources",
																id: selectedPendingResource.id,
																title: selectedPendingResource.title,
															})
														}}>
														Deny Submission
													</Button>
												</Stack>
											</div>

											<div className="mb-3">
												<p className="fw-semibold mb-1">
													Resource Types
												</p>
												<div className="d-flex flex-wrap gap-2 mt-1 align-items-center">
													{selectedPendingResource.resourceTypes.map((t) => {
														const isKnown = allResourceTypes.includes(t)
														return (
															<div key={t} className="d-inline-flex align-items-center gap-1">
																<Badge bg={isKnown ? "info" : "warning"} text="dark">
																	{t}
																	{!isKnown && " (Suggested / New)"}
																</Badge>
																{!isKnown && (
																	<Button
																		size="sm"
																		variant="outline-warning"
																		className="py-0 px-2"
																		style={{ fontSize: "0.75rem" }}
																		disabled={busy}
																		onClick={() => void handleAcceptSuggestedResourceType(t)}>
																		Add to Database
																	</Button>
																)}
															</div>
														)
													})}
												</div>
											</div>

											<div className="mb-3">
												<p className="fw-semibold mb-1">
													External URL
												</p>
												<div>
													<a
														href={selectedPendingResource.externalUrl}
														target="_blank"
														rel="noreferrer"
														className="text-info text-break">
														{selectedPendingResource.externalUrl}
													</a>
												</div>
											</div>

											{(selectedPendingResource.appStoreLink ||
												selectedPendingResource.playStoreLink) && (
												<Row className="mb-3">
													{selectedPendingResource.appStoreLink && (
														<Col sm={6}>
															<p className="fw-semibold mb-1">
																App Store Link
															</p>
															<div>
																<a
																	href={selectedPendingResource.appStoreLink}
																	target="_blank"
																	rel="noreferrer"
																	className="text-info text-break">
																	{selectedPendingResource.appStoreLink}
																</a>
															</div>
														</Col>
													)}
													{selectedPendingResource.playStoreLink && (
														<Col sm={6}>
															<p className="fw-semibold mb-1">
																Play Store Link
															</p>
															<div>
																<a
																	href={selectedPendingResource.playStoreLink}
																	target="_blank"
																	rel="noreferrer"
																	className="text-info text-break">
																	{selectedPendingResource.playStoreLink}
																</a>
															</div>
														</Col>
													)}
												</Row>
											)}

											<div className="mb-3">
												<p className="fw-semibold mb-1">
													Description
												</p>
												<div
													className="p-3 rounded bg-black bg-opacity-25 border border-secondary-subtle"
													style={{ whiteSpace: "pre-wrap" }}>
													{selectedPendingResource.description}
												</div>
											</div>
										</Card>
									) : (
										<Alert variant="secondary" className="text-center py-5">
											Select a pending resource submission from the list on the left to review, accept, or deny.
										</Alert>
									)}
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
											onChange={(event) => setShopFilter(event.target.value)}
										/>

										<Button
											variant="outline-info"
											disabled={busy}
											onClick={() => {
												setSelectedShopId(undefined)
												setShopDraft(emptyShopDraft())
											}}>
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
												setShopDraft({
													...copiedDraft,
													id: undefined,
													title: `${copiedDraft.title} - Copy`,
												})
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
															variant={
																selectedShopId === item.id ? "info" : "outline-info"
															}
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
											<Form.Control
												value={shopDraft.title}
												onChange={(event) =>
													setShopDraft({
														...shopDraft,
														title: event.target.value,
													})
												}
											/>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>External URL</Form.Label>
											<Form.Control
												value={shopDraft.externalUrl}
												onChange={(event) =>
													setShopDraft({
														...shopDraft,
														externalUrl: event.target.value,
													})
												}
											/>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Image URLs</Form.Label>
											<Stack gap={2}>
												{shopDraft.imageSrcList.map((imageSrc, index) => (
													<AdminImageUrlInputRow
														key={`shop-image-${index}`}
														value={imageSrc}
														index={index}
														disabled={busy}
														canRemove={shopDraft.imageSrcList.length > 1}
														onChange={(value) =>
															setShopDraft({
																...shopDraft,
																imageSrcList: updateImageAt(
																	shopDraft.imageSrcList,
																	index,
																	value,
																),
															})
														}
														onAdd={() =>
															setShopDraft({
																...shopDraft,
																imageSrcList: addImageField(shopDraft.imageSrcList),
															})
														}
														onRemove={() =>
															setShopDraft({
																...shopDraft,
																imageSrcList: removeImageField(
																	shopDraft.imageSrcList,
																	index,
																),
															})
														}
													/>
												))}
											</Stack>
										</Form.Group>

										<Row>
											<Col xs={12} md={4}>
												<Form.Group className="mb-3">
													<Form.Label>Available Count</Form.Label>
													<Form.Control
														value={shopDraft.availableCount}
														type="number"
														min={0}
														onChange={(event) =>
															setShopDraft({
																...shopDraft,
																availableCount: event.target.value,
															})
														}
													/>
												</Form.Group>
											</Col>
											<Col xs={12} md={4}>
												<Form.Group className="mb-3">
													<Form.Label>Price</Form.Label>
													<Form.Control
														value={shopDraft.price}
														type="number"
														min={0}
														step="0.01"
														onChange={(event) =>
															setShopDraft({
																...shopDraft,
																price: event.target.value,
															})
														}
													/>
												</Form.Group>
											</Col>
											<Col xs={12} md={4}>
												<Form.Group className="mb-3">
													<Form.Label>Condition</Form.Label>
													<Form.Select
														value={shopDraft.condition}
														onChange={(event) =>
															setShopDraft({
																...shopDraft,
																condition: event.target.value as ItemCondition,
															})
														}>
														{ITEM_CONDITIONS.map((value) => (
															<option key={value} value={value}>
																{value}
															</option>
														))}
													</Form.Select>
												</Form.Group>
											</Col>
										</Row>

										<Form.Group className="mb-3">
											<div className="d-flex justify-content-between align-items-center mb-1">
												<Form.Label className="mb-0">Description (HTML allowed)</Form.Label>
												<Stack direction="horizontal" gap={2}>
													<Button
														variant="outline-info"
														size="sm"
														className="py-0 px-2"
														style={{ fontSize: "12px" }}
														onClick={() => setShowShopHtmlModal(true)}
														title="Open full screen split view with synchronized scrolling">
														⛶ Fullscreen Split Preview
													</Button>
													<Button
														variant={showShopInlinePreview ? "info" : "outline-secondary"}
														size="sm"
														className="py-0 px-2"
														style={{ fontSize: "12px" }}
														onClick={() => setShowShopInlinePreview(!showShopInlinePreview)}
														title="Toggle inline preview below">
														{showShopInlinePreview ? "Hide Preview" : "Show Preview"}
													</Button>
												</Stack>
											</div>
											<Form.Control
												as="textarea"
												rows={3}
												value={shopDraft.description}
												placeholder="<p>Enter HTML description...</p>"
												onChange={(event) =>
													setShopDraft({
														...shopDraft,
														description: event.target.value,
													})
												}
											/>
											{showShopInlinePreview && shopDraft.description.trim() && (
												<div
													className="mt-2 p-3 rounded"
													style={{
														backgroundColor: "#1e1e1e",
														border: "1px solid rgba(255, 255, 255, 0.15)",
														color: "#e0e0e0",
													}}>
													<small
														className="text-uppercase fw-semibold d-block mb-2 pb-1 border-bottom"
														style={{
															fontSize: "11px",
															letterSpacing: "0.5px",
															borderColor: "rgba(255, 255, 255, 0.1)",
														}}>
														HTML Live Preview
													</small>
													<div
														style={{ wordBreak: "break-word" }}
														dangerouslySetInnerHTML={{ __html: shopDraft.description }}
													/>
												</div>
											)}
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Check
												type="checkbox"
												label="Featured"
												checked={shopDraft.featured}
												onChange={(event) =>
													setShopDraft({
														...shopDraft,
														featured: event.target.checked,
													})
												}
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
														onChange={() =>
															setShopDraft({
																...shopDraft,
																platform: toggleArrayValue(shopDraft.platform, value),
															})
														}
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
														onChange={() =>
															setShopDraft({
																...shopDraft,
																typeOfPart: toggleArrayValue(
																	shopDraft.typeOfPart,
																	value,
																),
															})
														}
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
														featured: shopDraft.featured,
													}

													void mutate(
														{
															entity: "shop",
															action: shopDraft.id ? "update" : "create",
															item: payload,
														},
														shopDraft.id ? "Shop item updated." : "Shop item created.",
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

													setDeleteTarget({
														entity: "shop",
														id: selectedShop.id,
														title: selectedShop.title,
													})
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
							Delete {deleteTarget.entity === "shop" ? "shop item" : deleteTarget.entity.slice(0, -1)}{" "}
							<strong>"{deleteTarget.title}"</strong>?
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

			<AdminHtmlEditorModal
				show={showShopHtmlModal}
				title={shopDraft.title}
				value={shopDraft.description}
				onChange={(value) => setShopDraft({ ...shopDraft, description: value })}
				onHide={() => setShowShopHtmlModal(false)}
			/>

			<SiteFooter />
		</>
	)
}

export default Page
