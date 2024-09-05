import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Form, Stack } from "react-bootstrap"
import isBrowser from "../hooks/isBrowser"
import { toTitleCase } from "../hooks/toTitleCase"

type ResourceListSearchbarProps = {
    resourceList: ResourceData[]
}

export default ({resourceList}: ResourceListSearchbarProps) => {
    // Check for browser window
    if (!isBrowser()) return

    // Checkbox useState object lists
    const resourceTypeCheckboxes = {
        "App": false,
        "Spreadsheet": false,
        "Website": false
    }

    // Arrays from resource lists
    const uniqueResourceTypes = [...new Set(resourceList.map((r) => r.typeOfResource).flat())]

    // Set useStates
    const didMount = useRef(false)
    const [searchText, setSearchText] = useState("")
    const [checkedTypeBoxes, setCheckedTypeBoxes] = useState(resourceTypeCheckboxes)

    //#region Query Parameter Pre-Filtering

    if (!didMount.current) {
        const queryParams = new URLSearchParams(window.location.search)
        
        // Set searchbar text
        const keyword = queryParams.get("keyword") ?? queryParams.get("search") ?? ""
        if (keyword) {
            setSearchText(decodeURIComponent(keyword))
        }
        
        // Set checkboxes as checked
        const type = queryParams.get("type")
        if (type && Object.keys(resourceTypeCheckboxes).includes(type)) {
            setCheckedTypeBoxes({...checkedTypeBoxes, [type]: true})
        }

        // Don't re-run this
        didMount.current = true
    }

    //#endregion
    //#region Checkbox Handlers

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedTypeBoxes({...checkedTypeBoxes, [e.target.name]: e.target.checked})
    }

    //#endregion
    //#region Search Updates

    useEffect(() => {
        // Get all resources (by class name)
        const resources = document.querySelectorAll(".searchableResource")

        // Count the number of hidden resources, to check for display of "no results"
        let hiddenCount = 0

        // Start filtering resources
        resources.forEach((resource) => {
            // Get part information, lower case
            const dataResourceTypes = resource.getAttribute("resourcetypes")?.split(",")

            // Resources may only display if there is
            //      1. No keyword text is provided and no resource type is selected
            //      2. No keyword text is provided and the resource is of the selected resource type(s)
            //      3. Keyword text is provided and no resource type is selected
            //      4. Keyword text is provided and the resource is of the selected resource type(s)
            if (
                // Resource name does not include search text
                (
                    searchText
                    && !resource.getAttribute("resourcetitle")?.toLowerCase().includes(searchText.toLowerCase())
                    && !resource.getAttribute("resourcedescription")?.toLowerCase().includes(searchText.toLowerCase())
                )
                // Resource type does not match checked items
                || (
                    Object.values(checkedTypeBoxes).some((v) => !!v)
                    && !dataResourceTypes?.some((r) => !!checkedTypeBoxes[r as ResourceType])
                )
            ) {
                // Hide
                (resource as HTMLElement).style.display = "none";
                hiddenCount++
            } else {
                // Show
                (resource as HTMLElement).style.display = "initial";
            }
        })

        // Get results headers
        const noResultsText = document.getElementById("noResultsText")
        const resourceListHeader = document.getElementById("resourceListHeader")
        if (!noResultsText || !resourceListHeader) return

        // Display accordingly
        if (hiddenCount == resources.length) {
            noResultsText.style.display = "block"
            resourceListHeader.style.display = "none"
        } else {
            noResultsText.style.display = "none"
            resourceListHeader.style.display = "block"
        }
    }, [
        searchText,
        checkedTypeBoxes
    ])
    
    //#endregion
    //#region Render

    return (
        <>
            <Form.Label as="h2">Search</Form.Label>

            <div className="searchArea">
                <Stack direction="vertical" gap={2}>
                    <div className="searchKeyword">
                        <Form.Label htmlFor="inputSearch" as="h3">Keyword:</Form.Label>
                        <Form.Control
                            as="input"
                            type="search"
                            id="inputSearch"
                            aria-describedby="inputSearchHelpBlock"
                            value={searchText}
                            placeholder="Search text to filter by..."
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <div className="searchTypeCheckBoxes">
                        <Form.Label as="h3">Resource Type:</Form.Label>

                        {uniqueResourceTypes.sort((a, b) => a.localeCompare(b)).map((r, index) => (
                            <Form.Check key={`resourceType-${index}`} label={toTitleCase(r)} name={r} id={r} type="checkbox" checked={checkedTypeBoxes[r]} onChange={handleCheckbox} inline />
                        ))}
                    </div>
                </Stack>

                <hr />
            </div>
        </>
    )
    
    //#endregion
}