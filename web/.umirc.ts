import { defineConfig } from "@umijs/max";
import routeConfig from './route.config';

export default defineConfig({
  base: '/',
  publicPath: '/',
  outputPath: './build',
  keepalive: [/./],
  tabsLayout: { hasDropdown: true },
  plugins: [
    require.resolve('@alita/plugins/dist/keepalive'),
    require.resolve('@alita/plugins/dist/tabs-layout'),
  ],
  routes: routeConfig,
  npmClient: 'pnpm',
  fastRefresh: true,
  esbuildMinifyIIFE: true,
  history: {
    type: 'memory'
  },
  cssMinifier: 'esbuild',
  cssMinifierOptions: {
    minifyWhitespace: true,
    minifySyntax: true,
  },
  jsMinifier: 'esbuild',
  jsMinifierOptions: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
  },
  writeToDisk: true,
  mfsu: false,
  extraBabelPlugins: [require.resolve('babel-plugin-antd-style')],
});
