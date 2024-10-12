import { Link } from "gatsby"
import React from "react"
import isBrowser from "../hooks/isBrowser"

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

        if ((item as ItemData).platform === "Floatwheel") url = "/parts/floatwheel"
        if ((item as ItemData).platform === "GT/GT-S") url = "/parts/gt"
        if ((item as ItemData).platform === "Miscellaneous Items") url = "/parts/misc"
        if ((item as ItemData).platform === "Pint/X/S") url = "/parts/pint"
        if ((item as ItemData).platform === "VESC Electronics") url = "/parts/electronics"
        if ((item as ItemData).platform === "XR") url = "/parts/xr"
        if ((item as ResourceData).typeOfResource === "App") url = "/resources/applications"
        if ((item as ResourceData).typeOfResource === "Github Repository") url = "/resources/guides"
        if ((item as ResourceData).typeOfResource === "Guide: Written") url = "/resources/repositories"
        if ((item as ResourceData).typeOfResource === "Guide: Video") url = "/resources/spreadsheets"
        if ((item as ResourceData).typeOfResource === "Spreadsheet") url = "/resources/vendors"
        if ((item as ResourceData).typeOfResource === "Website") url = "/resources/websites"

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