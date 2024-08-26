import React, { ChangeEvent, Component } from "react"
import { Form } from "react-bootstrap"
import ItemCard from "./ItemCard"

export class ItemListSearchbar extends Component {
    state = {
        searchText: ""
    }

    setSearchText = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!e) return
        if (this.state.searchText === e.target.value) return

        this.setState({
            searchText: e.target.value
        }, this.doSearch)
    }

    doSearch = () => {
        const items = document.querySelectorAll(".searchableItem")
        const searchTextLC = this.state.searchText.toLowerCase()
        let hiddenCount = 0

        items.forEach((item) => {
            if (
                this.state.searchText
                && !item.getAttribute("partname")?.toLowerCase().includes(searchTextLC)
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
            noResultsText.style.display = "initial"
            if (itemListHeader) itemListHeader.style.display = "none"
        } else {
            noResultsText.style.display = "none"
            if (itemListHeader) itemListHeader.style.display = "initial"
        }
    }

    render = () => {
        return (
            <>
                <div className="searchBarField">
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
                </div>

                <h2 id="noResultsText" style={{display: "none"}}>No results.</h2>
            </>

        )
    }
}