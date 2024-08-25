import React, { ChangeEvent, Component } from "react"
import { Form } from "react-bootstrap"

export class ItemListSearchbar extends Component {
    state = {
        searchText: "Working on this... use your browser search for now!"
    }

    setSearchText = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!e) return
        if (this.state.searchText === e.target.value) return

        this.setState({
            searchText: e.target.value
        })
    }

    render = () => {
        return (
            <>
                <div className="searchBarField">
                    <Form.Label htmlFor="inputSearch">Search</Form.Label>
                    <Form.Control
                        as="input"
                        type="text"
                        id="inputSearch"
                        aria-describedby="inputSearchHelpBlock"
                        value={this.state.searchText}
                        onChange={(e) => this.setSearchText(e)}
                        disabled
                    />
                    <Form.Text id="inputSearchHelpBlock">
                        Provide some text to filter by
                    </Form.Text>
                </div>


            </>

        )
    }
}