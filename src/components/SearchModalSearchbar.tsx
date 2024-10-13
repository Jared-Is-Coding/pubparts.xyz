import React, { useEffect, useState } from "react"
import { Form, Stack } from "react-bootstrap"

/**
 * Creates a collection of elements for the
 * purpose of filtering all parts and
 * resources via the navbar search modal
 * 
 * @param ResourceListSearchbarProps - a {@link ResourceListSearchbarProps} object
 */
export default () => {
    // Set useStates
    const [searchText, setSearchText] = useState("")

    //#region Search Updates

    useEffect(() => {
        // Get all things (by class name)
        const things = document.querySelectorAll(".searchableThing")

        // Count the number of hidden things, to check for display of "no results"
        let hiddenCount = 0

        //#region Filter Items

        things.forEach((thing) => {
            // Do not display thing if...
            if (
                // Thing name does not include search text
                !searchText
                || !thing.innerHTML.toLowerCase().includes(searchText.toLowerCase())
            ) {
                // Hide
                (thing as HTMLElement).style.display = "none";
                hiddenCount++
            } else {
                // Show
                (thing as HTMLElement).style.display = "block";
            }
        })

        //#endregion
    })
    
    //#endregion
    //#region Render

    return (
        <>
            <div className="modalSearchArea">
                <Stack direction="vertical" gap={3}>
                    <div className="modalSearchKeyword">
                        <Form.Label htmlFor="modalInputSearch" as="h3">
                            Keyword:
                        </Form.Label>

                        <Form.Control
                            as="input"
                            type="search"
                            id="modalInputSearch"
                            value={searchText}
                            placeholder="Search text to filter by..."
                            autoFocus={true}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </Stack>

                <hr />
            </div>
        </>
    )
    
    //#endregion
}