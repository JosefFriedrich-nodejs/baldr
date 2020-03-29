// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/media-server')
const lib = require('../../lib.js')

/**
 * Rename a media asset after the `id` in the meta data file.
 *
 * @param {String} filePath - The media asset file path.
 */
function renameFromIdOneFile (filePath) {
  let result
  try {
    result = yaml.safeLoad(fs.readFileSync(`${filePath}.yml`, 'utf8'))
  } catch (error) {
    console.log(filePath)
    console.log(error)
    return
  }

  if ('id' in result && result.id) {
    let id = result.id
    const oldPath = filePath

    // .mp4
    const extension = path.extname(oldPath)
    const oldBaseName = path.basename(oldPath, extension)
    let newPath = null
    // Gregorianik_HB_Alleluia-Ostermesse -> Alleluia-Ostermesse
    id = id.replace(/.*_[A-Z]{2,}_/, '')
    console.log(id)
    if (id !== oldBaseName) {
      newPath = path.join(path.dirname(oldPath), `${id}${extension}`)
    } else {
      return
    }
    lib.moveAsset(oldPath, newPath)
  }
}

/**
 * Rename a media asset or all child asset of the parent working directory
 * after the `id` in the meta data file.
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        renameFromIdOneFile(relPath)
      }
    }
  }, {
    path: files
  })
}

module.exports = action