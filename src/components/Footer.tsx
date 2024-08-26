import React from "react"
import { ImageRequestEmail } from "../util/SiteVariables"
import { Stack } from "react-bootstrap"

export default () => (
    <footer className="flex-center">
        <Stack direction="vertical" gap={0}>
            <p>All images are copyright to their respective owners.</p>
            <p>However, if you would like to claim an image, brand or logo and want it to be removed please <a href={`mailto:${ImageRequestEmail}`}>contact us</a>.</p>
        </Stack>
    </footer>
)