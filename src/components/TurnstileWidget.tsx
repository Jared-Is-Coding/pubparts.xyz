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
	const onSuccessRef = useRef(onSuccess)
	const onExpireRef = useRef(onExpire)
	const onErrorRef = useRef(onError)

	useEffect(() => {
		onSuccessRef.current = onSuccess
		onExpireRef.current = onExpire
		onErrorRef.current = onError
	}, [onSuccess, onExpire, onError])

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
							onSuccessRef.current(token)
						}
					},
					"expired-callback": () => {
						if (!isCancelled && onExpireRef.current) {
							onExpireRef.current()
						}
					},
					"error-callback": (err?: unknown) => {
						if (!isCancelled && onErrorRef.current) {
							onErrorRef.current(err)
						}
					},
				})
			} catch (err) {
				if (onErrorRef.current) {
					onErrorRef.current(err)
				}
			}
		}

		let scriptEl: HTMLScriptElement | null = null

		if (window.turnstile) {
			renderWidget()
		} else {
			scriptEl = document.querySelector<HTMLScriptElement>('script[src*="challenges.cloudflare.com/turnstile"]')
			if (!scriptEl) {
				scriptEl = document.createElement("script")
				scriptEl.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
				scriptEl.async = true
				scriptEl.defer = true
				document.head.appendChild(scriptEl)
			}
			scriptEl.addEventListener("load", renderWidget)
		}

		return () => {
			isCancelled = true
			if (scriptEl) {
				scriptEl.removeEventListener("load", renderWidget)
			}
			if (widgetIdRef.current && window.turnstile) {
				try {
					window.turnstile.remove(widgetIdRef.current)
				} catch {
					// Ignore removal error
				}
				widgetIdRef.current = null
			}
		}
	}, [siteKey, theme])

	if (!siteKey) {
		return null
	}

	return (
		<div className="d-flex justify-content-center my-3">
			<div ref={containerRef} />
		</div>
	)
}
