import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    scss: {
      includePaths: ['theme']
    }
  }),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '/index.html'
    }),
    ssr: false,
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    vite: () => ({
      resolve: {
        alias: {
          $images: path.resolve('src/images'),
          $css: path.resolve('src/css'),
          $api: path.resolve('src/api'),
          $utils: path.resolve('src/utils'),
          $stores: path.resolve('src/stores')
        }
      },
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:16180',
            changeOrigin: true,
            ws: true
          }
        }
      }
    })
  }
};

export default config;
