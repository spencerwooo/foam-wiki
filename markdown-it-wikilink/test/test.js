'use strict'

const path = require('path')
const generate = require('markdown-it-testgen')
const plugin = require('../')()

/*eslint-env mocha*/

describe('markdown-it-wikilinks', function () {
  const md = require('markdown-it')().use(plugin)

  generate(path.join(__dirname, 'fixtures/wikilinks.txt'), md)
})
