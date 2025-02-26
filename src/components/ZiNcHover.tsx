import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"

/**
 * Creates an HTML footer
 */
export default () => (
    <div className="d-none d-md-inline-block">
        <OverlayTrigger
            placement="left"
            overlay={
                <Tooltip id="zinc-hover-tooltip">
                    Made by ZiNc
                </Tooltip>
            }>
            <p className="zinc-hover">Zn</p>
        </OverlayTrigger>
    </div>
)