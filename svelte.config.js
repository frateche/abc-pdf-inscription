//import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter({
			fallback: "index.html",
		}),
		prerender: {
			enabled: true,
		},
		ssr: false,
		paths: {
			base: "/poc-inscription",
			assets: ""
		},
		trailingSlash: 'never',
	}
};

export default config;
