

// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Convert multiple files.
 *
 * @param filePaths - An array of input files to convert.
 * @param cmdObj - The command object from the commander.
 */
function action (filePaths: string[], cmdObj: { [key: string]: any }) {
  walk({
    all: operations.convertAsset
  }, {
    path: filePaths,
    payload: cmdObj
  })
}

export = action
