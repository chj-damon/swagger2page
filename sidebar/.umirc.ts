import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  base: '/',
  publicPath: '/',
  outputPath: './build',
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [{ exact: true, path: '/', component: '@/pages/index' }],
    },
  ],
  fastRefresh: {},
  dynamicImport: false,
  history: {
    type: 'memory',
  },
  devServer: {
    writeToDisk: (filePath: string) =>
      ['umi.js', 'umi.css'].some((name) => filePath.endsWith(name)),
  },
});
