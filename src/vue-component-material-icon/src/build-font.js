#! /usr/bin/env node

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const webfont = require('webfont').default

const basePath = path.resolve(__dirname)

// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

webfont({
  files: `${basePath}/icons/*.svg`,
  fontName: 'baldr-icons',
  formats: ['woff', 'woff2'],
  fontHeight: 512
})
  .then(result => {
    const css = []

    const header = fs.readFileSync(path.join(basePath, 'style_header.css'), { encoding: 'utf-8' })
    css.push(header)

    for (const glyphData of result.glyphsData) {
      const name = glyphData.metadata.name
      const unicodeGlyph = glyphData.metadata.unicode[0]
      const cssUnicodeEscape = '\\' + unicodeGlyph.charCodeAt(0).toString(16)
      const cssGlyph = `.baldr-icons-${name}::before {
  content: "${cssUnicodeEscape}";
}
`
      css.push(cssGlyph)
      console.log(`name: ${chalk.red(name)} unicode glyph: ${chalk.yellow(unicodeGlyph)} unicode escape hex: ${chalk.green(cssUnicodeEscape)}`)
    }
    fs.writeFileSync(path.join(basePath, 'style.css'), css.join('\n'), { encoding: 'utf-8' })
    fs.writeFileSync(path.join(basePath, 'baldr-icons.woff'), result.woff)
    fs.writeFileSync(path.join(basePath, 'baldr-icons.woff2'), result.woff2)
    return result
  })
  .catch(error => {
    throw error
  })
