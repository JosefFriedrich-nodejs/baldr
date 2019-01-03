/**
 * @file Master slide “quote”
 * @module @bldr/master-quote
 */

'use strict'

/**
 *
 */
let renderAttribution = function (author = '', date = '') {
  let comma = ''

  if (author) {
    author = `<span class="author">${author}</span>`
  }

  if (date) {
    date = `<span class="date">${date}</span>`
  }

  if (author && date) {
    comma = ', '
  }
  let attribution = author + comma + date

  if (attribution) {
    return `<p class="attribution">${attribution}</p>`
  } else {
    return ''
  }
}

/**
 *
 */
let renderQuotationMark = function (begin = true) {
  let mark = '»'
  let id = 'begin'
  if (!begin) {
    mark = '«'
    id = 'end'
  }
  return `<span id="quotation-${id}" class="quotation-mark">${mark}</span>`
}

/***********************************************************************
 * Hooks
 **********************************************************************/

exports.name = 'quote'

/**
 * @see {@link module:@bldr/core/masters~Master#config}
 */
exports.config = {
  centerVertically: true
}

/**
 * @see {@link module:@bldr/core/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  let data = slide.masterData
  let attribution = renderAttribution(data.author, data.date)
  let begin = renderQuotationMark()
  let end = renderQuotationMark(false)
  return `
<section id="@bldr/master-quote">

  <p class="text">${begin} ${data.text} ${end}</p>

  ${attribution}

</section>
`
}