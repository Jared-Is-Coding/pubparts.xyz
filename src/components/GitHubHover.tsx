import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { FaGithub } from "react-icons/fa6"
import { GithubRepository } from "../util/siteVariables"

/**
 * Creates a floating icon
 */
export default () => (
    <OverlayTrigger
        key={"github-hover"}
        placement="left"
        overlay={
            <Tooltip>
                GitHub Repository
            </Tooltip>
        }>
        <p className="floating-icon">
            <a href={GithubRepository} target="_blank"><FaGithub /></a>
        </p>
    </OverlayTrigger>
)