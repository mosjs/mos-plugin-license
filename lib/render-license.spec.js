'use strict'
const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const path = require('path')
const m = require('markdownscript')
const h2 = m.h2
const p = m.paragraph
const link = m.link

const renderLicense = require('./render-license')

describe('renderLicense', () => {
  it("should create license with link to the author's website", () => {
    const pkg = {
      author: {
        name: 'Zoltan Kochan',
        url: 'http://kochan.io',
      },
      license: 'MIT',
    }
    const license = renderLicense({pkg})
    expect(license).to.eql([
      h2(['License']),
      p([
        link({url: './LICENSE'}, ['MIT']),
        ' © ',
        link({url: 'http://kochan.io'}, ['Zoltan Kochan']),
      ]),
    ])
  })

  it("should create license with author's name", () => {
    const pkg = {
      author: {
        name: 'Zoltan Kochan',
      },
      license: 'MIT',
    }
    const license = renderLicense({pkg})
    expect(license).to.eql([
      h2(['License']),
      p([
        link({url: './LICENSE'}, ['MIT']),
        ' © Zoltan Kochan',
      ]),
    ])
  })

  it("should create license with no link to license file when license file doesn't exist", () => {
    const pkg = {
      author: {
        name: 'Zoltan Kochan',
      },
      license: 'MIT',
    }
    const license = renderLicense({
      pkg,
      filePath: path.resolve(__filename),
    })
    expect(license).to.eql([
      h2(['License']),
      p(['MIT © Zoltan Kochan',
      ]),
    ])
  })
})
