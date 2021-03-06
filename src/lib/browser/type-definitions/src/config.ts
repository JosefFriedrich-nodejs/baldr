/**
 * The type of the JSON object of the file `/etc/baldr.json`
 *
 * @module @bldr/type-definitions/config
 */

interface ApiConfiguration {
  port: number
}

interface MongoDbConfiguration {
  url: string
  dbName: string
  user: string
  password: string
}

interface DatabasesConfiguration {
  mongodb: MongoDbConfiguration
}

interface DocConfiguration {
  src: string
  dest: string
  configFile: string
}

/**
 * The HTTP configuration for the media server and the REST API.
 */
interface HttpConfiguration {
  /**
   * The username is only required for remote connections.
   */
  username: string

  /**
   * The password is only required for remote connections.
   */
  password: string

  /**
   * The local domain without `http://`, for example `localhost`.
   */
  domainLocal: string

  /**
   * The remote domain without `https://`, for example `baldr.friedrich.rocks`.
   */
  domainRemote: string

  /**
   * The base directory for content thats delivered over HTTP, for example
   * `/var/www/baldr`.
   */
  webRoot: string

  /**
   * `www-data` on Debian based systems.
   */
  webServerUser: string

  /**
   * `www-data` on Debian based systems.
   */
  webServerGroup: string
}

/**
 * ```json
 * {
 *   "text-box-multiple-outline": {
 *     "newName": "multi-part",
 *     "description": "multipart assets"
 *   },
 *   "cloud-download": {
 *      "description": "Master slide youtube for download (cached) video file with an asset."
 *   }
 * }
 * ```
 */
export interface IconDefintion {
  newName?: string
  description?: string
}

/**
 * ```json
 * {
 *   "file-tree": "tree",
 *   "trumpet": "",
 *   "text-box-multiple-outline": {
 *     "newName": "multi-part",
 *     "description": "multipart assets"
 *   },
 *   "cloud-download": {
 *      "description": "Master slide youtube for download (cached) video file with an asset."
 *   }
 * }
 * ```
 */
export interface IconFontMapping {
  [key: string]: string | IconDefintion
}

export interface IconFontConfiguration {
  /**
   * `"https://raw.github...svg/{icon}.svg"`
   */
  urlTemplate?: string

  /**
   * ```json
   * {
   *   "file-tree": "tree",
   *   "trumpet": "",
   *   "text-box-multiple-outline": {
   *     "newName": "multi-part",
   *     "description": "multipart assets"
   *   },
   *   "cloud-download": {
   *      "description": "Master slide youtube for download (cached) video file with an asset."
   *   }
   * }
   * ```
   */
  iconMapping: IconFontMapping

  /**
   * A path of a local folder containing SVGs to build an icon font from.
   */
  folder?: string
}

interface AssetType {
  allowedExtensions: string[]
  targetExtension: string
  color: string
}

interface AssetTypes {
  [key: string]: AssetType
}

interface MediaServerConfiguration {
  basePath: string
  archivePaths: string[]
  sshAliasRemote: string
  editor: string
  fileManager: string
  assetTypes: AssetTypes
}

interface SongbookConfiguration {
  path: string
  projectorPath: string
  pianoPath: string
  vueAppPath: string
}

interface WireConfiguration {
  port: number
  localUri: string
}

interface YoutubeConfiguration {
  /**
   * The API key to access the JSON api (use by the youtube downloader)
   */
  apiKey: string
}

/**
 * The type defintions of the main configuration file of the Baldr
 * project.
 */
export interface Configuration {
  api: ApiConfiguration
  databases: DatabasesConfiguration
  doc: DocConfiguration
  http: HttpConfiguration
  iconFont: IconFontConfiguration

  /**
   * The path of the local development repository, for example
   * `/home/jf/git-repositories/github/Josef-Friedrich/baldr`.
   */
  localRepo: string
  mediaServer: MediaServerConfiguration
  songbook: SongbookConfiguration
  wire: WireConfiguration
  youtube: YoutubeConfiguration
}
