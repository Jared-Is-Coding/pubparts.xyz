import React, { useState } from "react"
import { Badge } from "react-bootstrap"
import { FaCheck, FaLink } from "react-icons/fa6"
import "../scss/animations.scss"

type CopyLinkBadgeProps = {
    link: string
}

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/components/badge | React-Bootstrap Badge}
 * which allows clicking to copy the supplied
 * URL, to the clipboard. Clicking also
 * switches between FA icons to indicate the
 * copy operation.
 * 
 * @param CopyLinkBadgeProps - a {@link CopyLinkBadgeProps} object
 */
export default ({link}: CopyLinkBadgeProps) => {
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
        <>
            <Badge pill bg="primary" onClick={() => copyLink()}>
                <FaLink style={{animation: "fadeIn 0.25s linear"}} display={displayLink} />
                <FaCheck style={{animation: "fadeOut 0.25s linear"}} display={displayCheck} />
            </Badge>
        </>
    )
}