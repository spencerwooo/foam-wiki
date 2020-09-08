/** @jest-environment node */

const { createApp, testCases } = require('./utils')

describe('mathjax-svg', () => {
  let app

  beforeAll(async () => {
    app = createApp('svg')
    return app.process()
  })

  testCases.forEach(({ name, content, frontmatter }) => {
    test(name, () => {
      const { html } = app.markdown.render(content, { frontmatter })
      expect(html).toMatchSnapshot()
    })
  })
})
