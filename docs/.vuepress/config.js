const path = require('path')
const wikilinks = require('vuepress-markdown-it-wikilink')({
  baseURL: '/',
  relativeBaseURL: '/',
  htmlAttributes: { class: 'wikilinks' },
})

module.exports = {
  theme: path.resolve(__dirname, '../../theme'),
  markdown: {
    extendMarkdown: (md) => {
      md.use(wikilinks)
    },
  },
  plugins: [
    ['@vuepress/active-header-links'],
    '@vuepress/plugin-nprogress',
    [
      'vuepress-plugin-mathjax',
      {
        target: 'svg',
        macros: {
          '*': '\\times',
        },
      },
    ],
    [
      'container',
      {
        type: 'tip',
        defaultTitle: {
          '/': 'TIP',
        },
      },
    ],
    [
      'container',
      {
        type: 'warning',
        defaultTitle: {
          '/': 'WARNING',
        },
      },
    ],
    [
      'container',
      {
        type: 'danger',
        defaultTitle: {
          '/': 'WARNING',
        },
      },
    ],
    [
      'container',
      {
        type: 'success',
        defaultTitle: {
          '/': 'SUCCESS',
        },
      },
    ],
    [
      'container',
      {
        type: 'details',
        before: (info) =>
          `<details class="custom-block details">${
          info ? `<summary>${info}</summary>` : ''
          }\n`,
        after: () => '</details>\n',
      },
    ],
    ['smooth-scroll'],
  ],
}
