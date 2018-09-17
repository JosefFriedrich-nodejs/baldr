/**
 * @file Render process, assemble all submodules, bootstrap
 * configuration and run render process
 */

const fs = require('fs');
const path = require('path');

/**
 * The current song
 */

class Song {

  constructur() {

    /**
     * The current slide number.
     */
    this.slideNumber = 0;

    /**
     * The biggest slide number.
     */
    this.slideNumberMax = 0;

    /**
     * Array of all images files of a song.
     */
    this.slides = [];

    /**
     * The absolute path of the song folder containing the images files.
     */
    this.folder = '';

    /**
     * Parent folder containing all songs
     */
    this.songsPath = '';

    /**
     * <code><pre>
     * {
     *   "Aint-she-sweet": {
     *     "title": "Ain’t she sweet",
     *     "artist": "Milton Ager (1893 - 1979)",
     *     "lyricist": "Jack Yellen",
     *     "folder": "/home/jf/git-repositories/content/lieder/a/Aint-she-sweet",
     *     "slides": [
     *       "01.svg",
     *       "02.svg"
     *     ]
     *   },
     *   "Altes-Fieber": {
     *     "title": "Altes Fieber",
     *     "artist": "Die Toten Hosen",
     *     "musescore": "https://musescore.com/user/12559861/scores/4801717",
     *     "folder": "/home/jf/git-repositories/content/lieder/a/Altes-Fieber",
     *     "slides": [
     *       "01.svg",
     *       "02.svg",
     *       "03.svg",
     *       "04.svg",
     *       "05.svg",
     *       "06.svg"
     *     ]
     *   },
     *   "Always-look-on-the-bright-side": {
     *     "title": "Always look on the bright side of life",
     *     "source": "http://musescore.com/score/158089",
     *     "folder": "/home/jf/git-repositories/content/lieder/a/Always-look-on-the-bright-side",
     *     "slides": [
     *       "01.svg",
     *       "02.svg",
     *       "03.svg",
     *       "04.svg",
     *       "05.svg",
     *       "06.svg"
     *     ]
     *   },
     * </pre></code>
     */
    this.library = {};

    /**
     * The current song
     * <code><pre>
     * {
     *   "title": "Altes Fieber",
     *   "artist": "Die Toten Hosen",
     *   "musescore": "https://musescore.com/user/12559861/scores/4801717",
     *   "folder": "/home/jf/git-repositories/content/lieder/a/Altes-Fieber",
     *   "slides": [
     *     "01.svg",
     *     "02.svg",
     *     "03.svg",
     *     "04.svg",
     *     "05.svg",
     *     "06.svg"
     *   ]
     * }
     * </pre></code>
     */
    this.song = {};

    this.selector = '';
  }

  set(values) {
    this.songsPath = values.songsPath;
    this.library = values.library;
    this.selector = values.selector;
  }

  /**
   * Set all properties for the current song.
   *
   * @param {string} songID The ID of the song: The song title, escaped
   *   without special characters and whitespaces
   *   (e. g.: Another-brick-in-the-wall)
   */
  setCurrent(songID) {
    this.song = this.library[songID];
    if (typeof this.song !== 'undefined') {
      this.slideNumber = 0;
      this.slides = song.slides;
      this.slideNumberMax = slides.length - 1;
      this.folder = song.folder;
    }
    setSlide();
  }

  /**
   *
   */
  setSongTitle() {
    if (slideNumber === 0 && song.hasOwnProperty('title')) {
      document.getElementById('song-title').style.display = 'block';
      document.getElementById('song-title_title').textContent = song.title;
      document.getElementById('song-title_subtitle').textContent = song.subtitle;

    }
    else {
      document.getElementById('song-title').style.display = 'none';
    }
  }

  /**
   * Load the current image to the slide section.
   */
  setSlide() {
    var imagePath = path.join(this.folder, 'slides', this.slides[this.slideNumber]);
    document.querySelector(this.selector).setAttribute('src', imagePath);
    this.setSongTitle();
  }

  /**
   * Show the next slide.
   */
  nextSlide() {
    this.slideNumber += 1;
    if (this.slideNumber > this.slideNumberMax) {
      this.slideNumber = 0;
    }
    this.setSlide();
  }

  /**
   * Show the previous slide.
   */
  previousSlide() {
    this.slideNumber -= 1;
    if (this.slideNumber < 0) {
      this.slideNumber = this.slideNumberMax;
    }
    this.setSlide();
  }

  /**
   *
   */
  loadByHash() {
    if (location.hash !== '') {
      this.setCurrent(location.hash.substring(1));
      this.setSlide();
      modal.hide();
    }
  }

}

class Search {

  constructor() {
    this.library = {};
    this.selector = {};
  }

  set(values) {
    library = values.library;
    selector = values.selector;
  }

  build() {
    var select = document.createElement('select');
    select.setAttribute('id', 'select');
    select.setAttribute('placeholder', 'Suche nach einem Lied');

    var option = document.createElement('option');
    option.setAttribute('value', '');
    select.appendChild(option);

    for (var songID in library) {
      option = document.createElement('option');
      option.setAttribute('value', songID);
      option.innerHTML = library[songID].title;
      select.appendChild(option);
    }

    document.querySelector(selector).appendChild(select);
  }

}

/**
 * Toggle the modal window
 */

class Modal {

  constructor() {
    this.IDs  = ['search', 'tableofcontents'];
  }

  setDisplay(modalID, state) {
    var element = document.getElementById(modalID);
    element.style.display = state;
  }

  toggle(modalID) {
    var element = document.getElementById(modalID);
    var displayState = element.style.display;
    if (displayState === 'none') {
      element.style.display = 'block';
      if (modalID === 'search') {
        if (typeof search.selectize !== 'undefined') {
          search.selectize.focus();
          search.selectize.clear();
        }
      }
    } else {
      element.style.display = 'none';
    }
  }

  hide() {
    IDs.forEach(function(modalID) {
      setDisplay(modalID, 'none');
    });
  }

  show(modalID) {
    hide();
    setDisplay(modalID, 'block');
    if (modalID === 'search') {
      if (typeof search.selectize !== 'undefined') {
        search.selectize.focus();
        search.selectize.clear();
      }
    }
  }

}