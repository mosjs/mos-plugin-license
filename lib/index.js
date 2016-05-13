'use strict'
module.exports = plugin

const renderLicense = require('./render-license')

function plugin (markdown) {
  return {
    license: () => renderLicense(markdown),
  }
}
