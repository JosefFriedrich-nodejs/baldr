import { plainText } from '@bldr/core-browser'
import { markupToHtml, wrapWords, displayElementByStepNo } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

const CHARACTERS_ON_SLIDE = 400

const example = `
---
slides:

- title: Test word wrap
  generic:
    step_words: true
    markup: |
      # Heading 1

      Lorem ipsum [dolor sit amet](https://google.de), consectetur:

      ## Adipisici elit, sed eiusmod

      * Tempor incidunt ut labore.
      * Veniam, quis nostrud.

- title: UTF-8 Arrows
  generic: |
    * Leftwards Arrow: <-
    * Rightwards Arrow: ->
    * Left Right Arrow: <->

- title: hr to generate steps
  generic: |
    step 1

    ---

    step 2

- title: Using props
  generic:
    markup: Using props

- title: Step support
  generic:
    markup:
    - Step 1
    - Step 2

- title: Long text in steps
  generic:
    markup:
    - |
      Step 1: Tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea
      commodi consequat.

    - |
      Step 2: Quis aute iure reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
      cupiditat non proident, sunt in culpa qui officia deserunt mollit anim
      id est laborum.

- title: Top level step support
  generic:
  - |
    Step 1: Tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea
    commodi consequat.

  - |
    Step 2: Quis aute iure reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
    cupiditat non proident, sunt in culpa qui officia deserunt mollit anim
    id est laborum.

- title: Long text (specified as Markdown)
  generic: |
    # Heading 1

    Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod
    tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea
    commodi consequat. Quis aute iure reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
    cupiditat non proident, sunt in culpa qui officia deserunt mollit anim
    id est laborum.

    # Heading 2

    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
    molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero
    eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
    zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum
    dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
    euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

    # Heading 3

    Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
    suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem
    vel eum iriure dolor in hendrerit in vulputate velit esse molestie
    consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et
    accumsan et iusto odio dignissim qui blandit praesent luptatum zzril
    delenit augue duis dolore te feugait nulla facilisi.

    Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet
    doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit
    amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
    tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad
    minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
    nisl ut aliquip ex ea commodo consequat.

    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
    molestie consequat, vel illum dolore eu feugiat nulla facilisis.

    At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
    ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
    voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
    clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At
    accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy
    sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd
    magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem
    ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
    elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
    aliquyam erat.

    Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
    accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no
    sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor
    sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
    vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
    ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
    voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
    clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet.

- title: Heading (specified as Markdown)
  generic: |
    # heading 1
    ## heading 2
    ### heading 3

- title: Lorem ipsum (specified as Markdown)
  generic: |
    Lorem ipsum dolor sit amet ...

    consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit
    anim id est laborum.

- title: Ordered list
  generic: |
    1. one
    2. two
    3. three

- title: Unordered list (specified as Markdown)
  generic: |
    * one
    * two
    * three

- title: Heading (specifed as HTML)
  generic: |
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>

- title: Lorem ipsum (specifed as HTML)
  generic: |
    <p>Lorem ipsum dolor sit amet ...</p>

    <p>consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit
    anim id est laborum.</p>

- title: Ordered list (specifed as HTML)
  generic: |
    <ol>
      <li>one</li>
      <li>two</li>
      <li>three</li>
    </ol>

- title: Unordered list (specifed as HTML)
  generic: |
    <ul>
      <li>one</li>
      <li>two</li>
      <li>three</li>
    </ul>
`

function splitHtmlintoChunks (htmlString, charactersOnSlide) {
  if (!charactersOnSlide) charactersOnSlide = CHARACTERS_ON_SLIDE
  if (htmlString.length < charactersOnSlide) return [htmlString]

  const domParser = new DOMParser()
  const dom = domParser.parseFromString(htmlString, 'text/html')

  let buffer = ''
  const chunks = []

  for (const children of dom.body.children) {
    buffer += children.outerHTML
    if (buffer.length > charactersOnSlide) {
      chunks.push(buffer)
      buffer = ''
    }
  }
  // Add last not full buffer
  if (buffer) chunks.push(buffer)
  return chunks
}

export default {
  title: 'Folie',
  props: {
    markup: {
      type: [String, Array],
      required: true,
      // It is complicated to convert to prop based markup conversion.
      //markup: true
      description:  'Markup im HTML oder Markdown-Format'
    },
    charactersOnSlide: {
      type: [Number],
      description: 'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
      default: CHARACTERS_ON_SLIDE
    },
    stepWords: {
      type: [Boolean],
      description: 'Wörtern einblenden',
      default: false
    }
  },
  icon: {
    name: 'file-presentation-box',
    color: 'gray',
    showOnSlides: false
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string' || Array.isArray(props)) {
      props = {
        markup: props
      }
    }
    if (typeof props.markup === 'string') {
      props.markup = [props.markup]
    }

    // Convert into HTML
    const converted = []
    for (const markup of props.markup) {
      converted.push(markupToHtml(markup))
    }

    // Split by <hr>
    const steps = []
    for (const html of converted) {
      if (html.indexOf('<hr>') > -1) {
        const chunks = html.split('<hr>')
        for (const chunk of chunks) {
          steps.push(chunk)
        }
      } else {
        steps.push(html)
      }
    }

    // Split large texts into smaller chunks
    const markup = []
    for (const html of steps) {
      const chunks = splitHtmlintoChunks(html, props.charactersOnSlide)
      for (const chunk of chunks) {
        markup.push(chunk)
      }
    }

    if (props.stepWords) {
      props.markup = [wrapWords(markup.join(' '))]
    } else {
      props.markup = markup
    }
    return props
  },
  stepCount (props) {
    return props.markup.length
  },
  plainTextFromProps (props) {
    const output = []
    for (const markup of props.markup) {
      output.push(plainText(markup))
    }
    return output.join(' | ')
  },
  enterSlide () {
    if (this.stepWords) {
      this.steps = document.querySelectorAll('span.word')
      this.slideCurrent.renderData.stepCount = this.steps.length + 1
      displayElementByStepNo({
        elements: this.steps,
        stepNo: this.slideCurrent.renderData.stepNoCurrent,
        full: true,
        visibility: true
      })
    }
  },
  enterStep ({ oldStepNo, newStepNo }) {
    const stepNo = newStepNo
    if (this.stepWords) displayElementByStepNo({
      elements: this.steps,
      oldStepNo,
      stepNo,
      visibility: true
    })
  }
}
