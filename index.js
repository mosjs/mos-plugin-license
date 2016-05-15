'use strict'
const fileExists = require('file-exists')
const path = require('path')
const m = require('markdownscript')
const h2 = m.h2
const link = m.link
const paragraph = m.paragraph

module.exports = (mos, markdown) => {
  Object.assign(mos.scope, {
    license: compileLicense,
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
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
