import { defineConfig } from 'umi';

export default defineConfig({
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
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  history: {
    type: 'memory',
  },
  mfsu: false,
  writeToDisk: true,
  extraBabelPlugins: ['babel-plugin-dynamic-import-node'], // 配置了这个之后就只会有一个js和css文件
  devtool: false,
});
