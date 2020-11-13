import { StringIndexedObject } from '@bldr/type-definitions'

/**
 * A slide.
 */
export interface Slide {

  /**
   * A deep copy of the raw slide data.
   */
  rawData: object

  /**
   * The slide number
   */
  no: number

  /**
   * The name of the master slide.
   */
  masterName: string

  /**
   * Data in various types to pass to a master slide.
   * Normalized master data. This data gets passed through the master slides,
   * to the props of the Vue components.
   */
  props: StringIndexedObject

  /**
   * Props (properties) to send to the main Vue master component.
   */
  propsMain: StringIndexedObject

  /**
   * Props (properties) to send to the preview Vue master component.
   */
  propsPreview: StringIndexedObject

  /**
   * A list of media URIs.
   */
  mediaUris: string[]

  /**
   * Media URIs that do not have to exist.
   */
  optionalMediaUris: string[]

  /**
   * How many steps the slide provides.
   */
  stepCount: number

  /**
   * The current step number. The first number is 1 not 0.
   */
  stepNo: number

  /**
   * Css properties in camelCase for the style property of the vue js
   * render function.
   *
   * ```yml
   * - title: Different background color
   *   task: Background color blue
   *   style:
   *     background_color: $green;
   *     color: $blue;
   *     font_size: 8vw
   *     font_weight: bold
   * ```
   *
   * @see {@link https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax-1}
   *
   * @type {Object}
   */
  style: StringIndexedObject

  /**
   * The level in the hierarchial slide tree.
   */
  level: number

  /**
   * The scale factor of the current slide. This factor is used to set
   * the font size of parent HTML container. All visual elements of the slide
   * have to react on different font sizes to get a scale factor.
   */
  scaleFactor: number
}