const { fs, path, parseFrontmatter } = require('@vuepress/shared-utils')
const { createApp } = require('@vuepress/core')

const fragmentDir = path.join(__dirname, 'fragments')

module.exports.createApp = (target) => createApp({
  plugins: [
    [require('..'), {
      target,
      macros: {
        '\\Z': '\\mathbb{Z}',
      },
    }],
  ],
})

module.exports.testCases = fs.readdirSync(fragmentDir).map((name) => {
  const filepath = path.join(fragmentDir, name)
  const rawFile = fs.readFileSync(filepath, 'utf8')
  const { data, content } = parseFrontmatter(rawFile)
  return { name, content, frontmatter: data }
})
