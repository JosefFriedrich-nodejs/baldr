// Node packages.
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

// Project packages.
import config from '@bldr/config'
import { locationIndicator } from '@bldr/media-manager'
import { openWith, openWithFileManager } from '@bldr/open-with'
import type { StringIndexedObject } from '@bldr/type-definitions'

import { database } from './main'

/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param mediaType - At the moment `assets` and `presentation`
 */
export function validateMediaType (mediaType: string): string {
  const mediaTypes = ['assets', 'presentations']
  if (!mediaType) return 'assets'
  if (!mediaTypes.includes(mediaType)) {
    throw new Error(`Unkown media type “${mediaType}”! Allowed media types are: ${mediaTypes}`)
  } else {
    return mediaType
  }
}

/**
 * Resolve a ID from a given media type (`assets`, `presentations`) to a
 * absolute path.
 *
 * @param id - The id of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
async function getAbsPathFromId (id: string, mediaType: string = 'presentations'): Promise<string> {
  mediaType = validateMediaType(mediaType)
  const result = await database.db.collection(mediaType).find({ id: id }).next()
  if (!result) throw new Error(`Can not find media file with the type “${mediaType}” and the id “${id}”.`)
  let relPath
  if (mediaType === 'assets') {
    relPath = `${result.path}.yml`
  } else {
    relPath = result.path
  }
  return path.join(config.mediaServer.basePath, relPath)
}

/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param {String} currentPath
 * @param {Boolean} create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function openWithFileManagerWithArchives (currentPath: string, create: boolean): StringIndexedObject {
  const result: StringIndexedObject = {}
  const relPath = locationIndicator.getRelPath(currentPath)
  for (const basePath of locationIndicator.get()) {
    if (relPath) {
      const currentPath = path.join(basePath, relPath)
      result[currentPath] = openWithFileManager(currentPath, create)
    } else {
      result[basePath] = openWithFileManager(basePath, create)
    }
  }
  return result
}

/**
 * Mirror the folder structure of the media folder into the archive folder or
 * vice versa. Only folders with two prefixed numbers followed by an
 * underscore (for example “10_”) are mirrored.
 *
 * @param {String} currentPath - Must be a relative path within one of the
 *   folder structures.
 *
 * @returns {Object} - Status informations of the action.
 */
function mirrorFolderStructure (currentPath: string): StringIndexedObject {
  function walkSync (dir: string, fileList?: string[]): string[] {
    const files = fs.readdirSync(dir)
    if (!fileList) fileList = []
    files.forEach(function (file) {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory() && file.match(/^\d\d_/)) {
        if (fileList) fileList.push(filePath)
        walkSync(filePath, fileList)
      }
    })
    return fileList
  }

  const currentBasePath = locationIndicator.getBasePath(currentPath)

  let mirrorBasePath: string = ''
  for (const basePath of locationIndicator.get()) {
    if (basePath !== currentBasePath) {
      mirrorBasePath = basePath
      break
    }
  }

  const relPaths = walkSync(currentPath)
  for (let index = 0; index < relPaths.length; index++) {
    const relPath = locationIndicator.getRelPath(relPaths[index])
    if (relPath !== undefined) relPaths[index] = relPath
  }

  const created = []
  const existing = []
  for (const relPath of relPaths) {
    const newPath = path.join(mirrorBasePath, relPath)
    if (!fs.existsSync(newPath)) {
      try {
        fs.mkdirSync(newPath, { recursive: true })
      } catch (error) {
        return {
          error
        }
      }
      created.push(relPath)
    } else {
      existing.push(relPath)
    }
  }
  return {
    ok: {
      currentBasePath,
      mirrorBasePath,
      created,
      existing
    }
  }
}

/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param id - The id of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export async function openEditor (id: string, mediaType: string): Promise<StringIndexedObject> {
  const absPath = await getAbsPathFromId(id, mediaType)
  const parentFolder = path.dirname(absPath)
  const editor = config.mediaServer.editor
  if (!fs.existsSync(editor)) {
    return {
      error: `Editor “${editor}” can’t be found.`
    }
  }
  openWith(config.mediaServer.editor, parentFolder)
  return {
    id,
    mediaType,
    absPath,
    parentFolder,
    editor
  }
}

/**
 * Open the parent folder of a presentation, a media asset in a file explorer
 * GUI application.
 *
 * @param id - The id of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 * @param archive - Addtionaly open the corresponding archive
 *   folder.
 * @param create - Create the directory structure of
 *   the relative path in the archive in a recursive manner.
 */
export async function openParentFolder (id: string, mediaType: string, archive: boolean, create: boolean): Promise<StringIndexedObject> {
  const absPath = await getAbsPathFromId(id, mediaType)
  const parentFolder = path.dirname(absPath)

  let result: StringIndexedObject
  if (archive) {
    result = openWithFileManagerWithArchives(parentFolder, create)
  } else {
    result = openWithFileManager(parentFolder, create)
  }
  return {
    id,
    parentFolder,
    mediaType,
    archive,
    create,
    result
  }
}
