export const FABRICATION_METHODS: FabricationMethod[] = ["3d Printed", "CNC", "Laser", "PCB", "Other"]

export const PLATFORMS: PlatformType[] = [
	"Floatwheel",
	"GT/GT-S",
	"Pint/X/S",
	"XR/Funwheel",
	"XR Classic",
	"VESC Electronics",
	"Miscellaneous Items",
]

export const PART_TYPES: PartType[] = [
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

export const RESOURCE_TYPES: ResourceType[] = [
	"App",
	"Github Repository",
	"Written Guide",
	"Video Guide",
	"Spreadsheet",
	"Vendor",
	"Website",
]

export const ALLOWED_DOMAINS = [
	{ name: "MakerWorld", domain: "makerworld.com", url: "https://makerworld.com" },
	{ name: "Printables", domain: "printables.com", url: "https://www.printables.com" },
	{ name: "Thingiverse", domain: "thingiverse.com", url: "https://www.thingiverse.com" },
	{ name: "Cults", domain: "cults3d.com", url: "https://cults3d.com" },
	{ name: "MyMiniFactory", domain: "myminifactory.com", url: "https://www.myminifactory.com" },
	{ name: "Sketchfab", domain: "sketchfab.com", url: "https://sketchfab.com" },
	{ name: "CGTrader", domain: "cgtrader.com", url: "https://www.cgtrader.com" },
	{ name: "TurboSquid", domain: "turbosquid.com", url: "https://www.turbosquid.com" },
	{ name: "Fab", domain: "fab.com", url: "https://www.fab.com" },
	{ name: "Yeggi", domain: "yeggi.com", url: "https://www.yeggi.com" },
	{ name: "STLFinder", domain: "stlfinder.com", url: "https://www.stlfinder.com" },
	{ name: "Thangs", domain: "thangs.com", url: "https://thangs.com" },
]

// Extra CDN/asset domains associated with the allowed services (e.g. MakerWorld images are on bblmw.com)
const ALLOWED_IMAGE_EXTRA_DOMAINS = ["bblmw.com"]

function extractHostname(urlString: string): string | null {
	const trimmed = urlString.trim()
	if (!trimmed) {
		return null
	}

	try {
		const parsed = new URL(
			trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`,
		)
		return parsed.hostname.toLowerCase()
	} catch {
		return null
	}
}

function matchesDomain(hostname: string, targetDomain: string): boolean {
	return hostname === targetDomain || hostname.endsWith(`.${targetDomain}`)
}

export function isAllowedPartUrl(urlString: string): boolean {
	const hostname = extractHostname(urlString)
	if (!hostname) {
		return false
	}

	return ALLOWED_DOMAINS.some((item) => matchesDomain(hostname, item.domain))
}

export function isAllowedImageUrl(urlString: string): boolean {
	const hostname = extractHostname(urlString)
	if (!hostname) {
		return false
	}

	const inPrimaryDomains = ALLOWED_DOMAINS.some((item) => matchesDomain(hostname, item.domain))
	if (inPrimaryDomains) {
		return true
	}

	return ALLOWED_IMAGE_EXTRA_DOMAINS.some((domain) => matchesDomain(hostname, domain))
}
