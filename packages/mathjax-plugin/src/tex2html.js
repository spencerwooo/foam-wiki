const url = require('url')
const path = require('path')
const LruCache = require('lru-cache')

const { TeX } = require('mathjax-full/js/input/tex')
const { SVG } = require('mathjax-full/js/output/svg')
const { CHTML } = require('mathjax-full/js/output/chtml')
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor')
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages')
const { LiteDocument } = require('mathjax-full/js/adaptors/lite/Document')
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js')
const { mathjax } = require('mathjax-full/js/mathjax.js')

const escapedCharacters = '^$()[]{}*.?+\\|'

function toEscapedString (source) {
  const chars = source.split('').map(char => {
    return escapedCharacters.includes(char) ? '\\' + char : char
  })
  const lastChar = chars[chars.length - 1]
  if (lastChar.match(/\w/)) chars.push('\\b')
  return chars.join('')
}

function ensureArray (option) {
  if (!option) {
    return []
  } else if (Array.isArray(option)) {
    return option
  } else {
    return [option]
  }
}

module.exports = (options, tempPath) => {
  let {
    em = 16,
    ex = 8,
    width = 80 * 16,
    packages = AllPackages,
    target = '',
  } = options

  let cache
  if (options.cache !== false) {
    cache = new LruCache({ ...options.cache })
  }

  if (typeof packages === 'string') {
    packages = packages.split(/\s*,\s*/)
  }

  const { macros, presets } = options

  for (const key in macros) {
    if (typeof macros[key] !== 'string') {
      delete macros[key]
    }
  }
  const macroRegex = new RegExp(Object.keys(macros).map(toEscapedString).join('|'), 'g')

  // set up mathjax and conversion function
  const InputJax = new TeX({ packages })
  const OutputJax = target.toLowerCase() === 'svg'
    ? new SVG()
    : new CHTML({
      // eslint-disable-next-line node/no-deprecated-api
      fontURL: url.resolve(
        path.relative(
          tempPath,
          require.resolve('mathjax-full')
        ),
        '../../../es5/output/chtml/fonts/woff-v2',
      ),
      adaptiveCSS: false
    })

  const adaptor = liteAdaptor()
  RegisterHTMLHandler(adaptor);

  const html = mathjax.document(new LiteDocument(), {InputJax: InputJax, OutputJax: OutputJax});
  let style = adaptor.textContent(OutputJax.styleSheet(html))

  // https://github.com/mathjax/mathjax-v3/pull/256
  style = style.replace(/\bwhite space\b/g, 'white-space')
  // console.log(style)
  return {
    style,
    render (source, display, localPresets) {
      source = presets.concat(ensureArray(localPresets)).join('') + source
      source = source.replace(macroRegex, matched => macros[matched] + ' ')

      if (cache) {
        const output = cache.get(source)
        if (typeof output === 'string') return output
      }

      const math = new html.options.MathItem(source, InputJax, display)
      math.setMetrics(em, ex, width, 100000, 1)
      math.compile(html)
      math.typeset(html)
      const output = adaptor.outerHTML(math.typesetRoot)

      if (cache) cache.set(source, output)

      return output
    },
  }
}
