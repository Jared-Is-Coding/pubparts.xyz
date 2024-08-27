import React, { ChangeEvent, Component } from "react"
import { Form, Stack } from "react-bootstrap"

export class ItemListSearchbar extends Component {
    state = {
        searchText: "",
        typeCheckboxesEnabled: "",
        fabricationCheckboxesEnabled: ""
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

    setFabricationCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e) return

        if (e.target.checked) {
            this.setState({
                fabricationCheckboxesEnabled: this.state.fabricationCheckboxesEnabled ? this.state.fabricationCheckboxesEnabled += `,${e.target.name}` : e.target.name
            }, this.doSearch)
        } else {
            this.setState({
                fabricationCheckboxesEnabled: this.state.fabricationCheckboxesEnabled.split(",").filter((i) => i !== e.target.name).join(",")
            }, this.doSearch)
        }
    }

    doSearch = () => {
        const items = document.querySelectorAll(".searchableItem")
        const searchTextLC = this.state.searchText.toLowerCase()
        const typeCheckboxesChecked = this.state.typeCheckboxesEnabled.toLowerCase()
        const fabCheckboxesChecked = this.state.fabricationCheckboxesEnabled.toLowerCase()
        let hiddenCount = 0

        items.forEach((item) => {
            const itemPartTypes = item.getAttribute("parttypes")?.toLowerCase()
            const itemFabricationMethod = item.getAttribute("partfabricationmethod")?.toLowerCase()

            // Items may only display if there is
            //      1. No keyword text is provided and no part type is selected
            //      2. No keyword text is provided and the item is of the selected part type(s)
            //      3. Keyword text is provided and no part type is selected
            //      4. Keyword text is provided and the item is of the selected part type(s)
            if (
                (
                    this.state.searchText
                    && !item.getAttribute("partname")?.toLowerCase().includes(searchTextLC)
                )
                || (
                    typeCheckboxesChecked.length
                    && (
                        itemPartTypes?.includes(",")
                        ? !itemPartTypes.split(",").some((type) => typeCheckboxesChecked.toLowerCase().includes(type))
                        : !typeCheckboxesChecked.toLowerCase().includes(itemPartTypes ?? "false")
                    )
                )
                || (
                    fabCheckboxesChecked.length
                    && (
                        itemFabricationMethod?.includes(",")
                        ? !itemFabricationMethod.split(",").some((type) => fabCheckboxesChecked.toLowerCase().includes(type))
                        : !fabCheckboxesChecked.toLowerCase().includes(itemFabricationMethod ?? "false")
                    )
                )
            ) {
                (item as HTMLElement).style.display = "none";
                hiddenCount++
            } else {
                (item as HTMLElement).style.display = "initial";
            }
        })

        const noResultsText = document.getElementById("noResultsText")
        const itemListHeader = document.getElementById("itemListHeader")
        if (!noResultsText) return

        if (hiddenCount == items.length) {
            noResultsText.style.display = "block"
            if (itemListHeader) itemListHeader.style.display = "none"
        } else {
            noResultsText.style.display = "none"
            if (itemListHeader) itemListHeader.style.display = "block"
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
                                placeholder="Search text..."
                                onChange={(e) => this.setSearchText(e)}
                            />
                            <Form.Text id="inputSearchHelpBlock">
                                Provide some text to filter by
                            </Form.Text>
                        </div>

                        <div className="searchTypeCheckBoxes">
                            <Form.Label as="h3">Part Type:</Form.Label>
                            <Form.Check label="Axle Block" name="axleBlock" id="axleBlock" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Battery Box" name="batteryBox" id="batteryBox" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Bearing Cover" name="bearingCover" id="bearingCover" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Bumper" name="bumper" id="bumper" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Controller Box" name="controllerBox" id="controllerBox" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Fender" name="fender" id="fender" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Footpad" name="footpad" id="footpad" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Miscellaneous" name="miscellaneous" id="miscellaneous" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Motor" name="motor" id="motor" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Port Cover" name="portCover" id="portCover" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Rails" name="rails" id="rails" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Rail Attachment" name="railAttachment" id="railAttachment" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Rim Saver" name="rimSaver" id="rimSaver" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Stand" name="stand" id="stand" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                            <Form.Check label="Tool" name="tool" id="tool" type="checkbox" inline onChange={(e) => this.setTypeCheckbox(e)} />
                        </div>

                        <div className="searchFabricationCheckBoxes">
                            <Form.Label as="h3">Fabrication Method:</Form.Label>
                            <Form.Check label="3d Printed" name="3dp" id="3dp" type="checkbox" inline onChange={(e) => this.setFabricationCheckbox(e)} />
                            <Form.Check label="CNC" name="cnc" id="cnc" type="checkbox" inline onChange={(e) => this.setFabricationCheckbox(e)} />
                        </div>
                    </Stack>
                </div>

                <h2 id="noResultsText" style={{display: "none", minHeight: "200px"}}>No results.</h2>
            </>

        )
    }
}