const path = require('path')
const wikilinks = require('vuepress-markdown-it-wikilink')({
  baseURL: '/',
  relativeBaseURL: '/',
  htmlAttributes: { class: 'wikilinks' },
})

module.exports = {
  title: 'Spencer\'s Wiki',
  description: 'Foam as second brain, for adversarial attacks and AI security. Powered by VuePress.',
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
  ],
  theme: path.resolve(__dirname, '../../theme'),
  markdown: {
    extendMarkdown: (md) => {
      md.use(wikilinks)
    },
  },
  plugins: [
    ['@vuepress/active-header-links'],
    '@vuepress/plugin-nprogress',
    'vuepress-plugin-mathjax',
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
