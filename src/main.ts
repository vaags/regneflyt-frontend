import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		apiKey: 'API_KEY',
		apiEndpoint: 'API_ENDPOINT',
		isProduction: 'IS_PRODUCTION'
	}
})

export default app;