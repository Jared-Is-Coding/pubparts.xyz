import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Button, ButtonGroup, Card, Form, Stack, ToggleButton } from "react-bootstrap"
import { FaArrowRotateLeft } from "react-icons/fa6"
import windowIsDefined from "../hooks/windowIsDefined"
import toTitleCase from "../hooks/toTitleCase"
import CopyLinkButton from "./CopyLinkButton"

type ResourceListSearchbarProps = {
    resourceList: ResourceData[]
}

/**
 * Creates a collection of elements for the
 * purpose of filtering a resources page under
 * `src/pages/resources`
 * 
 * @param ResourceListSearchbarProps - a {@link ResourceListSearchbarProps} object
 */
export default ({ resourceList }: ResourceListSearchbarProps) => {
    // Arrays from resource lists
    const uniqueResourceTypes = [...new Set(resourceList.map((r) => r.typeOfResource).flat())]

    // Checkbox useState object lists
    const resourceTypeCheckboxes = Object.fromEntries(uniqueResourceTypes.map((p) => [p, false])) as { [P in ResourceType]: boolean }

    // Set useStates
    const didMount = useRef(false)
    const [searchText, setSearchText] = useState("")
    const [checkedTypeBoxes, setCheckedTypeBoxes] = useState(resourceTypeCheckboxes)
    const [showCopySearchButton, setShowCopySearchButton] = useState(false)

    const clearSearch = () => {
        setSearchText("")
        setCheckedTypeBoxes(resourceTypeCheckboxes)
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
        const type = (queryParams.get("type")?.split(",") ?? []) as ResourceType[]
        if (type && type.every((t) => uniqueResourceTypes.includes(t))) {
            const tempCheckedTypeBoxes = structuredClone(checkedTypeBoxes)
            type.forEach((t) => tempCheckedTypeBoxes[t] = true)
            setCheckedTypeBoxes(tempCheckedTypeBoxes)
        }

        // Don't re-run this
        didMount.current = true
    }

    //#endregion
    //#region Checkbox Handlers

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedTypeBoxes({ ...checkedTypeBoxes, [e.target.name]: e.target.checked })
    }

    //#endregion
    //#region Search Updates

    useEffect(() => {
        // Get all resources (by class name)
        const resources = document.querySelectorAll(".searchableResource")

        // Count the number of hidden resources, to check for display of "no results"
        let hiddenCount = 0

        //#region Filter Resources

        resources.forEach((resource) => {
            // Get resource information, lower case
            const dataResourceTypes = resource.getAttribute("resourcetypes")?.split(",")

            // Do not display resource if...
            if (
                // Resource name does not include search text
                (
                    searchText
                    && !resource.getAttribute("resourcetitle")?.toLowerCase().includes(searchText.toLowerCase())
                    && !resource.getAttribute("resourcedescription")?.toLowerCase().includes(searchText.toLowerCase())
                )

                // Resource type does not match checked resources
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
                (resource as HTMLElement).style.display = "block";
            }
        })

        //#endregion
        //#region Results Headers

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

        //#endregion
        //#region Show Copy Button

        setShowCopySearchButton(!!(
            searchText
            || Object.values(checkedTypeBoxes).some((v) => !!v)
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

                        {uniqueResourceTypes.length > 1 &&
                            <div className="searchTypeCheckBoxes">
                                <Form.Label className="fw-bold d-block">
                                    Resource Type(s):
                                </Form.Label>

                                <ButtonGroup size="sm">
                                    {uniqueResourceTypes.sort((a, b) => a.localeCompare(b)).map((r, index) => (
                                        <ToggleButton
                                            key={`resourceType-${index}`}
                                            checked={checkedTypeBoxes[r]}
                                            onChange={handleCheckbox}
                                            name={r}
                                            id={r}
                                            type="checkbox"
                                            value={1}
                                            variant="outline-info">
                                            {toTitleCase(r)}
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
                                link={!windowIsDefined() ? "#" : "http://" + window.location.host + window.location.pathname + `?search=${encodeURIComponent(searchText)}` + `&type=${uniqueResourceTypes.filter((t) => !!checkedTypeBoxes[t])}`}
                                style={{ display: showCopySearchButton ? "initial" : "none", maxWidth: "max-content" }} />
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card>
        </>
    )

    //#endregion
}