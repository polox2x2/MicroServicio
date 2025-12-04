const { defineConfig } = require('@rsbuild/core');
const { pluginReact } = require('@rsbuild/plugin-react');

module.exports = defineConfig({
  plugins: [pluginReact()],
  html: {
    template: './public/index.html',
  },
});
