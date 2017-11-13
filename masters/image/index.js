/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');
const {Media} = require('baldr-media');


/**
 * Master class for the master slide “image”
 */
class MasterImage extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
    this.inputFiles = new Media(this.presentation.pwd);
    this.dataNormalized = this.normalizeData(this.data);
  }

  /**
   *
   */
  normalizeData(data) {
    return this.inputFiles.orderedList(data, 'image');
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `<img id="baldr-master-image">`;
  }

  /**
   *
   */
  hookPostFirstSet() {
    this.stepNo = 1;
    this.stepCount = this.dataNormalized.length;
  }

  /**
   */
  hookPostSet() {
    this.elemImage = this.document
      .getElementById('baldr-master-image');
    this.setImage();
  }

  /**
   *
   */
  setImage() {
    this.elemImage
      .setAttribute('src', this.dataNormalized[this.stepNo - 1].path);
  }

  /**
   *
   */
  hookSetStep() {
    this.setImage();
  }

}

exports.MasterImage = MasterImage;
