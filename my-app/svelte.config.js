import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

const svelteConfig = {
  preprocess: preprocess({
    scss: {
      // Your SCSS/SASS options go here
      // For example:
      // includePaths: ['src', 'node_modules'],
    },
    // Other preprocessors or options can be added here if needed
  }),
  // Other configurations for SvelteKit can be added here
};

const adapterConfig = {
  kit: {
    adapter: adapter(),
    // Other SvelteKit adapter configurations if needed
  },
};

export default {
  ...svelteConfig, // Spread the Svelte preprocess configuration
  kit: {
    ...adapterConfig.kit, // Spread the adapter configuration under 'kit'
    // Other SvelteKit configurations can be added here if needed
  },
};
