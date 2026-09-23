import allResourcesSnapshot from "../data/synced/resourcesSnapshot"

const allResources = allResourcesSnapshot

const resource = (resourceType: ResourceType) => {
	return allResources
		.filter((entry) => entry.typeOfResource.includes(resourceType))
		.sort((a, b) => a.title.localeCompare(b.title))
}

export default allResources
export const collectionsResources = resource("Collections and Lists")
export const githubRepositoriesResources = resource("Github Repository")
export const guidesResources = resource("Guides")
export const toolsResources = resource("Tools")
export const vendorsResources = resource("Vendor")
export const websitesResources = resource("Website")
