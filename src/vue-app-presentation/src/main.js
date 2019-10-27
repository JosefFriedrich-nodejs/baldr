/**
 * The main app of the BALDR project: a presentation app using YAML files.
 *
 * ```js
 * function mounted () {
 *  this.$styleConfig.setDefault()
 *
 *  // Set presentation app to fullscreen:
 *   this.$fullscreen()
 *
 *   // vue-notifications
 *   this.$notify({
 *     group: 'foo',
 *     title: 'Important message',
 *     text: 'Hello user! This is a notification!'
 *   })
 * }
 * ```
 *
 * @module @bldr/vue-app-presentation
 */

import Vue from 'vue'
import { registerMasterComponents, masters } from '@/masters.js'

// Vue plugins.
import router from '@/router.js'
import store from '@/store.js'
import notifications from 'vue-notification'
import shortcuts from '@bldr/vue-plugin-shortcuts'
import MaterialIcon from '@bldr/vue-plugin-material-icon'
import ModalDialog from '@bldr/vue-plugin-modal-dialog'
import DynamicSelect from '@bldr/vue-plugin-dynamic-select'
import media from '@bldr/vue-plugin-media'

// Vue components.
import MainApp from '@/MainApp.vue'

Vue.use(shortcuts, router, store)
Vue.use(media, router, store, Vue.prototype.$shortcuts)
Vue.use(notifications)

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.config.productionTip = false

/**
 * A `Vue` `props` object.
 *
 * ```js
 * createElement('example-master', { props: props })
 * ```
 *
 * @typedef props
 * @type {Object}
 */

/******************************************************************************/

/**
 * Set multiple attributes at the same time
 */
class MultipleAttributes {

  constructor () {
    this.attributeName = ''
  }

  set (value) {
    const elements = document.querySelectorAll(`[${this.attributeName}]`)
    for (const element of elements) {
      element.attributes[this.attributeName].value = value
    }
  }
}

/**
 *
 */
class BodyAttributes {
  constructor () {
    this.attributeName = ''
    this.state = false
    this.bodyEl_ = document.querySelector('body')
  }

  toggle () {
    this.set(!this.state)
  }

  set (state = false) {
    this.bodyEl_.setAttribute(this.attributeName, state)
    this.state = state
  }
}

/**
 *
 */
class CenterVertically extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-center-vertically'
    this.state = true
  }
}

/**
 *
 */
class DarkMode extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-dark-mode'
    this.state = false
  }
}

/**
 *
 */
class Overflow extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-overflow'
    this.state = true
  }
}

/**
 *
 */
class ContentTheme extends MultipleAttributes {
  constructor () {
    super()
    this.attributeName = 'b-content-theme'
  }
}

/**
 *
 */
class UiTheme extends MultipleAttributes {
  constructor () {
    super()
    this.attributeName = 'b-ui-theme'
  }
}

/**
 * @typedef styleConfig
 * @type {object}
 * @property {styleConfig.centerVertically}
 * @property {styleConfig.darkMode}
 * @property {styleConfig.overflow}
 * @property {styleConfig.contentTheme}
 * @property {styleConfig.uiTheme}
 */

/**
 *
 */
class StyleConfig {
  constructor () {
    this.configObjects = {
      centerVertically: new CenterVertically(),
      darkMode: new DarkMode(),
      overflow: new Overflow(),
      contentTheme: new ContentTheme(),
      uiTheme: new UiTheme()
    }
  }

  defaults_ () {
    return {
      centerVertically: true,
      darkMode: false,
      overflow: false,
      contentTheme: 'default',
      uiTheme: 'default'
    }
  }

  setDefaults () {
    this.set_(this.defaults_())
  }

  set_ (styleConfig) {
    for (const config in styleConfig) {
      if (config in this.configObjects) {
        this.configObjects[config].set(styleConfig[config])
      } else {
        throw new Error(`Unkown style config “${config}”.`)
      }
    }
  }

  /**
   * @param {module:@bldr/vue-app-presentation~styleConfig} styleConfig
   */
  set (styleConfig) {
    if (!styleConfig) styleConfig = {}
    this.set_(Object.assign(this.defaults_(), styleConfig))
  }
}

/**
 * $styleConfig
 * @type {module:@bldr/vue-app-presentation~StyleConfig}
 */
Vue.prototype.$styleConfig = new StyleConfig()

/******************************************************************************/

/**
 * $master
 */
Vue.prototype.$masters = masters

// https://stackoverflow.com/a/45032366/10193818
Vue.prototype.$fullscreen = function () {
  document.documentElement.requestFullscreen()
}

// Must be before new Vue()
registerMasterComponents()

store.subscribe((mutation, state) => {
  if (mutation.type === 'media/addMediaFile') {
    const mediaFile = mutation.payload
    if (mediaFile.uriScheme === 'localfile') {
      Vue.notify({
        group: 'default',
        text: `hinzugefügt: <a href="${mediaFile.routerLink}">${mediaFile.filename}</a>.`,
        duration: 5000,
        type: 'success'
      })
    }
  }
})

/**
 * Vue instance
 * @namespace Vue
 */
export default new Vue({
  router,
  store,
  render: h => h(MainApp)
}).$mount('#app')