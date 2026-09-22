import React, { useEffect, useRef } from "react"

declare global {
	interface Window {
		turnstile?: {
			render: (
				container: string | HTMLElement,
				options: {
					sitekey: string
					theme?: "auto" | "light" | "dark"
					callback?: (token: string) => void
					"error-callback"?: (error?: unknown) => void
					"expired-callback"?: () => void
				},
			) => string
			reset: (widgetId?: string) => void
			remove: (widgetId: string) => void
		}
	}
}

type TurnstileWidgetProps = {
	siteKey?: string
	onSuccess: (token: string) => void
	onExpire?: () => void
	onError?: (error?: unknown) => void
	theme?: "auto" | "light" | "dark"
}

export default function TurnstileWidget({
	siteKey,
	onSuccess,
	onExpire,
	onError,
	theme = "dark",
}: TurnstileWidgetProps): React.JSX.Element | null {
	const containerRef = useRef<HTMLDivElement>(null)
	const widgetIdRef = useRef<string | null>(null)

	useEffect(() => {
		if (!siteKey || !containerRef.current) {
			return
		}

		let isCancelled = false

		const renderWidget = (): void => {
			if (isCancelled || !containerRef.current || !window.turnstile) {
				return
			}

			// Remove existing widget if re-rendering
			if (widgetIdRef.current) {
				try {
					window.turnstile.remove(widgetIdRef.current)
				} catch {
					// Ignore removal error
				}
				widgetIdRef.current = null
			}

			try {
				widgetIdRef.current = window.turnstile.render(containerRef.current, {
					sitekey: siteKey,
					theme,
					callback: (token: string) => {
						if (!isCancelled) {
							onSuccess(token)
						}
					},
					"expired-callback": () => {
						if (!isCancelled && onExpire) {
							onExpire()
						}
					},
					"error-callback": (err?: unknown) => {
						if (!isCancelled && onError) {
							onError(err)
						}
					},
				})
			} catch (err) {
				if (onError) {
					onError(err)
				}
			}
		}

		if (window.turnstile) {
			renderWidget()
		} else {
			const existingScript = document.querySelector<HTMLScriptElement>(
				'script[src*="challenges.cloudflare.com/turnstile"]',
			)
			if (existingScript) {
				existingScript.addEventListener("load", renderWidget)
			} else {
				const script = document.createElement("script")
				script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
				script.async = true
				script.defer = true
				script.onload = renderWidget
				document.head.appendChild(script)
			}
		}

		return () => {
			isCancelled = true
			if (widgetIdRef.current && window.turnstile) {
				try {
					window.turnstile.remove(widgetIdRef.current)
				} catch {
					// Ignore removal error
				}
				widgetIdRef.current = null
			}
		}
	}, [siteKey, theme, onSuccess, onExpire, onError])

	if (!siteKey) {
		return null
	}

	return (
		<div className="d-flex justify-content-center my-3">
			<div ref={containerRef} />
		</div>
	)
}
