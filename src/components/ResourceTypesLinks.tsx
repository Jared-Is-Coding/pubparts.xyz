import React from "react"
import { Button, Col, Row } from "react-bootstrap"

/**
 * Creates a {@link https://react-bootstrap.netlify.app/docs/layout/grid | React-Bootstrap Row}
 * containing buttons for clicking to navigate
 * the website resources lists.
 */
export default () => {
	const resources = [
		{ href: "/resources/collections", label: "Collections and Lists" },
		{ href: "/resources/repositories", label: "Github Repositories" },
		{ href: "/resources/guides", label: "Guides" },
		{ href: "/resources/tools", label: "Tools" },
		{ href: "/resources/vendors", label: "Vendors" },
		{ href: "/resources/websites", label: "Websites" },
	]

	return (
		<Row className="flex-row">
			{resources.map((r) => (
				<Col
					key={r.label}
					xs={{ span: 6, offset: 0 }}
					md={{ span: 4, offset: 0 }}
					lg={{ span: 3, offset: 0 }}
					className="flex-center flex-top">
					<Button className="full-width text-truncate" href={r.href} variant="outline-info">
						{r.label}
					</Button>
				</Col>
			))}
		</Row>
	)
}
