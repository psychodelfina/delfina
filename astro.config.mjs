// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://psychodelfina.ru',
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Comfortaa',
      cssVariable: '--font-heading',
      options: {
        variants: [
          {
            weight: '300 700',
            style: 'normal',
            src: ['./src/assets/fonts/comfortaa/Comfortaa-VariableFont_wght.ttf'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Nunito',
      cssVariable: '--font-body',
      options: {
        variants: [
          {
            weight: '200 1000',
            style: 'normal',
            src: ['./src/assets/fonts/nutino/Nunito-VariableFont_wght.ttf'],
          },
          {
            weight: '200 1000',
            style: 'italic',
            src: ['./src/assets/fonts/nutino/Nunito-Italic-VariableFont_wght.ttf'],
          },
        ],
      },
    },
  ],
  experimental: {
    svgo: true,
  },
  integrations: [
    tailwind(),
    preact(),
    sitemap(),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: true,
      Logger: 1,
    }),
  ],
});
