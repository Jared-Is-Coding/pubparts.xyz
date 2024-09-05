import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Form, Stack } from "react-bootstrap"
import isBrowser from "../hooks/isBrowser"
import { toTitleCase } from "../hooks/toTitleCase"

type ItemListSearchbarProps = {
    partList: ItemData[]
}

export default ({partList}: ItemListSearchbarProps) => {
    // Check for browser window
    if (!isBrowser()) return

    // Checkbox useState object lists
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

    // Arrays from parts lists
    const uniquePartTypes = [...new Set(partList.map((p) => p.typeOfPart).flat())]
    const uniqueFabricationMethods = [...new Set(partList.map((p) => p.fabricationMethod).flat())]

    // Set useStates
    const didMount = useRef(false)
    const [searchText, setSearchText] = useState("")
    const [checkedTypeBoxes, setCheckedTypeBoxes] = useState(partTypeCheckboxes)
    const [checkedFabricationMethodBoxes, setCheckedFabricationMethodBoxes] = useState(fabricationMethodCheckboxes)

    //#region Query Parameter Pre-Filtering

    if (!didMount.current) {
        const queryParams = new URLSearchParams(window.location.search)
        
        // Set searchbar text
        const keyword = queryParams.get("keyword") ?? queryParams.get("search") ?? ""
        if (keyword) {
            setSearchText(decodeURIComponent(keyword))
        }
        
        // Set checkboxes as checked
        const type = queryParams.get("type") as PartType ?? null
        if (type && Object.keys(partTypeCheckboxes).includes(type)) {
            setCheckedTypeBoxes({...checkedTypeBoxes, [type]: true})
        }
        
        // Set checkboxes as checked
        const fabricationMethod = queryParams.get("fab") as FabricationMethod ?? queryParams.get("fabrication")  ?? null
        if (fabricationMethod && Object.keys(fabricationMethodCheckboxes).includes(fabricationMethod)) {
            setCheckedFabricationMethodBoxes({...checkedFabricationMethodBoxes, [fabricationMethod]: true})
        }

        // Don't re-run this
        didMount.current = true
    }

    //#endregion
    //#region Checkbox Handlers

    const handleTypeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedTypeBoxes({...checkedTypeBoxes, [e.target.name]: e.target.checked})
    }

    const handleFabricationMethodCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedFabricationMethodBoxes({...checkedFabricationMethodBoxes, [e.target.name]: e.target.checked})
    }

    //#endregion
    //#region Search Updates

    useEffect(() => {
        // Get all items (by class name)
        const items = document.querySelectorAll(".searchableItem")

        // Count the number of hidden items, to check for display of "no results"
        let hiddenCount = 0

        // Start filtering items
        items.forEach((item) => {
            // Get part information, lower case
            const dataPartTitle = item.getAttribute("parttitle")
            const dataPartTypes = item.getAttribute("parttypes")?.split(",") as PartType[]
            const dataFabricationMethod = item.getAttribute("partfabricationmethod") as FabricationMethod

            // Do not display item if...
            if (
                // Part title does not include search text
                (
                    searchText
                    && !dataPartTitle?.toLowerCase().includes(searchText.toLowerCase())
                )
                // Part type does not match checked items
                || (
                    Object.values(checkedTypeBoxes).some((v) => !!v)
                    && !dataPartTypes?.some((t) => !!checkedTypeBoxes[t as PartType])
                )
                // Part fabrication method does not match checked items
                || (
                    Object.values(checkedFabricationMethodBoxes).some((v) => !!v)
                    && !checkedFabricationMethodBoxes[dataFabricationMethod]
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
        if (!noResultsText || !itemListHeader) return

        // Display accordingly
        if (hiddenCount == items.length) {
            noResultsText.style.display = "block"
            itemListHeader.style.display = "none"
        } else {
            noResultsText.style.display = "none"
            itemListHeader.style.display = "block"
        }
    }, [
        searchText,
        checkedTypeBoxes,
        checkedFabricationMethodBoxes
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
                        <Form.Label as="h3">Part Type:</Form.Label>

                        {uniquePartTypes.sort((a, b) => a.localeCompare(b)).map((t, index) => (
                            <Form.Check key={`partType-${index}`} checked={checkedTypeBoxes[t]} onChange={handleTypeCheckbox} label={toTitleCase(t)} name={t} id={t} type="checkbox" inline />
                        ))}
                    </div>

                    <div className="searchFabricationCheckBoxes">
                        <Form.Label as="h3">Fabrication Method:</Form.Label>

                        {uniqueFabricationMethods.sort((a, b) => a.localeCompare(b)).map((f, index) => (
                            <Form.Check key={`fabricationMethod-${index}`} checked={checkedFabricationMethodBoxes[f]} onChange={handleFabricationMethodCheckbox} label={f} name={f} id={f} type="checkbox" inline />
                        ))}
                    </div>
                </Stack>

                <hr />
            </div>
        </>
    )
    
    //#endregion
}