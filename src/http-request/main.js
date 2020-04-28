/**
 * A wrapper around axios. Bundles configuration, selects the right
 * configuration according `window.location`. Simplfy request api.
 *
 * @module @bldr/http-request
 */

/* globals config location */

import axios from 'axios'

const restEndPoints = {
  local: {
    domain: config.http.domainLocal
  },
  remote: {
    domain: config.http.domainRemote,
    auth: {
      username: config.http.username,
      password: config.http.password
    }
  }
}

/**
 * @param {string} urlFillIn - A URL segment that is inserted between the base
 *   URL and the last part of the URL. For example `baseURL`: `localhost`
 *   `urlFillIn`: `/api/media`.
 */
export class HttpRequest {
  constructor (urlFillIn) {
    /**
     * A URL segment that is inserted between the base URL and the last part of
     * the URL. For example `baseURL`: `localhost` `urlFillIn`: `/api/media`.
     *
     * @type {String}
     */
    this.urlFillIn = urlFillIn

    /**
     * The base URL of the REST endpoint.
     *
     * @type {String}
     */
    this.baseUrl = null

    if (location.hostname === 'localhost') {
      this.baseUrl = `${location.protocol}//${restEndPoints.local.domain}`
    } else {
      this.baseUrl = `${location.protocol}//${restEndPoints.remote.domain}`
    }

    const axiosConfig = {
      baseURL: this.baseUrl,
      timeout: 10000,
      crossDomain: true
    }

    /**
     * An Axios instance.
     *
     * @see {@link https://github.com/axios/axios#axioscreateconfig}
     *
     * @type {Object}
     */
    this.axiosInstance_ = axios.create(axiosConfig)
  }

  /**
   * @param {String} url
   *
   * @returns {String}
   */
  formatUrl (url) {
    if (this.urlFillIn && url.substr(0, 1) !== '/') {
      return `${this.urlFillIn}/${url}`
    }
    return url
  }

  /**
   * Wrapper around axios.request. See axios.request
   *
   * <pre><code>
   * {
   *   method: 'get',
   *   url: 'data/entry'
   * }
   * </code></pre>
   *
   * @param {object} config
   */
  request (config) {
    if (typeof config === 'string') {
      config = { method: 'get', url: config }
    }
    if (!('method' in config)) {
      config.method = 'get'
    }
    config.url = this.formatUrl(config.url)
    return this.axiosInstance_.request(config)
  }
}
