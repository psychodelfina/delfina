// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://psychodelfina.ru',
  integrations: [
    tailwind(),
    preact(),
    sitemap(),
    // Compress - сжатие CSS, HTML, JS, SVG (должен быть последним)
    // PurgeCSS отключён, т.к. Tailwind v3+ уже включает JIT с автоматической очисткой CSS
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
      Image: false, // Отключено, т.к. изображения уже оптимизированы
      JavaScript: true,
      SVG: true,
      Logger: 1, // 0 = тихо, 1 = минимально, 2 = подробно
    }),
  ],
});
