import React, { CSSProperties, useState } from "react"
import { Button } from "react-bootstrap"
import { FaCheck, FaLink } from "react-icons/fa6"
import "../scss/animations.scss"

type CopyLinkButtonProps = {
    link: string
    text?: string
    style?: CSSProperties
}

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/components/buttons | React-Bootstrap Button}
 * which allows clicking to copy the supplied
 * URL, to the clipboard. Clicking also
 * switches between FA icons to indicate the
 * copy operation.
 * 
 * @param CopyLinkButtonProps - a {@link CopyLinkButtonProps} object
 */
export default ({link, text, style}: CopyLinkButtonProps) => {
    const [displayLink, setDisplayLink] = useState("inline-block")
    const [displayCheck, setDisplayCheck] = useState("none")

    const copyLink = () => {
        navigator.clipboard.writeText(encodeURI(link))

        setDisplayLink("none")
        setDisplayCheck("inline-block")

        setTimeout(() => {
            setDisplayLink("inline-block")
            setDisplayCheck("none")
        }, 2000)
    }
    
    return (
        <Button variant="outline-info" style={style} type="button" size="sm" onClick={() => copyLink()}>
            {text + " "}
            <FaLink style={{ animation: "fadeIn 0.25s linear" }} display={displayLink} />
            <FaCheck style={{ animation: "fadeOut 0.25s linear" }} display={displayCheck} />
        </Button>
    )
}