/**
 * @module @bldr/media-server/database
 */

const mongodb = require('mongodb')

// Project packages.
const { bootstrapConfig } = require('@bldr/core-node')

/**
 * The configuration object from `/etc/baldr.json`
 */
const config = bootstrapConfig()

/**
 * A wrapper around MongoDB.
 */
class Database {
  constructor () {
    const conf = config.databases.mongodb
    const user = encodeURIComponent(conf.user)
    const password = encodeURIComponent(conf.password)
    const authMechanism = 'DEFAULT'
    const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`

    /**
     * @type {Object}
     */
    this.schema = {
      assets: {
        indexes: [
          { field: 'path', unique: true },
          { field: 'id', unique: true },
          { field: 'uuid', unique: true }
        ]
      },
      presentations: {
        indexes: [
          { field: 'id', unique: true }
        ]
      },
      updates: {
        indexes: [
          { field: 'begin', unique: false }
        ]
      },
      seatingPlan: {
        indexes: [
          { timeStampMsec: 'path', unique: true }
        ]
      }
    }

    /**
     * @type {mongodb.MongoClient}
     * @private
     */
    this.mongoClient_ = new mongodb.MongoClient(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )

    /**
     * @type {mongodb.Db}
     */
    this.db = null
  }

  /**
   * @return {Promise}
   */
  async connect () {
    if (!this.db) {
      await this.mongoClient_.connect()
      this.db = this.mongoClient_.db(config.databases.mongodb.dbName)
    }
  }

  /**
   * List all collection names in an array.
   *
   * @returns {Promise.<Array>} An array of collection names.
   */
  async listCollectionNames () {
    const collections = await this.db.listCollections().toArray()
    const names = []
    for (const collection of collections) {
      names.push(collection.name)
    }
    return names
  }

  /**
   * Create the collections with indexes.
   *
   * @returns {Promise.<Object>}
   */
  async initialize () {
    let collections = await this.listCollectionNames()

    // https://stackoverflow.com/a/35868933
    for (const collectionName in this.schema) {
      if (!collections.includes(collectionName)) {
        const collection = await this.db.createCollection(collectionName)
        for (const schema of this.schema[collectionName]) {
          const index = schema.index
          await collection.createIndex({ [index.field]: 1 }, { unique: index.unique })
        }
      }
    }

    const result = {}
    collections = await this.db.listCollections().toArray()
    for (const collection of collections) {
      const indexes = await this.db.collection(collection.name).listIndexes().toArray()
      result[collection.name] = {
        name: collection.name,
        indexes: {}
      }
      for (const index of indexes) {
        result[collection.name].indexes[index.name] = index.unique
      }
    }
    return result
  }

  /**
   * Drop all collections.
   *
   * @returns {Promise.<Object>}
   */
  async drop () {
    const collections = await this.db.listCollections().toArray()
    const droppedCollections = []
    for (const collection of collections) {
      await this.db.dropCollection(collection.name)
      droppedCollections.push(collection.name)
    }
    return {
      droppedCollections
    }
  }

  /**
   * Re-Initialize the MongoDB database (Drop all collections and initialize).
   *
   * @returns {Promise.<Object>}
   */
  async reInitialize () {
    const resultdropDb = await this.drop()
    const resultInitializeDb = await this.initialize()
    return {
      resultdropDb,
      resultInitializeDb
    }
  }

  /**
   * Delete all media files (assets, presentations) from the database.
   *
   * @returns {Promise.<Object>}
   */
  async flushMediaFiles () {
    const countAssets = await this.assets.countDocuments()
    const countPresentations = await this.presentations.countDocuments()
    await this.db.collection('assets').deleteMany({})
    await this.db.collection('presentations').deleteMany({})
    return {
      countAssets, countPresentations
    }
  }

  get assets () {
    return this.db.collection('assets')
  }

  get presentations () {
    return this.db.collection('presentations')
  }

  get updates () {
    return this.db.collection('updates')
  }

  get folderTitleTree () {
    return this.db.collection('folderTitleTree')
  }

  get seatingPlan () {
    return this.db.collection('seatingPlan')
  }
}

module.exports = {
  Database
}
