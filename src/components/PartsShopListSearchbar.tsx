import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Button, ButtonGroup, Card, Form, Stack, ToggleButton } from "react-bootstrap"
import { FaArrowRotateLeft } from "react-icons/fa6"
import windowIsDefined from "../hooks/windowIsDefined"
import CopyLinkButton from "./CopyLinkButton"

type PartsShopListSearchbarProps = {
    partList: PartsShopData[]
}

/**
 * Creates a collection of elements for the
 * purpose of filtering an items page under
 * `src/pages/zts`
 * 
 * @param PartsShopListSearchbarProps - a {@link PartsShopListSearchbarProps} object
 */
export default ({ partList }: PartsShopListSearchbarProps) => {
    // Arrays from parts lists
    const uniquePlatformTypes = [...new Set(partList.map((p) => p.platform).flat())]
    const uniquePartTypes = [...new Set(partList.map((p) => p.typeOfPart).flat())]
    const uniqueItemConditions = [...new Set(partList.map((p) => p.condition).flat())]

    // Checkbox useState object lists
    const platformCheckboxes = Object.fromEntries(uniquePlatformTypes.map((p) => [p, false])) as { [P in PlatformType]: boolean }
    const partTypeCheckboxes = Object.fromEntries(uniquePartTypes.map((p) => [p, false])) as { [P in PartShopType]: boolean }
    const itemConditionCheckboxes = Object.fromEntries(uniqueItemConditions.map((p) => [p, false])) as { [P in ItemCondition]: boolean }

    // Set useStates
    const didMount = useRef(false)
    const [searchText, setSearchText] = useState("")
    const [checkedPlatformBoxes, setCheckedPlatformBoxes] = useState(platformCheckboxes)
    const [checkedTypeBoxes, setCheckedTypeBoxes] = useState(partTypeCheckboxes)
    const [checkedItemConditionBoxes, setCheckedItemConditionBoxes] = useState(itemConditionCheckboxes)
    const [showCopySearchButton, setShowCopySearchButton] = useState(false)

    const clearSearch = () => {
        setSearchText("")
        setCheckedPlatformBoxes(platformCheckboxes)
        setCheckedTypeBoxes(partTypeCheckboxes)
        setCheckedItemConditionBoxes(itemConditionCheckboxes)
    }

    //#region Query Parameter Pre-Filtering

    if (!didMount.current && windowIsDefined()) {
        const queryParams = new URLSearchParams(window.location.search)

        // Set searchbar text
        const keyword = queryParams.get("keyword") ?? queryParams.get("search") ?? ""
        if (keyword) {
            setSearchText(decodeURIComponent(keyword))
        }

        // Set checkboxes as checked
        const platform = (queryParams.get("platform")?.split(",") ?? []) as PlatformType[]
        if (platform && platform.every((t) => uniquePlatformTypes.includes(t))) {
            const tempCheckedPlatformBoxes = structuredClone(checkedPlatformBoxes)
            platform.forEach((t) => tempCheckedPlatformBoxes[t] = true)
            setCheckedPlatformBoxes(tempCheckedPlatformBoxes)
        }

        // Set checkboxes as checked
        const type = (queryParams.get("type")?.split(",") ?? []) as PartShopType[]
        if (type && type.every((t) => uniquePartTypes.includes(t))) {
            const tempCheckedTypeBoxes = structuredClone(checkedTypeBoxes)
            type.forEach((t) => tempCheckedTypeBoxes[t] = true)
            setCheckedTypeBoxes(tempCheckedTypeBoxes)
        }

        // Set checkboxes as checked
        const itemCondition = (queryParams.get("cond")?.split(",") ?? queryParams.get("condition")?.split(",") ?? []) as ItemCondition[]
        if (itemCondition && itemCondition.every((f) => uniqueItemConditions.includes(f))) {
            const tempCheckedItemConditionBoxes = structuredClone(checkedItemConditionBoxes)
            itemCondition.forEach((f) => tempCheckedItemConditionBoxes[f] = true)
            setCheckedItemConditionBoxes(tempCheckedItemConditionBoxes)
        }

        // Don't re-run this
        didMount.current = true
    }

    //#endregion
    //#region Checkbox Handlers

    const handlePlatformCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedPlatformBoxes({ ...checkedPlatformBoxes, [e.target.name]: e.target.checked })
    }

    const handleTypeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedTypeBoxes({ ...checkedTypeBoxes, [e.target.name]: e.target.checked })
    }

    const handleItemConditionCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedItemConditionBoxes({ ...checkedItemConditionBoxes, [e.target.name]: e.target.checked })
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
            const dataPlatform = item.getAttribute("platform")?.split(",") as PlatformType[]
            const dataPartTypes = item.getAttribute("parttypes")?.split(",") as PartShopType[]
            const dataItemCondition = item.getAttribute("partitemcondition") as ItemCondition

            // Do not display item if...
            if (
                // Part title does not include search text
                (
                    searchText
                    && !dataPartTitle?.toLowerCase().includes(searchText.toLowerCase())
                )

                // Part platform does not match checked items
                || (
                    Object.values(checkedPlatformBoxes).some((v) => !!v)
                    && !dataPlatform?.some((t) => !!checkedPlatformBoxes[t as PlatformType])
                )

                // Part type does not match checked items
                || (
                    Object.values(checkedTypeBoxes).some((v) => !!v)
                    && !dataPartTypes?.some((t) => !!checkedTypeBoxes[t as PartShopType])
                )

                // Part condition does not match checked items
                || (
                    Object.values(checkedItemConditionBoxes).some((v) => !!v)
                    && !checkedItemConditionBoxes[dataItemCondition]
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

        setShowCopySearchButton(!!(
            searchText
            || Object.values(checkedPlatformBoxes).some((v) => !!v)
            || Object.values(checkedTypeBoxes).some((v) => !!v)
            || Object.values(checkedItemConditionBoxes).some((v) => !!v)
        ))

        //#endregion
    })

    //#endregion
    //#region Render

    return (
        <>
            <Card className="searchArea mb-4">
                <Card.Header>Search & Filters</Card.Header>
                <Card.Body>
                    <Stack direction="vertical" gap={3}>
                        <div className="searchKeyword">
                            <Form.Label htmlFor="inputSearch" className="fw-bold">
                                Keyword:
                            </Form.Label>

                            <Form.Control
                                as="input"
                                type="search"
                                id="inputSearch"
                                value={searchText}
                                placeholder="Search text to filter by..."
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>

                        {uniquePlatformTypes.length > 1 &&
                            <div className="searchPlatformCheckBoxes">
                                <Form.Label className="fw-bold d-block">
                                    Platform(s):
                                </Form.Label>

                                <ButtonGroup size="sm">
                                    {uniquePlatformTypes.sort((a, b) => a.localeCompare(b)).map((p, index) => (
                                        <ToggleButton
                                            key={`itemCondition-${index}`}
                                            checked={checkedPlatformBoxes[p]}
                                            onChange={handlePlatformCheckbox}
                                            name={p}
                                            id={p}
                                            type="checkbox"
                                            value={1}
                                            variant="outline-info">
                                            {p}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </div>
                        }

                        {uniquePartTypes.length > 1 &&
                            <div className="searchTypeCheckBoxes">
                                <Form.Label className="fw-bold d-block">
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
                                            {t}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </div>
                        }

                        {uniqueItemConditions.length > 1 &&
                            <div className="searchConditionCheckBoxes">
                                <Form.Label className="fw-bold d-block">
                                    Item Condition(s):
                                </Form.Label>

                                <ButtonGroup size="sm">
                                    {uniqueItemConditions.sort((a, b) => a.localeCompare(b)).map((c, index) => (
                                        <ToggleButton
                                            key={`itemCondition-${index}`}
                                            checked={checkedItemConditionBoxes[c]}
                                            onChange={handleItemConditionCheckbox}
                                            name={c}
                                            id={c}
                                            type="checkbox"
                                            value={1}
                                            variant="outline-info">
                                            {c}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </div>
                        }

                        <Stack direction="horizontal" gap={2}>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline-info"
                                style={{ display: showCopySearchButton ? "initial" : "none", maxWidth: "max-content" }}
                                onClick={() => clearSearch()}>
                                Clear Search <FaArrowRotateLeft />
                            </Button>

                            <CopyLinkButton
                                text="Copy This Search"
                                link={!windowIsDefined() ? "#" : "http://" + window.location.host + window.location.pathname + `?search=${encodeURIComponent(searchText)}` + `&platform=${uniquePlatformTypes.filter((t) => !!checkedPlatformBoxes[t])}` + `&type=${uniquePartTypes.filter((t) => !!checkedTypeBoxes[t])}` + `&condition=${uniqueItemConditions.filter((f) => !!checkedItemConditionBoxes[f])}`}
                                style={{ display: showCopySearchButton ? "initial" : "none", maxWidth: "max-content" }} />
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card>
        </>
    )

    //#endregion
}