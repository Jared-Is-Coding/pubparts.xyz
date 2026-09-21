import React, { useEffect, useState } from "react"
import type { HeadFC, PageProps } from "gatsby"
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner, Stack } from "react-bootstrap"
import {
	FaArrowLeft,
	FaArrowRight,
	FaBookOpen,
	FaCircleCheck,
	FaCircleExclamation,
	FaCube,
	FaPlus,
	FaTrash,
} from "react-icons/fa6"
import SiteNavbar from "@components/SiteNavbar"
import SiteFooter from "@components/SiteFooter"
import SiteMetaData from "@components/SiteMetaData"
import TurnstileWidget from "@components/TurnstileWidget"
import {
	ALLOWED_DOMAINS,
	FABRICATION_METHODS,
	isAllowedImageUrl,
	isAllowedPartUrl,
	PART_TYPES,
	PLATFORMS,
	RESOURCE_TYPES,
} from "@util/catalogConstants"
import { DiscordInvite, DiscordThread } from "@util/siteVariables"
import "@scss/pages/propose.scss"

export const Head: HeadFC = () => (
	<>
		<html lang="en" />
		<SiteMetaData
			title="Submit Changes | PubParts.xyz"
			description="Submit new open-source parts or community resources to PubParts.xyz for review."
		/>
	</>
)

type SubmissionKind = "part" | "resource" | null

type PartDraft = {
	title: string
	externalUrl: string
	imageUrls: string[]
	fabricationMethods: FabricationMethod[]
	platformTypes: PlatformType[]
	partTypes: PartType[]
}

type ResourceDraft = {
	title: string
	resourceTypes: ResourceType[]
	externalUrl: string
	appStoreLink: string
	playStoreLink: string
	description: string
}

const emptyPartDraft = (): PartDraft => ({
	title: "",
	externalUrl: "",
	imageUrls: [""],
	fabricationMethods: [],
	platformTypes: [],
	partTypes: [],
})

const emptyResourceDraft = (): ResourceDraft => ({
	title: "",
	resourceTypes: [],
	externalUrl: "",
	appStoreLink: "",
	playStoreLink: "",
	description: "",
})

const API_PROPOSE_PATHS = ["/api/propose", "/.netlify/functions/__api/propose"]

const ProposePage: React.FC<PageProps> = () => {
	const [selectedKind, setSelectedKind] = useState<SubmissionKind>(null)
	const [partDraft, setPartDraft] = useState<PartDraft>(emptyPartDraft())
	const [resourceDraft, setResourceDraft] = useState<ResourceDraft>(emptyResourceDraft())

	const [hasOtherPartType, setHasOtherPartType] = useState(false)
	const [otherPartType, setOtherPartType] = useState("")
	const [hasOtherResourceType, setHasOtherResourceType] = useState(false)
	const [otherResourceType, setOtherResourceType] = useState("")

	const [turnstileToken, setTurnstileToken] = useState<string>("")
	const [turnstileSiteKey, setTurnstileSiteKey] = useState<string>(process.env.TURNSTILE_SITE_KEY || "")

	const [submitting, setSubmitting] = useState(false)
	const [submitSuccess, setSubmitSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	// Discover site key dynamically if not statically replaced at compile-time
	useEffect(() => {
		if (turnstileSiteKey) {
			return
		}

		let isCancelled = false
		const fetchConfig = async () => {
			for (const path of API_PROPOSE_PATHS) {
				try {
					const res = await fetch(path)
					if (res.ok) {
						const data = await res.json()
						if (!isCancelled && data.turnstileSiteKey) {
							setTurnstileSiteKey(data.turnstileSiteKey)
							return
						}
					}
				} catch {
					// Try next path
				}
			}
		}

		void fetchConfig()

		return () => {
			isCancelled = true
		}
	}, [turnstileSiteKey])

	const toggleArrayItem = <T extends string>(current: T[], item: T): T[] => {
		return current.includes(item) ? current.filter((x) => x !== item) : [...current, item]
	}

	const updateImageAt = (index: number, val: string): void => {
		setPartDraft((prev) => ({
			...prev,
			imageUrls: prev.imageUrls.map((entry, idx) => (idx === index ? val : entry)),
		}))
	}

	const addImageField = (): void => {
		setPartDraft((prev) => ({
			...prev,
			imageUrls: [...prev.imageUrls, ""],
		}))
	}

	const removeImageField = (index: number): void => {
		setPartDraft((prev) => ({
			...prev,
			imageUrls: prev.imageUrls.length <= 1 ? [""] : prev.imageUrls.filter((_, idx) => idx !== index),
		}))
	}

	const resetSubmission = (): void => {
		setSelectedKind(null)
		setPartDraft(emptyPartDraft())
		setResourceDraft(emptyResourceDraft())
		setHasOtherPartType(false)
		setOtherPartType("")
		setHasOtherResourceType(false)
		setOtherResourceType("")
		setTurnstileToken("")
		setSubmitting(false)
		setSubmitSuccess(false)
		setErrorMessage("")
	}

	const submitPayload = async (bodyPayload: object): Promise<void> => {
		setSubmitting(true)
		setErrorMessage("")

		let lastErr: Error | null = null
		for (const path of API_PROPOSE_PATHS) {
			try {
				const res = await fetch(path, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(bodyPayload),
				})

				const data = await res.json().catch(() => ({}))
				if (!res.ok) {
					throw new Error(data.error || `Server responded with status ${res.status}`)
				}

				setSubmitSuccess(true)
				setSubmitting(false)
				return
			} catch (err) {
				lastErr = err instanceof Error ? err : new Error("Failed to submit")
			}
		}

		setErrorMessage(lastErr?.message || "Failed to submit. Please try again.")
		setSubmitting(false)
	}

	const handleSubmitPart = (e: React.FormEvent): void => {
		e.preventDefault()

		const title = partDraft.title.trim()
		const externalUrl = partDraft.externalUrl.trim()
		const imageUrls = partDraft.imageUrls.map((u) => u.trim()).filter(Boolean)

		if (!title) {
			setErrorMessage("Please enter a part title.")
			return
		}

		if (!externalUrl) {
			setErrorMessage("Please provide the external repository link for this part.")
			return
		}

		if (!isAllowedPartUrl(externalUrl)) {
			setErrorMessage(
				"Part external URL must be from an allowed repository: MakerWorld, Printables, Thingiverse, Cults, MyMiniFactory, Sketchfab, CGTrader, TurboSquid, Fab, Yeggi, STLFinder, or Thangs.",
			)
			return
		}

		if (!imageUrls.length) {
			setErrorMessage("Please provide at least one image URL for the part.")
			return
		}

		for (const imgUrl of imageUrls) {
			if (!isAllowedImageUrl(imgUrl)) {
				setErrorMessage(`Image URL "${imgUrl}" must be hosted on an allowed repository domain.`)
				return
			}
		}

		if (!partDraft.fabricationMethods.length) {
			setErrorMessage("Please select at least one fabrication method.")
			return
		}

		if (!partDraft.platformTypes.length) {
			setErrorMessage("Please select at least one platform type.")
			return
		}

		const trimmedOtherPart = hasOtherPartType ? otherPartType.trim() : ""
		if (hasOtherPartType && !trimmedOtherPart) {
			setErrorMessage("Please enter a suggested part type or uncheck 'Other'.")
			return
		}

		const resolvedPartTypes = [...partDraft.partTypes]
		if (trimmedOtherPart) {
			const existingMatch = PART_TYPES.find((pt) => pt.toLowerCase() === trimmedOtherPart.toLowerCase())
			const typeToAdd = (existingMatch ?? trimmedOtherPart) as PartType
			if (!resolvedPartTypes.includes(typeToAdd)) {
				resolvedPartTypes.push(typeToAdd)
			}
		}

		if (!resolvedPartTypes.length) {
			setErrorMessage("Please select or suggest at least one part type.")
			return
		}

		if (turnstileSiteKey && !turnstileToken) {
			setErrorMessage("Please complete the verification widget before submitting.")
			return
		}

		void submitPayload({
			type: "part",
			turnstileToken,
			item: {
				title,
				externalUrl,
				imageUrls,
				fabricationMethods: partDraft.fabricationMethods,
				platformTypes: partDraft.platformTypes,
				partTypes: resolvedPartTypes,
			},
		})
	}

	const handleSubmitResource = (e: React.FormEvent): void => {
		e.preventDefault()

		const title = resourceDraft.title.trim()
		const externalUrl = resourceDraft.externalUrl.trim()
		const description = resourceDraft.description.trim()

		if (!title) {
			setErrorMessage("Please enter a resource title.")
			return
		}

		const trimmedOtherResource = hasOtherResourceType ? otherResourceType.trim() : ""
		if (hasOtherResourceType && !trimmedOtherResource) {
			setErrorMessage("Please enter a suggested resource type or uncheck 'Other'.")
			return
		}

		const resolvedResourceTypes = [...resourceDraft.resourceTypes]
		if (trimmedOtherResource) {
			const existingMatch = RESOURCE_TYPES.find((rt) => rt.toLowerCase() === trimmedOtherResource.toLowerCase())
			const typeToAdd = (existingMatch ?? trimmedOtherResource) as ResourceType
			if (!resolvedResourceTypes.includes(typeToAdd)) {
				resolvedResourceTypes.push(typeToAdd)
			}
		}

		if (!resolvedResourceTypes.length) {
			setErrorMessage("Please select or suggest at least one resource type.")
			return
		}

		if (!externalUrl) {
			setErrorMessage("Please provide an external URL for the resource.")
			return
		}

		if (!description) {
			setErrorMessage("Please enter a description for the resource.")
			return
		}

		if (turnstileSiteKey && !turnstileToken) {
			setErrorMessage("Please complete the verification widget before submitting.")
			return
		}

		void submitPayload({
			type: "resource",
			turnstileToken,
			item: {
				title,
				resourceTypes: resolvedResourceTypes,
				externalUrl,
				appStoreLink: resourceDraft.appStoreLink.trim() || undefined,
				playStoreLink: resourceDraft.playStoreLink.trim() || undefined,
				description,
			},
		})
	}

	return (
		<>
			<header>
				<SiteNavbar />
				<h1 className="flex-center">Submit Changes</h1>
				<p className="tagline flex-center">
					<br />
				</p>
			</header>

			<main className="page-propose" style={{ minHeight: "65vh", paddingBottom: "5rem" }}>
				<Container>
					{/* Success Screen */}
					{submitSuccess ? (
						<div className="d-flex justify-content-center my-4">
							<Card className="text-center p-4 p-md-5 shadow-lg" style={{ maxWidth: "680px" }}>
								<Card.Body>
									<div className="mb-3">
										<FaCircleCheck size={56} style={{ color: "#9fffff" }} />
									</div>
									<h2 className="mb-3">Submission Received!</h2>
									<p className="mb-3">
										Thank you for contributing to PubParts.xyz! Your proposal has been submitted to
										the queue.
									</p>
									<p className="mb-4">
										You can also discuss additions or ask questions in the{" "}
										<a href={DiscordThread} target="_blank" rel="noreferrer">
											Vescify Discord thread
										</a>
										.
									</p>
									<Stack direction="horizontal" gap={3} className="justify-content-center flex-wrap">
										<Button variant="outline-info" onClick={resetSubmission}>
											Submit Another Item
										</Button>
										<Button variant="outline-info" href="/">
											Return to Catalog
										</Button>
									</Stack>
								</Card.Body>
							</Card>
						</div>
					) : (
						<>
							{/* Two Center Tiles Selection */}
							{selectedKind === null && (
								<div className="my-3">
									<p>
										Help build the community library by submitting open-source hardware parts or
										helpful OneWheel resources for inclusion in the catalog.
									</p>

									<p>What would you like to submit?</p>

									<Row className="g-4 justify-content-center">
										{/* Part Tile */}
										<Col xs={12} md={6} lg={5}>
											<Card
												role="button"
												tabIndex={0}
												className="card-tile h-100 p-4 shadow-lg d-flex flex-column justify-content-between"
												onClick={() => setSelectedKind("part")}
												onKeyDown={(e) => e.key === "Enter" && setSelectedKind("part")}>
												<Card.Body className="p-0">
													<div className="d-flex align-items-center gap-3 mb-3">
														<div className="tile-icon-holder">
															<FaCube size={28} />
														</div>
														<div>
															<Card.Title as="h3" className="mb-0">
																New Part
															</Card.Title>
															<p className="card-subtitle mt-1 mb-0">
																Hardware &amp; Accessories
															</p>
														</div>
													</div>

													<p className="card-text mb-3">
														Submit a 3D-printable or machined component, bumper, footpad,
														fender, rail attachment, or DIY enclosure.
													</p>

													<div className="mb-4 d-flex flex-wrap gap-1">
														<Badge pill bg="dark">
															3D Print / STEP
														</Badge>
														<Badge pill bg="dark">
															MakerWorld
														</Badge>
														<Badge pill bg="dark">
															Printables
														</Badge>
														<Badge pill bg="dark">
															Thingiverse
														</Badge>
														<Badge pill bg="dark">
															Thangs
														</Badge>
													</div>
												</Card.Body>

												<div className="tile-action-footer">
													<p className="mb-0">Propose Part</p>
													<FaArrowRight />
												</div>
											</Card>
										</Col>

										{/* Resource Tile */}
										<Col xs={12} md={6} lg={5}>
											<Card
												role="button"
												tabIndex={0}
												className="card-tile h-100 p-4 shadow-lg d-flex flex-column justify-content-between"
												onClick={() => setSelectedKind("resource")}
												onKeyDown={(e) => e.key === "Enter" && setSelectedKind("resource")}>
												<Card.Body className="p-0">
													<div className="d-flex align-items-center gap-3 mb-3">
														<div className="tile-icon-holder">
															<FaBookOpen size={26} />
														</div>
														<div>
															<Card.Title as="h3" className="mb-0">
																New Resource
															</Card.Title>
															<p className="card-subtitle mt-1 mb-0">
																Guides &amp; Tools
															</p>
														</div>
													</div>

													<p className="card-text mb-3">
														Share an application, code repository, build guide, battery
														spreadsheet, or trusted vendor with the community.
													</p>

													<div className="mb-4 d-flex flex-wrap gap-1">
														<Badge pill bg="dark">
															Applications
														</Badge>
														<Badge pill bg="dark">
															Repositories
														</Badge>
														<Badge pill bg="dark">
															Spreadsheets
														</Badge>
														<Badge pill bg="dark">
															Guides
														</Badge>
														<Badge pill bg="dark">
															Vendors
														</Badge>
													</div>
												</Card.Body>

												<div className="tile-action-footer">
													<p className="mb-0">Propose Resource</p>
													<FaArrowRight />
												</div>
											</Card>
										</Col>
									</Row>

									{/* Discord Callout */}
									<p className="text-center mt-5">
										Prefer to chat or have questions? Join the{" "}
										<a href={DiscordInvite} target="_blank" rel="noreferrer">
											Vescify Discord
										</a>{" "}
										and post in our{" "}
										<a href={DiscordThread} target="_blank" rel="noreferrer">
											Parts Submissions Thread
										</a>
										.
									</p>
								</div>
							)}

							{/* Form View */}
							{selectedKind !== null && (
								<div className="d-flex justify-content-center my-3">
									<Card className="shadow-lg w-100" style={{ maxWidth: "860px" }}>
										<Card.Header className="d-flex justify-content-between align-items-center py-3">
											<Button
												variant="outline-info"
												className="d-inline-flex align-items-center gap-2"
												onClick={() => {
													setSelectedKind(null)
													setErrorMessage("")
												}}>
												<FaArrowLeft />
												<span>Back to Selection</span>
											</Button>
											<Badge pill bg="info" className="text-dark py-2 px-3">
												{selectedKind === "part" ? "Submit New Part" : "Submit New Resource"}
											</Badge>
										</Card.Header>

										<Card.Body className="p-4 p-md-5">
											{errorMessage && (
												<Alert
													variant="danger"
													dismissible
													onClose={() => setErrorMessage("")}
													className="d-flex align-items-center gap-2">
													<FaCircleExclamation />
													<span>{errorMessage}</span>
												</Alert>
											)}

											{/* Part Form */}
											{selectedKind === "part" && (
												<Form onSubmit={handleSubmitPart}>
													{/* Title */}
													<Form.Group className="mb-3" controlId="partTitle">
														<Form.Label>
															Part Title <span className="text-danger">*</span>
														</Form.Label>
														<Form.Control
															type="text"
															required
															placeholder="e.g. Pint Heavy Duty Bumper v2"
															value={partDraft.title}
															onChange={(e) =>
																setPartDraft({ ...partDraft, title: e.target.value })
															}
														/>
													</Form.Group>

													{/* External URL with Live Whitelist Indicator */}
													<Form.Group className="mb-3" controlId="partExternalUrl">
														<div className="d-flex justify-content-between align-items-center mb-1">
															<Form.Label className="mb-0">
																External URL <span className="text-danger">*</span>
															</Form.Label>
															{partDraft.externalUrl && (
																<Badge
																	bg={
																		isAllowedPartUrl(partDraft.externalUrl)
																			? "success"
																			: "danger"
																	}>
																	{isAllowedPartUrl(partDraft.externalUrl)
																		? "✓"
																		: "✗ Domain Not Whitelisted"}
																</Badge>
															)}
														</div>
														<Form.Control
															type="url"
															required
															placeholder="https://www.printables.com/model/123456"
															value={partDraft.externalUrl}
															onChange={(e) =>
																setPartDraft({
																	...partDraft,
																	externalUrl: e.target.value,
																})
															}
														/>
														<p className="form-text mt-1 mb-0">
															Whitelisted: MakerWorld, Printables, Thingiverse, Cults,
															MyMiniFactory, Sketchfab, CGTrader, TurboSquid, Fab, Yeggi,
															STLFinder, and Thangs.
														</p>
													</Form.Group>

													{/* Image URLs with dynamic rows & thumbnail previews */}
													<Form.Group className="mb-3">
														<Form.Label>
															Image URL(s) <span className="text-danger">*</span>
														</Form.Label>
														<Stack gap={2}>
															{partDraft.imageUrls.map((imageUrl, idx) => {
																const isValidDomain = isAllowedImageUrl(imageUrl)
																return (
																	<div
																		key={`img-field-${idx}`}
																		className="d-flex flex-column gap-1">
																		<div className="d-flex gap-2 align-items-center">
																			<Form.Control
																				type="url"
																				placeholder="https://media.printables.com/.../image.webp"
																				value={imageUrl}
																				onChange={(e) =>
																					updateImageAt(idx, e.target.value)
																				}
																			/>
																			{partDraft.imageUrls.length > 1 && (
																				<Button
																					variant="outline-danger"
																					onClick={() =>
																						removeImageField(idx)
																					}
																					aria-label="Remove image URL">
																					<FaTrash />
																				</Button>
																			)}
																		</div>
																		{imageUrl && (
																			<div className="image-preview-row d-flex align-items-center gap-3">
																				<Badge
																					bg={
																						isValidDomain
																							? "success"
																							: "danger"
																					}>
																					{isValidDomain
																						? "✓"
																						: "✗ Not Whitelisted"}
																				</Badge>
																				{isValidDomain && (
																					<img
																						src={imageUrl}
																						alt="Preview"
																						style={{
																							width: "40px",
																							height: "40px",
																							objectFit: "cover",
																							borderRadius: "4px",
																						}}
																						onError={(e) => {
																							;(
																								e.target as HTMLImageElement
																							).style.display = "none"
																						}}
																					/>
																				)}
																				<span
																					className="text-truncate"
																					style={{ color: "#9fffff" }}>
																					{imageUrl}
																				</span>
																			</div>
																		)}
																	</div>
																)
															})}

															<div>
																<Button
																	variant="outline-info"
																	className="d-inline-flex align-items-center gap-1 mt-1"
																	onClick={addImageField}>
																	<FaPlus size={12} />
																	<span>Add another image URL</span>
																</Button>
															</div>
														</Stack>
													</Form.Group>

													{/* Fabrication Methods */}
													<Form.Group className="mb-3">
														<Form.Label>
															Fabrication Method(s) <span className="text-danger">*</span>
														</Form.Label>
														<div>
															{FABRICATION_METHODS.map((method) => (
																<Form.Check
																	key={method}
																	inline
																	type="checkbox"
																	id={`fab-${method}`}
																	label={method}
																	checked={partDraft.fabricationMethods.includes(
																		method,
																	)}
																	onChange={() =>
																		setPartDraft((prev) => ({
																			...prev,
																			fabricationMethods: toggleArrayItem(
																				prev.fabricationMethods,
																				method,
																			),
																		}))
																	}
																/>
															))}
														</div>
													</Form.Group>

													{/* Platforms */}
													<Form.Group className="mb-3">
														<Form.Label>
															Platform Type(s) <span className="text-danger">*</span>
														</Form.Label>
														<div>
															{PLATFORMS.map((platform) => (
																<Form.Check
																	key={platform}
																	inline
																	type="checkbox"
																	id={`plat-${platform}`}
																	label={platform}
																	checked={partDraft.platformTypes.includes(platform)}
																	onChange={() =>
																		setPartDraft((prev) => ({
																			...prev,
																			platformTypes: toggleArrayItem(
																				prev.platformTypes,
																				platform,
																			),
																		}))
																	}
																/>
															))}
														</div>
													</Form.Group>

													{/* Part Types */}
													<Form.Group className="mb-4">
														<Form.Label>
															Part Type(s) <span className="text-danger">*</span>
														</Form.Label>
														<div className="parts-type-box">
															<Row xs={1} sm={2} md={3} className="g-2">
																{PART_TYPES.map((pt) => (
																	<Col key={pt}>
																		<Form.Check
																			type="checkbox"
																			id={`part-type-${pt}`}
																			label={pt}
																			checked={partDraft.partTypes.includes(pt)}
																			onChange={() =>
																				setPartDraft((prev) => ({
																					...prev,
																					partTypes: toggleArrayItem(
																						prev.partTypes,
																						pt,
																					),
																				}))
																			}
																		/>
																	</Col>
																))}
																<Col key="other">
																	<Form.Check
																		type="checkbox"
																		id="part-type-other"
																		label="Other"
																		checked={hasOtherPartType}
																		onChange={(e) => {
																			setHasOtherPartType(e.target.checked)
																			if (!e.target.checked) {
																				setOtherPartType("")
																			}
																		}}
																	/>
																</Col>
															</Row>
														</div>
														{hasOtherPartType && (
															<div className="mt-2">
																<Form.Control
																	type="text"
																	placeholder="Suggest a new part type..."
																	value={otherPartType}
																	onChange={(e) => setOtherPartType(e.target.value)}
																	maxLength={50}
																/>
																<p className="text-muted mt-1 mb-0">
																	Suggest a part type not listed above for
																	consideration by the site admin.
																</p>
															</div>
														)}
													</Form.Group>

													{/* Optional Turnstile */}
													{turnstileSiteKey && (
														<TurnstileWidget
															siteKey={turnstileSiteKey}
															onSuccess={(tok) => setTurnstileToken(tok)}
															onExpire={() => setTurnstileToken("")}
															onError={() => setTurnstileToken("")}
														/>
													)}

													{/* Submit Button */}
													<div className="d-grid gap-2 mt-4">
														<Button
															variant="outline-info"
															type="submit"
															disabled={submitting}>
															{submitting ? (
																<>
																	<Spinner
																		animation="border"
																		size="sm"
																		className="me-2"
																	/>
																	Submitting Part Proposal...
																</>
															) : (
																"Submit Part Proposal"
															)}
														</Button>
													</div>
												</Form>
											)}

											{/* Resource Form */}
											{selectedKind === "resource" && (
												<Form onSubmit={handleSubmitResource}>
													{/* Title */}
													<Form.Group className="mb-3" controlId="resourceTitle">
														<Form.Label>
															Resource Title <span className="text-danger">*</span>
														</Form.Label>
														<Form.Control
															type="text"
															required
															placeholder="e.g. VESC Tool Mobile / Custom Battery Build Guide"
															value={resourceDraft.title}
															onChange={(e) =>
																setResourceDraft({
																	...resourceDraft,
																	title: e.target.value,
																})
															}
														/>
													</Form.Group>

													{/* Resource Types */}
													<Form.Group className="mb-3">
														<Form.Label>
															Resource Type(s) <span className="text-danger">*</span>
														</Form.Label>
														<div>
															{RESOURCE_TYPES.map((resType) => (
																<Form.Check
																	key={resType}
																	inline
																	type="checkbox"
																	id={`res-type-${resType}`}
																	label={resType}
																	checked={resourceDraft.resourceTypes.includes(
																		resType,
																	)}
																	onChange={() =>
																		setResourceDraft((prev) => ({
																			...prev,
																			resourceTypes: toggleArrayItem(
																				prev.resourceTypes,
																				resType,
																			),
																		}))
																	}
																/>
															))}
															<Form.Check
																key="other"
																inline
																type="checkbox"
																id="res-type-other"
																label="Other"
																checked={hasOtherResourceType}
																onChange={(e) => {
																	setHasOtherResourceType(e.target.checked)
																	if (!e.target.checked) {
																		setOtherResourceType("")
																	}
																}}
															/>
														</div>
														{hasOtherResourceType && (
															<div className="mt-2">
																<Form.Control
																	type="text"
																	placeholder="Suggest a new resource type..."
																	value={otherResourceType}
																	onChange={(e) =>
																		setOtherResourceType(e.target.value)
																	}
																	maxLength={50}
																/>
																<p className="text-muted mt-1 mb-0">
																	Suggest a resource type not listed above for
																	consideration by the site admin.
																</p>
															</div>
														)}
													</Form.Group>

													{/* External URL */}
													<Form.Group className="mb-3" controlId="resourceExternalUrl">
														<Form.Label>
															External URL <span className="text-danger">*</span>
														</Form.Label>
														<Form.Control
															type="url"
															required
															placeholder="https://github.com/... or https://..."
															value={resourceDraft.externalUrl}
															onChange={(e) =>
																setResourceDraft({
																	...resourceDraft,
																	externalUrl: e.target.value,
																})
															}
														/>
													</Form.Group>

													{/* App Store Links (Optional) */}
													<Row className="mb-3">
														<Col xs={12} md={6}>
															<Form.Group controlId="resourceAppStore">
																<Form.Label>Apple App Store Link (Optional)</Form.Label>
																<Form.Control
																	type="url"
																	placeholder="https://apps.apple.com/..."
																	value={resourceDraft.appStoreLink}
																	onChange={(e) =>
																		setResourceDraft({
																			...resourceDraft,
																			appStoreLink: e.target.value,
																		})
																	}
																/>
															</Form.Group>
														</Col>
														<Col xs={12} md={6} className="mt-3 mt-md-0">
															<Form.Group controlId="resourcePlayStore">
																<Form.Label>
																	Google Play Store Link (Optional)
																</Form.Label>
																<Form.Control
																	type="url"
																	placeholder="https://play.google.com/..."
																	value={resourceDraft.playStoreLink}
																	onChange={(e) =>
																		setResourceDraft({
																			...resourceDraft,
																			playStoreLink: e.target.value,
																		})
																	}
																/>
															</Form.Group>
														</Col>
													</Row>

													{/* Description */}
													<Form.Group className="mb-4" controlId="resourceDescription">
														<Form.Label>
															Description <span className="text-danger">*</span>
														</Form.Label>
														<Form.Control
															as="textarea"
															rows={4}
															required
															placeholder="Describe this resource and how it helps riders or builders..."
															value={resourceDraft.description}
															onChange={(e) =>
																setResourceDraft({
																	...resourceDraft,
																	description: e.target.value,
																})
															}
														/>
													</Form.Group>

													{/* Optional Turnstile */}
													{turnstileSiteKey && (
														<TurnstileWidget
															siteKey={turnstileSiteKey}
															onSuccess={(tok) => setTurnstileToken(tok)}
															onExpire={() => setTurnstileToken("")}
															onError={() => setTurnstileToken("")}
														/>
													)}

													{/* Submit Button */}
													<div className="d-grid gap-2 mt-4">
														<Button
															variant="outline-info"
															type="submit"
															disabled={submitting}>
															{submitting ? (
																<>
																	<Spinner
																		animation="border"
																		size="sm"
																		className="me-2"
																	/>
																	Submitting Resource Proposal...
																</>
															) : (
																"Submit Resource Proposal"
															)}
														</Button>
													</div>
												</Form>
											)}
										</Card.Body>
									</Card>
								</div>
							)}
						</>
					)}
				</Container>
			</main>

			<SiteFooter />
		</>
	)
}

export default ProposePage
