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
    const getLinks = (d: string) => {
        let url = ""

        if (d.includes("Floatwheel")) url = "/parts/floatwheel"
        else if (d.includes("GT/GT-S")) url = "/parts/gt"
        else if (d.includes("Miscellaneous Items")) url = "/parts/misc"
        else if (d.includes("Pint/X/S")) url = "/parts/pint"
        else if (d.includes("VESC Electronics")) url = "/parts/electronics"
        else if (d.includes("XR Classic")) url = "/parts/xrclassic"
        else if (d.includes("XR")) url = "/parts/xr"
        else if (d.includes("App")) url = "/resources/applications"
        else if (d.includes("Github Repository")) url = "/resources/repositories"
        else if (d.includes("Spreadsheet")) url = "/resources/spreadsheets"
        else if (d.includes("Vendor")) url = "/resources/vendors"
        else if (d.includes("Video Guide")) url = "/resources/videoguides"
        else if (d.includes("Website")) url = "/resources/websites"
        else if (d.includes("Written Guide")) url = "/resources/writtenguides"

        return url + `?search=${encodeURI(item.title)}`
    }

    return (
        <div className="searchableThing" style={{display: "none"}}>
            {item.title} <>(</>{
                ((item as ItemData).platform ?? (item as ResourceData).typeOfResource)
                    .map<React.ReactNode>((i) => (
                        <a
                            href={getLinks(i)}
                            target="_self"
                            key={`thing-card-${index}-${i}`}>
                            {i}
                        </a>
                    ))
                    .reduce((p , c) => [p, " | ", c])
            }<>)</>
        </div>
    )
}