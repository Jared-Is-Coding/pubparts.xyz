import React, { ChangeEvent, Component } from "react"
import { Form } from "react-bootstrap"

export class ItemListSearchbar extends Component {
    state = {
        searchText: "",
        checkboxesEnabled: ""
    }

    setSearchText = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!e) return
        if (this.state.searchText === e.target.value) return

        this.setState({
            searchText: e.target.value,
        }, this.doSearch)
    }

    setCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e) return

        if (e.target.checked) {
            this.setState({
                checkboxesEnabled: this.state.checkboxesEnabled ? this.state.checkboxesEnabled += `,${e.target.name}` : e.target.name
            }, this.doSearch)
        } else {
            this.setState({
                checkboxesEnabled: this.state.checkboxesEnabled.split(",").filter((i) => i !== e.target.name).join(",")
            }, this.doSearch)
        }
    }

    doSearch = () => {
        const items = document.querySelectorAll(".searchableItem")
        const searchTextLC = this.state.searchText.toLowerCase()
        const partTypesChecked = this.state.checkboxesEnabled.toLowerCase()
        let hiddenCount = 0

        items.forEach((item) => {
            const itemPartTypes = item.getAttribute("parttypes")?.toLowerCase()

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
                    partTypesChecked.length
                    && (
                        itemPartTypes?.includes(",")
                        ? !itemPartTypes.split(",").some((type) => partTypesChecked.toLowerCase().includes(type))
                        : !partTypesChecked.toLowerCase().includes(item.getAttribute("parttypes")?.toLowerCase() ?? "false")
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
                <div className="searchBarArea">
                    <Form.Label htmlFor="inputSearch" as="h2">Search</Form.Label>
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

                    <div className="searchCheckBoxes">
                        <Form.Check label="Axle Block" name="axleBlock" id="axleBlock" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Battery Box" name="batteryBox" id="batteryBox" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Bearing Cover" name="bearingCover" id="bearingCover" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Bumper" name="bumper" id="bumper" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Controller Box" name="controllerBox" id="controllerBox" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Fender" name="fender" id="fender" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Footpad" name="footpad" id="footpad" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Miscellaneous" name="miscellaneous" id="miscellaneous" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Motor" name="motor" id="motor" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Port Cover" name="portCover" id="portCover" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Rail" name="rail" id="rail" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Rail Attachment" name="railAttachment" id="railAttachment" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Rim Saver" name="rimSaver" id="rimSaver" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                        <Form.Check label="Stand" name="stand" id="stand" type="checkbox" inline onChange={(e) => this.setCheckbox(e)} />
                    </div>
                </div>

                <h2 id="noResultsText" style={{display: "none"}}>No results.</h2>
            </>

        )
    }
}