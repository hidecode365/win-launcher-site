// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://hidecode365.github.io',
  base: '/win-launcher-site',
  integrations: [react()]
});