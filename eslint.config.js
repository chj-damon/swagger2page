// @ts-check
const simon_he = require('@simon_he/eslint-config').default;

module.exports = simon_he({
  typescript: true,
  jsx: true,
  rules: [
    {
      'no-console': 'off',
    },
  ],
});
