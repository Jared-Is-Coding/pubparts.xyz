import allResourcesSnapshot from "../data/synced/resourcesSnapshot"

const allResources = allResourcesSnapshot

const resource = (resourceType: ResourceType) => {
    return allResources
        .filter((entry) => entry.typeOfResource.includes(resourceType))
        .sort((a, b) => a.title.localeCompare(b.title))
}

export default allResources
export const applicationsResources = resource("App")
export const codeRepositoriesResources = resource("Github Repository")
export const spreadsheetsResources = resource("Spreadsheet")
export const vendorsResources = resource("Vendor")
export const videoGuidesResources = resource("Video Guide")
export const websitesResources = resource("Website")
export const writtenGuidesResources = resource("Written Guide")
