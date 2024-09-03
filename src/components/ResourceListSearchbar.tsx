import React, { ChangeEvent, Component } from "react"
import { Form, Stack } from "react-bootstrap"

export class ResourceListSearchbar extends Component {
    state = {
        searchText: "",
        typeCheckboxesEnabled: ""
    }

    setSearchText = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!e) return
        if (this.state.searchText === e.target.value) return

        this.setState({
            searchText: e.target.value,
        }, this.doSearch)
    }

    setTypeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e) return

        if (e.target.checked) {
            this.setState({
                typeCheckboxesEnabled: this.state.typeCheckboxesEnabled ? this.state.typeCheckboxesEnabled += `,${e.target.name}` : e.target.name
            }, this.doSearch)
        } else {
            this.setState({
                typeCheckboxesEnabled: this.state.typeCheckboxesEnabled.split(",").filter((i) => i !== e.target.name).join(",")
            }, this.doSearch)
        }
    }

    doSearch = () => {
        // Get all resources (by class name)
        const resources = document.querySelectorAll(".searchableResource")

        // Get search text, lower case
        const searchTextLC = this.state.searchText.toLowerCase()

        // Get filter checkboxes
        const typeCheckboxesChecked = this.state.typeCheckboxesEnabled.toLowerCase()

        // Count the number of hidden resources, to check for display of "no results"
        let hiddenCount = 0

        // Start filtering resources
        resources.forEach((resource) => {
            // Get part information, lower case
            const resourceTypes = resource.getAttribute("resourcetypes")?.toLowerCase()

            // Resources may only display if there is
            //      1. No keyword text is provided and no resource type is selected
            //      2. No keyword text is provided and the resource is of the selected resource type(s)
            //      3. Keyword text is provided and no resource type is selected
            //      4. Keyword text is provided and the resource is of the selected resource type(s)
            if (
                // Search text matches resource name
                (
                    this.state.searchText
                    && !resource.getAttribute("resourcename")?.toLowerCase().includes(searchTextLC)
                    && !resource.getAttribute("resourcedescription")?.toLowerCase().includes(searchTextLC)
                )
                // Resource type matches checked items
                || (
                    typeCheckboxesChecked.length
                    && (
                        resourceTypes?.includes(",")
                        ? !resourceTypes.split(",").some((type) => typeCheckboxesChecked.toLowerCase().includes(type))
                        : !typeCheckboxesChecked.toLowerCase().includes(resourceTypes ?? "false")
                    )
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
    }
    
    componentDidMount() {
        // Get query parameters
        const queryParams = new URLSearchParams(window.location.search)
        const keyword = queryParams.get("keyword") ?? queryParams.get("search") ?? ""

        // Set base state if there's a search preset
        if (keyword) {
            this.setState({
                searchText: decodeURIComponent(keyword)
            }, this.doSearch)
        }
    }

    render = () => {
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
                                value={this.state.searchText}
                                placeholder="Search text to filter by..."
                                onChange={(e) => this.setSearchText(e)}
                            />
                        </div>

                        <div className="searchTypeCheckBoxes">
                            <Form.Label as="h3">Resource Type:</Form.Label>
                            <Form.Check label="Spreadsheet" name="spreadsheet" id="spreadsheet" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Website" name="website" id="website" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                        </div>

                    </Stack>

                    <hr />
                </div>
            </>

        )
    }
}