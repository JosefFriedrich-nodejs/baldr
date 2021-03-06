/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/meta-data-kind
 */

import { DeepTitleInterface, AssetType } from '@bldr/type-definitions'

/**
 * Specification of the metadata kinds.
 */
export namespace MetaData {

  /**
   * Defintion of the function `format()`.
   */
  type WikidataFormatFunc = (value: string, arg: Kind) => string

  /**
   * The specification of a wikidata media metadata property.
   */
  export interface WikidataProp {
    /**
     * for example `P123` or `['P123', 'P234']`. If `fromClaim` is an
     * array, the first existing claim an a certain item is taken.
     */
    fromClaim?: string | string[]

    /**
     * `getDescription`, `getLabel`, `getWikipediaTitle`. If `fromClaim`
     * is specifed and the item has a value on this claim, `fromEntity` is
     * omitted.
     */
    fromEntity?: 'getDescription' | 'getLabel' | 'getWikipediaTitle'

    /**
     * `queryLabels`
     */
    secondQuery?: string

    /**
     * Update the wikidata property always.
     */
    alwaysUpdate?: boolean

    /**
     * A function or `formatDate`, `formatYear`, `formatWikicommons`,
     * `formatList`, `formatSingleValue`.
     */
    format?: WikidataFormatFunc | 'formatDate' | 'formatList' | 'formatYear' | 'formatWikicommons' | 'formatSingleValue'
  }

  /**
   * The name of a property.
   */
  export type PropName = string

  /**
   * Definition of the argument for the function `derive()`.
   */
  interface DeriveFuncArg {
    kindData: AssetType.Generic
    kindSpecification: Kind
    folderTitles: DeepTitleInterface
    filePath: string
  }

  /**
   * Defintion of the function `derive()`.
   */
  type DeriveFunc = (arg: DeriveFuncArg) => any

  /**
   * Defintion of the function `format()`.
   */
  type FormatFunc = (value: any, dataAndSpec: KindDataAndSpec) => any

  /**
   * Defintion of the function `validate()`.
   */
  type ValidateFunc = (value: any) => boolean

  /**
   * Defintion of type for the property `state`.
   */
  type State = 'absent' | 'present'

  /**
   * The specification of a media metadata property.
   */
  export interface Prop {
    /**
     * A title of the property.
     */
    title: string

    /**
     * A text which describes the property.
     */
    description?: string

    /**
     * True if the property is required.
     */
    required?: boolean

    /**
     * A function to derive this property from other values. The function
     * is called with `derive ({ kindData, kindSpecification, folderTitles,
     * filePath })`.
     */
    derive?: DeriveFunc

    /**
     * Overwrite the original value by the
     * the value obtained from the `derive` function.
     */
    overwriteByDerived?: boolean

    /**
     * Format the value of the property using this function. The function
     * has this arguments: `format (value, { kindData, kindSpecification })`
     */
    format?: FormatFunc

    /**
     * If the value matches the specified regular expression, remove the
     * property.
     *
     */
    removeByRegexp?: RegExp

    /**
     * Validate the property using this function.
     */
    validate?: ValidateFunc

    /**
     * See package `@bldr/wikidata`.
     */
    wikidata?: WikidataProp

    /**
     * `absent` or `present`
     */
    state?: State
  }

  /**
   * The specification of all properties. The single `propSpec`s are indexed
   * by the `propName`.
   *
   * ```js
   * const propSpecs = {
   *   propName1: propSpec1,
   *   propName2: propSpec2
   *   ...
   * }
   * ```
   */
  export interface PropCollection {
    [key: string]: Prop
  }

  /**
   * Definition of the argument for the function `relPath()`.
   */
  interface RelPathFuncArg {
    kindData: AssetType.Generic
    kindSpecification: Kind
    oldRelPath: string
  }

  /**
   * Defintion of the function `relPath()`.
   */
  type RelPathFunc = (arg: RelPathFuncArg) => string

  /**
   * Defintion of the function `detectKindByPath()`.
   */
  type DetectKindByPathFunc = (arg: Kind) => RegExp

  /**
   * Defintion of the function `intialize()`.
   */
  type InitializeFunc = (arg: KindDataAndSpec) => AssetType.Generic

  /**
   * Defintion of the function `finalize()`.
   */
  type FinalizeFunc = (dataAndSpec: KindDataAndSpec) => AssetType.Generic

  /**
   * Defintion of the argument of the function `normalizeWikidata()`.
   */
  interface NormalizeWikidataFuncArg {
    kindData: AssetType.Generic
    entity: { [key: string]: any }
    functions: { [key: string]: Function }
  }

  /**
   * Defintion of the function `normalizeWikidata()`.
   */
  type NormalizeWikidataFunc = (arg: NormalizeWikidataFuncArg) => AssetType.Generic

  /**
   * The specification of one metadata kind.
   */
  export interface Kind {
    /**
     * A title for the metadata kind.
     */
    title: string

    /**
     * A text to describe a metadata kind.
     */
    description?: string

    /**
     * A two letter abbreviation. Used in the IDs.
     */
    abbreviation?: string

    /**
     * The base path where all meta typs stored in.
     */
    basePath?: string

    /**
     * A function which must return the relative path (relative to
     * `basePath`).
     */
    relPath?: RelPathFunc

    /**
     * A regular expression that is matched against file paths or a
     * function which is called with `kindSpecification` that returns a regexp.
     */
    detectKindByPath?: RegExp | DetectKindByPathFunc

    /**
     * A function which is called before all processing steps: `initialize
     * ({ kindData, kindSpecification })`.
     */
    initialize?: InitializeFunc

    /**
     * A function which is called after all processing steps: arguments:
     * `finalize ({ kindData, kindSpecification })`
     */
    finalize?: FinalizeFunc

    /**
     *
     */
    props: PropCollection

    /**
     * This functions is called after properties are present.
     */
    normalizeWikidata?: NormalizeWikidataFunc
  }

  /**
   * The name of a meta data kind, for example `person`, `group`.
   */
  export type KindName =
    'cloze' |
    'composition' |
    'cover' |
    'group' |
    'instrument' |
    'person' |
    'photo' |
    'radio' |
    'recording' |
    'reference' |
    'score' |
    'song' |
    'worksheet' |
    'youtube' |
    'general'

  /**
   * Multiple meta data type names, separated by commas, for example
   * `work,recording`. `work,recording` is equivalent to `general,work,recording`.
   */
  export type KindNames = string

  /**
   * The specification of all meta data kinds
   *
   * ```js
   * const KindSpecCollection = {
   *   typeName1: kindSpecification1,
   *   typeName2: kindSpecification2
   *   ...
   * }
   * ```
   */
  export type KindCollection = { [key in KindName]: Kind }

  /**
   * Generic type for metadata of assets.
   */
  export interface Data {
    [key: string]: any
  }

  /**
   * Used in many functions as an argument.
   */
  interface KindDataAndSpec {
    kindData: AssetType.Generic
    kindSpecification: Kind
  }
}
