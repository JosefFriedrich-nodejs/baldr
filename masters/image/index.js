/**
 * @file Master slide “image”
 * @module baldr-master-image
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “image”
 */
class MasterImage extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);

    this.dataNormalized = this.normalizeData(this.data);
  }

  /**
   *
   */
  normalizeSinglePath(filePath) {
    return this.presentation.filterFiles(
      filePath,
      ['jpg', 'jpeg', 'png']
    );
  }

  /**
   *
   */
  normalizeData(data) {
     if (typeof data === 'object' && Array.isArray(data)) {
      let out = [];
      for (let filePath of data) {
        var images = this.normalizeSinglePath(filePath);
        for (let image of images) {
          out.push(image);
        }
      }
      return out;
    } else if (typeof data === 'string') {
      return this.normalizeSinglePath(data);
    }
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return `<img src="${this.dataNormalized[0]}">`;
  }

}

exports.MasterImage = MasterImage;
