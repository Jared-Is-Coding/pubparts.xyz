import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Button, ButtonGroup, Form, Stack, ToggleButton } from "react-bootstrap"
import { FaArrowRotateLeft } from "react-icons/fa6"
import isBrowser from "../hooks/isBrowser"
import { toTitleCase } from "../hooks/toTitleCase"
import CopyLinkButton from "./CopyLinkButton"

type ItemListSearchbarProps = {
    partList: ItemData[]
}

export default ({partList}: ItemListSearchbarProps) => {
    // Check for browser window
    if (!isBrowser()) return

    // Arrays from parts lists
    const uniquePartTypes = [...new Set(partList.map((p) => p.typeOfPart).flat())]
    const uniqueFabricationMethods = [...new Set(partList.map((p) => p.fabricationMethod).flat())]

    // Checkbox useState object lists
    const partTypeCheckboxes = Object.fromEntries(uniquePartTypes.map((p) => [p, false])) as { [P in PartType]: boolean }
    const fabricationMethodCheckboxes = Object.fromEntries(uniqueFabricationMethods.map((p) => [p, false])) as { [P in FabricationMethod]: boolean }

    // Set useStates
    const didMount = useRef(false)
    const [searchText, setSearchText] = useState("")
    const [checkedTypeBoxes, setCheckedTypeBoxes] = useState(partTypeCheckboxes)
    const [checkedFabricationMethodBoxes, setCheckedFabricationMethodBoxes] = useState(fabricationMethodCheckboxes)
    const [showCopySearchButton, setShowCopySearchButton] = useState(false)

    const clearSearch = () => {
        setSearchText("")
        setCheckedTypeBoxes(partTypeCheckboxes)
        setCheckedFabricationMethodBoxes(fabricationMethodCheckboxes)
    }

    //#region Query Parameter Pre-Filtering

    if (!didMount.current) {
        const queryParams = new URLSearchParams(window.location.search)
        
        // Set searchbar text
        const keyword = queryParams.get("keyword") ?? queryParams.get("search") ?? ""
        if (keyword) {
            setSearchText(decodeURIComponent(keyword))
        }
        
        // Set checkboxes as checked
        const type = (queryParams.get("type")?.split(",") ?? []) as PartType[]
        if (type && type.every((t) => uniquePartTypes.includes(t))) {
            const tempCheckedTypeBoxes = structuredClone(checkedTypeBoxes)
            type.forEach((t) => tempCheckedTypeBoxes[t] = true)
            setCheckedTypeBoxes(tempCheckedTypeBoxes)
        }
        
        // Set checkboxes as checked
        const fabricationMethod = (queryParams.get("fab")?.split(",") ?? queryParams.get("fabrication")?.split(",") ?? []) as FabricationMethod[]
        if (fabricationMethod && fabricationMethod.every((f) => uniqueFabricationMethods.includes(f))) {
            const tempCheckedFabricationMethodBoxes = structuredClone(checkedFabricationMethodBoxes)
            fabricationMethod.forEach((f) => tempCheckedFabricationMethodBoxes[f] = true)
            setCheckedFabricationMethodBoxes(tempCheckedFabricationMethodBoxes)
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

        //#region Filter Items

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
                (item as HTMLElement).style.display = "block";
            }
        })
        
        //#endregion
        //#region Results Headers

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

        //#endregion
        //#region Show Copy Button

        if (searchText || Object.values(checkedTypeBoxes).some((v) => !!v) || Object.values(checkedFabricationMethodBoxes).some((v) => !!v)) {
            setShowCopySearchButton(true)
        } else {
            setShowCopySearchButton(false)
        }

        //#endregion
    })

    //#endregion
    //#region Render

    return (
        <>
            <div className="searchArea">
                <Form.Label as="h2">
                    Search
                </Form.Label>

                <Stack direction="vertical" gap={3}>
                    <div className="searchKeyword">
                        <Form.Label htmlFor="inputSearch" as="h3">
                            Keyword:
                        </Form.Label>

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
                        <Form.Label as="h3">
                            Part Type(s):
                        </Form.Label>

                        <ButtonGroup size="sm">
                            {uniquePartTypes.sort((a, b) => a.localeCompare(b)).map((t, index) => (
                                <ToggleButton
                                    key={`partType-${index}`}
                                    checked={checkedTypeBoxes[t]}
                                    onChange={handleTypeCheckbox}
                                    name={t}
                                    id={t}
                                    type="checkbox"
                                    value={1}
                                    variant="outline-info">
                                    {toTitleCase(t)}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>

                    <div className="searchFabricationCheckBoxes">
                        <Form.Label as="h3">
                            Fabrication Method(s):
                        </Form.Label>

                        <ButtonGroup size="sm">
                            {uniqueFabricationMethods.sort((a, b) => a.localeCompare(b)).map((f, index) => (
                                <ToggleButton
                                    key={`fabricationMethod-${index}`}
                                    checked={checkedFabricationMethodBoxes[f]}
                                    onChange={handleFabricationMethodCheckbox}
                                    name={f}
                                    id={f}
                                    type="checkbox"
                                    value={1}
                                    variant="outline-info">
                                    {f}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>

                    <Stack direction="horizontal" gap={2}>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline-info"
                            style={{display: showCopySearchButton ? "initial" : "none", maxWidth: "max-content"}}
                            onClick={() => clearSearch()}>
                            Clear Search <FaArrowRotateLeft />
                        </Button>

                        <CopyLinkButton
                            text="Copy This Search"
                            link={"http://" + window.location.host + window.location.pathname + `?search=${searchText}` + `&type=${uniquePartTypes.filter((t) => !!checkedTypeBoxes[t])}` + `&fab=${uniqueFabricationMethods.filter((f) => !!checkedFabricationMethodBoxes[f])}`}
                            style={{display: showCopySearchButton ? "initial" : "none", maxWidth: "max-content"}} />
                    </Stack>
                </Stack>

                <hr />
            </div>
        </>
    )
    
    //#endregion
}