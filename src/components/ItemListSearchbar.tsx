import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Form, Stack } from "react-bootstrap"
import isBrowser from "../hooks/isBrowser"
import { toTitleCase } from "../hooks/toTitleCase"

export default () => {
    // Check for browser window
    if (!isBrowser()) return


    // Manually created lists
    const partTypeCheckboxes = {
        "Axle Block": false,
        "Battery Box": false,
        "Bearing Cover": false,
        "Bumper": false,
        "Connector Cover": false,
        "Controller Box": false,
        "Fender": false,
        "Footpad": false,
        "Gasket": false,
        "Miscellaneous": false,
        "Motor": false,
        "Motor Cover": false,
        "Port Cover": false,
        "Rail Attachment": false,
        "Rails": false,
        "Rim Saver": false,
        "Stand": false,
        "Tool": false,
    }

    const fabricationMethodCheckboxes = {
        "3d Printed": false,
        "CNC": false,
        "Laser": false,
        "Other": false,
        "Prefabricated": false
    }

    const partTypes = Object.keys(partTypeCheckboxes) as PartType[]
    const fabricationMethods = Object.keys(fabricationMethodCheckboxes) as FabricationMethod[]

    // Set useStates
    const didMount = useRef(false)
    const [searchText, setSearchText] = useState("")
    const [checkedTypeBoxes, setCheckedTypeBoxes] = useState(partTypeCheckboxes)
    const [checkedFabricationMethodBoxes, setCheckedFabricationMethodBoxes] = useState(fabricationMethodCheckboxes)

    // Get query parameters on first run
    if (!didMount.current) {
        const queryParams = new URLSearchParams(window.location.search)
        
        const keyword = queryParams.get("keyword") ?? queryParams.get("search") ?? ""
        if (keyword) {
            setSearchText(decodeURIComponent(keyword))
        }
        
        const type = queryParams.get("type") ?? ""
        if (type && Object.keys(partTypeCheckboxes).includes(type)) {
            setCheckedTypeBoxes({...checkedTypeBoxes, [type]: true})
        }
        
        const fabricationMethod = queryParams.get("fab") ?? queryParams.get("fabrication")  ?? ""
        if (fabricationMethod && Object.keys(fabricationMethodCheckboxes).includes(fabricationMethod)) {
            setCheckedFabricationMethodBoxes({...checkedFabricationMethodBoxes, [fabricationMethod]: true})
        }

        // Don't re-run this
        didMount.current = true
    }

    // Handle type checkboxes
    const handleTypeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedTypeBoxes({...checkedTypeBoxes, [e.target.name]: e.target.checked})
    }

    // Handle fabrication method checkboxes
    const handleFabricationMethodCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedFabricationMethodBoxes({...checkedFabricationMethodBoxes, [e.target.name]: e.target.checked})
    }

    // Update search output on change
    useEffect(() => {
        // Get all items (by class name)
        const items = document.querySelectorAll(".searchableItem")

        // Count the number of hidden items, to check for display of "no results"
        let hiddenCount = 0

        // Start filtering items
        items.forEach((item) => {
            // Get part information, lower case
            const dataPartTypes = item.getAttribute("parttypes")?.split(",")

            // Do not display item if...
            if (
                // Part title does not include search text
                (
                    searchText
                    && !item.getAttribute("parttitle")?.toLowerCase().includes(searchText)
                )
                // Part type does not match checked items
                || (
                    Object.values(checkedTypeBoxes).some((v) => !!v)
                    && !dataPartTypes?.some((t) => !!checkedTypeBoxes[t as PartType])
                )
                // Part fabrication method does not match checked items
                || (
                    Object.values(checkedFabricationMethodBoxes).some((v) => !!v)
                    && !checkedFabricationMethodBoxes[item.getAttribute("partfabricationmethod") as FabricationMethod]
                )
            ) {
                // Hide
                (item as HTMLElement).style.display = "none";
                hiddenCount++
            } else {
                // Show
                (item as HTMLElement).style.display = "initial";
            }
        })

        // Get results headers
        const noResultsText = document.getElementById("noResultsText")
        const itemListHeader = document.getElementById("itemListHeader")
        if (!noResultsText) return

        // Display accordingly
        if (hiddenCount == items.length) {
            noResultsText.style.display = "block"
            if (itemListHeader) itemListHeader.style.display = "none"
        } else {
            noResultsText.style.display = "none"
            if (itemListHeader) itemListHeader.style.display = "block"
        }

        // * Testing
        console.log(checkedFabricationMethodBoxes)
    }, [
        searchText,
        checkedTypeBoxes,
        checkedFabricationMethodBoxes
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
                        <Form.Label as="h3">Part Type:</Form.Label>

                        {partTypes.sort((a, b) => a.localeCompare(b)).map((t, index) => (
                            <Form.Check key={`partType-${index}`} checked={checkedTypeBoxes[t]} onChange={handleTypeCheckbox} label={toTitleCase(t)} name={t} id={t} type="checkbox" inline />
                        ))}
                    </div>

                    <div className="searchFabricationCheckBoxes">
                        <Form.Label as="h3">Fabrication Method:</Form.Label>

                        {fabricationMethods.sort((a, b) => a.localeCompare(b)).map((f, index) => (
                            <Form.Check key={`fabricationMethod-${index}`} checked={checkedFabricationMethodBoxes[f]} onChange={handleFabricationMethodCheckbox} label={f} name={f} id={f} type="checkbox" inline />
                        ))}
                    </div>
                </Stack>

                <hr />
            </div>
        </>
    )
}