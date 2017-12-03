/**
 * @file Gather informations about all available master slides
 * @module baldr-application/masters
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {addCSSFile} = require('baldr-library');

/***********************************************************************
 *
 **********************************************************************/

/**
 * Data in various types to pass to a master slide.
 * @typedef rawMasterData
 * @type {(boolean|number|string|array|object)}
 */

/**
 * Normalized master data in various types.
 * @typedef masterData
 * @type {(boolean|number|string|array|object)}
 */

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class Master {

  /**
   * @param {string} modulePath
   * @param {string} name
   */
  constructor(modulePath, name) {
    let defaults = this.setDefaults_(modulePath);
    let dirname = path.dirname(modulePath);

    /*******************************************************************
     * Members
     ******************************************************************/

    /**
     * @type {object}
     * @property {object} config
     * @property {boolean} config.centerVertically
     * @property {boolean} config.stepSupport
     * @property {string} config.theme
     */
    this.config = defaults.config;

    /**
     * @type {boolean}
     */
    this.css = this.hasCSS_(dirname);

    /**
     * Some documentation informations about the master slide.
     *
     * <code><pre>
     * exports.documentation = {
     *   examples: [
     * `
     * - mastername:
     *      property: value
     * `,
     * `
     * - mastername:
     *      property: value
     * `
     *   ]
     * };
     * </pre></pre>
     * @type {object}
     * @property {object} documentation
     * @property {array} documentation.examples
     */
    this.documentation = defaults.documentation;

    /**
     * @type {string}
     */
    this.path = dirname;

    /**
     * @type {string}
     */
    this.name = name;

    /*******************************************************************
     * Methods
     ******************************************************************/

    /**
     * @function
     * @param {module:baldr-application~Document} document The document
     *   object (DOM) of the render process.
     * @param {module:baldr-application/slides~Slide} oldSlide The
     *   object representation of the old slide.
     * @param {module:baldr-application/slides~Slide} newSlide The
     *   object representation of the new slide.
     */
    this.cleanUp = defaults.cleanUp;

    /**
     * @function
     * @param {module:baldr-application~Document} document The document
     *   object (DOM) of the render process.
     * @param {module:baldr-library/config~Config} config All
     *   configurations of the current presentation session.
     */
    this.init = defaults.init;

    /**
     * @function
     * @param {module:baldr-application~Document} document The document
     *   object (DOM) of the render process.
     * @param {module:baldr-application/slides~Slide} slide The object
     *   representation of one slide.
     * @param {module:baldr-library/config~Config} config All
     *   configurations of the current presentation session.
     */
    this.initSteps = defaults.initSteps;

    /**
     * @function
     * @param {module:baldr-application~Document} document The document
     *   object (DOM) of the render process.
     * @param {module:baldr-application/slides~Slide} slide The object
     *   representation of one slide.
     * @param {module:baldr-library/config~Config} config All
     *   configurations of the current presentation session.
     */
    this.initStepsEveryVisit = defaults.initStepsEveryVisit;

    /**
     * @function
     * @param {module:baldr-application/slides~Slide} slide The object
     *   representation of one slide.
     * @param {module:baldr-library/config~Config} config All
     *   configurations of the current presentation session.
     * @param {module:baldr-application~Document} document The document
     *   object (DOM) of the render process.
     * @return {string}
     */
    this.mainHTML = defaults.mainHTML;

    /**
     * @function
     * @return {string}
     */
    this.modalHTML = defaults.modalHTML;

    /**
     * Normalize the data input of the master slide.
     *
     * @function
     * @param {module:baldr-application/masters~rawMasterData} rawMasterData
     *   Data in various types to pass to a master slide.
     * @param {module:baldr-library/config~Config} config All
     *   configurations of the current presentation session.
     *
     * @return {module:baldr-application/masters~masterData} The
     * normalized master data.
     */
    this.normalizeData = defaults.normalizeData;

    /**
     * @function
     * @param {module:baldr-application~Document} document The document
     * object (DOM) of the render process.
     * @param {module:baldr-library/config~Config} config All
     *   configurations of the current presentation session.
     * @param {module:baldr-application/slides~Slide} slide The object
     *   representation of one slide.
     * @return {undefined}
     * @see {@link module:baldr-application~ShowRunner#setMain}
     */
    this.postSet = defaults.postSet;

    /**
     * @function
     * @return {module:baldr-application/quick-start~rawQuickStartEntries}
     * @see {@link module:baldr-application/quick-start~QuickStart#collectEntries}
     */
    this.quickStartEntries = defaults.quickStartEntries;

    /**
     * @function
     * @param {integer} no
     * @param {integer} count
     * @param {object} stepData
     * @param {module:baldr-application~Document} document The document
     *   object (DOM) of the render process.
     * @return {undefined}
     * @see {@link module:baldr-application/slides~StepSwitcher#setByNo}
     */
    this.setStepByNo = defaults.setStepByNo;
  }

  /**
   * Check if the CSS style file “styles.css” in the master slide
   * folder exists.
   */
  hasCSS_(masterPath) {
    if (fs.existsSync(path.join(masterPath, 'styles.css'))) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   *
   */
  setDefaults_(modulePath) {
    let requireObject = require(modulePath);
    let emptyFunc = function() {};
    let returnEmpty = function() {return '';};
    let funcFalse = function() {return false;};

    let config = {
      centerVertically: false,
      stepSupport: false,
      theme: 'default'
    };

    let documentation = {
      examples: []
    };

    requireObject.config = Object.assign({}, config, requireObject.config);
    requireObject.documentation = Object.assign({}, documentation, requireObject.documentation);

    let defaultObject = {
      cleanUp: emptyFunc,
      init: emptyFunc,
      initSteps: funcFalse,
      initStepsEveryVisit: funcFalse,
      mainHTML: returnEmpty,
      modalHTML: returnEmpty,
      normalizeData: function(data) {return data;},
      postSet: emptyFunc,
      quickStartEntries: function() {return [];},
      setStepByNo: emptyFunc
    };

    return Object.assign({}, defaultObject, requireObject);
  }

}

/***********************************************************************
 *
 **********************************************************************/

/**
 * Gather informations about all available master slides.
 */
class Masters {

  /**
   * @param {module:baldr-application~Document} document The document
   *   object (DOM) of the render process.
   */
  constructor(document) {

    /**
     * The document object (DOM) of the render process.
     * @type {module:baldr-application~Document}
     */
    this.document = document;

    /**
     * Parent path of all master slide modules.
     * @type {string}
     */
    this.path = path.join(__dirname, '..', '..', 'masters');

    /**
     * Folder name of master slides
     * @type {array}
     */
    this.all = this.getAll_();
    for (let masterName of this.all) {
      this[masterName] = this.initMaster_(masterName);
    }

    this.addCSS_();
  }

  /**
   * @param {string} masterName The name of the master slide.
   */
  initMaster_(masterName) {
    return new Master(path.join(this.path, masterName, 'index.js'), masterName);
  }

  /**
   *
   */
  addCSS_() {
    for (let masterName of this.all) {
      if (this[masterName].css) {
        addCSSFile(
          this.document,
          path.join(this[masterName].path, 'styles.css'),
          'baldr-master'
        );
      }
    }
  }

  /**
   * Get the folder off all master slide modules.
   * @return {array} Folder name of master slides
   */
  getAll_() {
    return fs.readdirSync(this.path, 'utf8')
    .filter(
      dir => fs.statSync(
        path.join(this.path, dir)
      ).isDirectory()
    );
  }

  /**
   *
   */
  execAll(hookName) {
    let args = Array.from(arguments);
    args.shift();
    for (let master of this.all) {
      this[master][hookName](...args);
    }
  }
}

/**
 * @param {module:baldr-application~Document} document The document
 *   object (DOM) of the render process.
 */
exports.getMasters = function(document) {
  return new Masters(document);
};
