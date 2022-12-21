import { component$, useStyles$ } from '@builder.io/qwik'
import globalCss from '../assets/global.css?inline'
import {
	QwikCityProvider,
	RouterOutlet,
	ServiceWorkerRegister
} from '@builder.io/qwik-city'

export default component$(() => {

	useStyles$(globalCss)

	return (
		<>
			<QwikCityProvider>
				<head>
					<meta charSet="utf-8" />
					<link rel="manifest" href="/manifest.json" />
					<title>tRPC is cool</title>
				</head>
				<body lang="en">
					<RouterOutlet />
					<ServiceWorkerRegister />
				</body>
			</QwikCityProvider>
		</>
	)
})
