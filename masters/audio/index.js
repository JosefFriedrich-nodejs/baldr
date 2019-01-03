/**
 * @file Master slide “audio”
 * @module @bldr/master-audio
 */

'use strict'

const mousetrap = require('mousetrap')
const { Howl } = require('howler')

const { Media } = require('@bldr/foundation-master')

let audioFiles = {}
let audio

/**
 *
 */
class Audio {
  /**
   *
   */
  constructor (document) {
    this.element = document.getElementById('media-info')
  }

  /**
   *
   */
  play (fileInfo) {
    this.stop()
    this.current = new Howl({ src: [fileInfo.path] })
    this.id = this.current.play()

    if (this.hasOwnProperty('element')) {
      this.element.innerHTML = fileInfo.titleSafe
      this.element.style.zIndex = 1
      this.element.style.visibility = 'visible'
      setTimeout(() => {
        this.element.style.zIndex = -1
        this.element.style.visibility = 'hidden'
      }, 2000)
    }
  }

  /**
   *
   */
  stop () {
    if (this.hasOwnProperty('current') && this.current.playing()) {
      this.current.stop()
    }
  }

  /**
   *
   */
  pausePlay () {
    if (this.hasOwnProperty('current')) {
      if (this.current.playing()) {
        this.current.pause()
      } else {
        this.current.play()
      }
    }
  }

  /**
   *
   */
  fadeOut () {
    if (this.hasOwnProperty('current') && this.current.playing()) {
      this.current.fade(1, 0, 5000)
    }
  }
}

/***********************************************************************
 * Hooks
 **********************************************************************/

exports.name = 'audio'

/**
 * @see {@link module:@bldr/core/masters~Master#init}
 */
exports.init = function (document, config) {
  audio = new Audio(document)

// ,
// {
//   function: () => {audio.stop();},
//   keys: ['ctrl+a']
// },
// {
//   function: () => {audio.fadeOut();},
//   keys: ['ctrl+f']
// },
// {
//   function: () => {audio.pausePlay();},
//   keys: ['space']
// }
}

/**
 * @see {@link module:@bldr/core/masters~Master#quickStartEntries}
 */
exports.quickStartEntries = function () {
  return [
    {
      title: 'Audio',
      master: 'audio',
      shortcut: 'ctrl+alt+a',
      fontawesome: 'volume-up'
    }
  ]
}

/**
 * @see {@link module:@bldr/core/masters~Master#normalizeData}
 */
exports.normalizeData = function (rawSlideData, config) {
  let inputFiles = new Media(config.sessionDir)
  let files = inputFiles.orderedList(rawSlideData, 'audio')

  var mousetrapbind = function (key, combo) {
    audio.play(audioFiles[key.key])
  }

  for (var i = 1; i <= files.length; i++) {
    audioFiles[i] = files[i - 1]
    mousetrap.bind('ctrl+' + i, mousetrapbind)
  }
  return files
}

/**
 * @see {@link module:@bldr/core/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  let out = ''
  for (let audioFile of slide.masterData) {
    out += `
<li>
  <span class="artist">${audioFile.artist}</span>:
  <span class="title">${audioFile.title}</span>
</li>`
  }

  return `<ol>${out}</ol>`
}