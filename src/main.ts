import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		isProduction: 'IS_PRODUCTION'
	}
})

export default app;