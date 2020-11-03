/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions
 */

export * from './asset'
export * from './cli'
export * from './config'
export * from './meta-spec'
export * from './presentation'
export * from './titles'

export type StringIndexedObject = { [key: string]: any }

export type StringIndexedStringObject = { [key: string]: string }
