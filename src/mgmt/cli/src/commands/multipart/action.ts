// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'
import glob from 'glob'

// Project packages.
import { formatMultiPartAssetFileName } from '@bldr/core-browser'
import { writeMetaDataYaml, operations } from '@bldr/media-manager'

/**
 * Rename multipart assets. Example “b mp "*.jpg" Systeme”
 *
 * @param globPattern - For example `*.jpg`
 * @param prefix - For example `Systeme`
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (globPattern: string, prefix: string, cmdObj: { [key: string]: any }): Promise<void> {
  const files = glob.sync(globPattern)
  if (files.length < 1) {
    console.log('Glob matches no files.')
    return
  }
  files.sort()

  let no = 1
  const extension = files[0].split('.').pop()
  const firstNewFileName = `${prefix}.${extension}`
  for (const oldFileName of files) {
    // Omit already existent info file by the renaming.
    if (!oldFileName.match(/yml$/i)) {
      const newFileName = formatMultiPartAssetFileName(`${prefix}.${extension}`, no)
      console.log(`${chalk.yellow(oldFileName)} -> ${chalk.green(newFileName)}`)
      if (!cmdObj.dryRun) fs.renameSync(oldFileName, newFileName)
      no += 1
    }
  }

  if (fs.existsSync(firstNewFileName) && !cmdObj.dryRun) {
    writeMetaDataYaml(firstNewFileName)
    await operations.normalizeMediaAsset(firstNewFileName, { wikidata: false })
  }
}

module.exports = action
