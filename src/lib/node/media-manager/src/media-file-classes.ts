// Node packages.
import path from 'path'

import { AssetType } from '@bldr/type-definitions'
import { MediaCategoriesManager, getExtension } from '@bldr/core-browser'
import config from '@bldr/config'

import { readAssetYaml } from './main'

/**
 * Base class for the asset and presentation class.
 */
class MediaFile {
  /**
   * The absolute path of the file.
   */
  protected absPath: string
  /**
   * @param filePath - The file path of the media file.
   */
  constructor (filePath: string) {
    this.absPath = path.resolve(filePath)
  }

  /**
   * The file extension of the media file.
   */
  get extension(): string | undefined {
    return getExtension(this.absPath)
  }
  /**
   * The basename (filename without extension) of the file.
   */
  get basename(): string {
    return path.basename(this.absPath, `.${this.extension}`)
  }
}

/**
 * A media asset.
 */
export class Asset extends MediaFile {
  private metaData: AssetType.FileFormat | undefined
  /**
   * @param filePath - The file path of the media asset.
   */
  constructor (filePath: string) {
    super(filePath)
    const data = readAssetYaml(this.absPath)
    if (data) {
      this.metaData = <AssetType.FileFormat> data
    }
  }

  /**
   * The id of the media asset. Read from the metadata file.
   */
  get id(): string | undefined {
    if (this.metaData && this.metaData.id) {
      return this.metaData.id
    }
  }

  /**
   * The media category (`image`, `audio`, `video`, `document`)
   */
  get mediaCategory (): string | undefined {
    if (this.extension) {
      return mediaCategoriesManager.extensionToType(this.extension)
    }
  }
}

/**
 * Make a media asset from a file path.
 *
 * @param filePath - The file path of the media asset.
 */
export function makeAsset (filePath: string): Asset {
  return new Asset(filePath)
}

export const mediaCategoriesManager = new MediaCategoriesManager(config)

/**
 * @param filePath - The file path of the media asset.
 */
export function filePathToAssetType (filePath: string): string | undefined {
  const asset = makeAsset(filePath)
  if (asset.extension)
  return mediaCategoriesManager.extensionToType(asset.extension)
}

/**
 * Check if the given file is a media asset.
 *
 * @param filePath - The path of the file to check.
 */
export function isAsset (filePath: string): boolean {
  if (
    filePath.indexOf('eps-converted-to.pdf') > -1 || // eps converted into pdf by TeX
    filePath.indexOf('_preview.jpg') > -1 || // Preview image
    filePath.match(/_no\d+\./) // Multipart asset
  ) {
    return false
  }
  if (filePath.match(new RegExp('^.*/TX/.*.pdf$'))) return true
  return mediaCategoriesManager.isAsset(filePath)
}

/**
 * Check if the given file is a presentation.
 *
 * @param filePath - The path of the file to check.
 */
export function isPresentation (filePath: string): boolean {
  if (filePath.indexOf('Praesentation.baldr.yml') > -1) {
    return true
  }
  return false
}
