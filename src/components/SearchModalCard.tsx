import { Link } from "gatsby"
import React from "react"

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/components/link | React-Bootstrap Link}
 * with item information from an {@link ItemData}
 * or {@link ResourceData} object array. Intended
 * to be used in conjunction with the Array map
 * function.
 * 
 * @param item - an {@link ItemData} or {@link ResourceData} object
 * @param index - a number from a map
 */
export default (item: ItemData | ResourceData, index: number) => {
    const linkTo = () => {
        let url = ""

        if ((item as ItemData).platform?.includes("Floatwheel")) url = "/parts/floatwheel"
        if ((item as ItemData).platform?.includes("GT/GT-S")) url = "/parts/gt"
        if ((item as ItemData).platform?.includes("Miscellaneous Items")) url = "/parts/misc"
        if ((item as ItemData).platform?.includes("Pint/X/S")) url = "/parts/pint"
        if ((item as ItemData).platform?.includes("VESC Electronics")) url = "/parts/electronics"
        if ((item as ItemData).platform?.includes("XR")) url = "/parts/xr"
        if ((item as ResourceData).typeOfResource?.includes("App")) url = "/resources/applications"
        if ((item as ResourceData).typeOfResource?.includes("Github Repository")) url = "/resources/repositories"
        if ((item as ResourceData).typeOfResource?.includes("Guide: Written")) url = "/resources/guides"
        if ((item as ResourceData).typeOfResource?.includes("Guide: Video")) url = "/resources/guides"
        if ((item as ResourceData).typeOfResource?.includes("Spreadsheet")) url = "/resources/spreadsheets"
        if ((item as ResourceData).typeOfResource?.includes("Vendor")) url = "/resources/vendors"
        if ((item as ResourceData).typeOfResource?.includes("Website")) url = "/resources/websites"

        return url + `?search=${encodeURI(item.title)}`
    }

    return (
        <Link
            to={linkTo()}
            target="_self"
            className="searchableThing"
            style={{display: "none"}}
            key={`thing-card-${index}`}>
                {(item as ItemData).platform ?? (item as ResourceData).typeOfResource} | {item.title}
        </Link>
    )
}