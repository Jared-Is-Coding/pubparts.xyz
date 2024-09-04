import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Form, Stack } from "react-bootstrap"
import isBrowser from "../hooks/isBrowser"
import { toTitleCase } from "../hooks/toTitleCase"

export default () => {
    // Check for browser window
    if (!isBrowser()) return

    // Manually created list
    const resourceTypeCheckboxes = {
        "App": false,
        "Spreadsheet": false,
        "Website": false
    }

    const resourceTypes = Object.keys(resourceTypeCheckboxes) as ResourceType[]

    // Set useStates
    const didMount = useRef(false)
    const [searchText, setSearchText] = useState("")
    const [checkedBoxes, setCheckedBoxes] = useState(resourceTypeCheckboxes)

    // Get query parameters on first run
    if (!didMount.current) {
        const queryParams = new URLSearchParams(window.location.search)
        
        const keyword = queryParams.get("keyword") ?? queryParams.get("search") ?? ""
        if (keyword) {
            setSearchText(decodeURIComponent(keyword))
        }
        
        const type = queryParams.get("type")
        if (type && Object.keys(resourceTypeCheckboxes).includes(type)) {
            setCheckedBoxes({...checkedBoxes, [type]: true})
        }

        // Don't re-run this
        didMount.current = true
    }

    // Handle checkboxes
    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedBoxes({...checkedBoxes, [e.target.name]: e.target.checked})
    }

    // Update search output on change
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
                // Search text matches resource name
                (
                    searchText
                    && !resource.getAttribute("resourcetitle")?.toLowerCase().includes(searchText.toLowerCase())
                    && !resource.getAttribute("resourcedescription")?.toLowerCase().includes(searchText.toLowerCase())
                )
                // Resource type matches checked items
                || (
                    Object.values(checkedBoxes).some((v) => !!v)
                    && !dataResourceTypes?.some((r) => !!checkedBoxes[r as ResourceType])
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
        if (!noResultsText) return

        // Display accordingly
        if (hiddenCount == resources.length) {
            noResultsText.style.display = "block"
            if (resourceListHeader) resourceListHeader.style.display = "none"
        } else {
            noResultsText.style.display = "none"
            if (resourceListHeader) resourceListHeader.style.display = "block"
        }
    }, [
        searchText,
        checkedBoxes
    ])
    
    return (
        <>
            <Form.Label as="h2">Search</Form.Label>

            <div className="searchArea">
                <Stack direction="vertical" gap={2}>
                    <div className="searchKeyword">
                        <Form.Label htmlFor="inputSearch" as="h3">Keyword:</Form.Label>
                        <Form.Control
                            as="input"
                            type="text"
                            id="inputSearch"
                            aria-describedby="inputSearchHelpBlock"
                            value={searchText}
                            placeholder="Search text to filter by..."
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <div className="searchTypeCheckBoxes">
                        <Form.Label as="h3">Resource Type:</Form.Label>

                        {resourceTypes.sort((a, b) => a.localeCompare(b)).map((r, index) => (
                            <Form.Check key={`resourceType-${index}`} label={toTitleCase(r)} name={r} id={r} type="checkbox" checked={checkedBoxes[r]} onChange={handleCheckbox} inline />
                        ))}
                    </div>
                </Stack>

                <hr />
            </div>
        </>

    )
}