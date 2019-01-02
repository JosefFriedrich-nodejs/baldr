/**
 * @file Gather informations about all themes.
 * @module @bldr/core/themes
 */

'use strict'

const path = require('path')
const { addCSSFile } = require('@bldr/foundation-master')

/***********************************************************************
 *
 **********************************************************************/

/**
 * Gather informations about all themes.
 */
class Themes {
  /**
   * @param {module:@bldr/core~Document} document The document
   *   object of the browser (DOM).
   */
  constructor (document) {
    /**
     * The document object of the browser (DOM).
     * @type {module:@bldr/core~Document}
     */
    this.document = document

    /**
     * Folder names of all themes
     * @type {array}
     */
    this.all = [
      '@bldr/theme-default',
      '@bldr/theme-handwriting'
    ]
  }

  /**
   * @return {array} A array of CSS files in the order: first
   * dependencies of the theme and then the real theme CSS file
   */
  getAllCSSFiles_ () {
    let cssFiles = []
    for (let packageName of this.all) {
      let theme = require(packageName)
      for (let cssFile of theme.cssFiles) {
        cssFiles.push(cssFile)
      }
      cssFiles.push(path.join(path.dirname(require.resolve(packageName)), 'styles.css'))
    }
    return cssFiles
  }

  /**
   * Load all CSS files of all themes and add link elements to the
   * DOM.
   */
  loadThemes () {
    for (let cssFile of this.getAllCSSFiles_()) {
      addCSSFile(this.document, cssFile, 'baldr-theme')
    }
  }
}

/***********************************************************************
 *
 **********************************************************************/

/**
 * @param {module:@bldr/core~Document} document The document
 *   object of the browser (DOM).
 */
exports.getThemes = function (document) {
  let themes = new Themes(document)
  themes.loadThemes()
  return themes
}
