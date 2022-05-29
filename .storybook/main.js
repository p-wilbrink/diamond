const path = require('path')

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-docs",
    "storybook-addon-designs",
    "@storybook/preset-scss"
  ],
  "framework": "@storybook/angular",
  "core": {
    "builder": "@storybook/builder-webpack5"
  }
}
