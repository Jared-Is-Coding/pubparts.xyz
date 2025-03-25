import React from "react"
import GitHubHover from "./GitHubHover"
import ZiNcHover from "./ZiNcHover"

/**
 * Creates an HTML footer
 */
export default () => (
    <footer>
        <div className="floating-icon-container d-none d-md-inline-block">
            <GitHubHover />
            <ZiNcHover />
        </div>
    </footer>
)