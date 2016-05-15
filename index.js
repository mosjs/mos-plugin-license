'use strict'
const fileExists = require('file-exists')
const path = require('path')
const m = require('markdownscript')
const toString = require('mdast-util-to-string')
const h2 = m.h2
const link = m.link
const paragraph = m.paragraph

module.exports = (mos, markdown) => {
  Object.assign(mos.scope, {
    license: compileLicense,
  })

  mos.compile.pre((next, ast, opts) => {
    ast.children = updateLicenseSection(ast.children)
    return next(ast, opts)
  })

  function compileLicense () {
    const licensePath = path.resolve(path.dirname(markdown.filePath), 'LICENSE')
    const licenseFileExists = fileExists(licensePath)

    return [
      h2(['License']),
      paragraph([
        (licenseFileExists
          ? link({url: './LICENSE'}, [markdown.pkg.license])
          : markdown.pkg.license),
        ' © ',
        (markdown.pkg.author.url
          ? link({url: markdown.pkg.author.url}, [markdown.pkg.author.name])
          : markdown.pkg.author.name),
      ]),
    ]
  }

  function updateLicenseSection (children) {
    if (!children.length) {
      return []
    }
    const child = children.shift()
    if (child.type === 'heading' && toString(child).match(/^licen[cs]e$/i)) {
      return compileLicense().concat(removeSection(children))
    }
    return [child].concat(updateLicenseSection(children))
  }

  function removeSection (children) {
    if (!children.length) {
      return []
    }
    const child = children.shift()
    if (~['heading', 'markdownScript', 'thematicBreak'].indexOf(child.type)) {
      return [child].concat(children)
    }
    return removeSection(children)
  }
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
