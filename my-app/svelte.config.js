import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

const svelteConfig = {
	preprocess: preprocess({
		scss: {
      includePaths: [
        'src/components',
        'styles',
        'node_modules'
      ],
      sourceMap: true,
      outputStyle: 'compressed',
      autoprefixer: true,
		}
		// Other preprocessors or options can be added here if needed
	})
	// Other configurations for SvelteKit can be added here
};

const adapterConfig = {
	kit: {
		adapter: adapter({
			// Inlclude the output.json file in the build
			// If you want to include the output.json file
			assets: ['src/data/*']

			// You can also include entire directories using glob patterns
			// assets: ['src/data/*'],

			// Ensure that the file or directory paths are correct based on your project structure
		})
		// Other SvelteKit adapter configurations if needed
	}
};

export default {
	...svelteConfig, // Spread the Svelte preprocess configuration
	kit: {
		...adapterConfig.kit // Spread the adapter configuration under 'kit'
		// Other SvelteKit configurations can be added here if needed
	}
};
