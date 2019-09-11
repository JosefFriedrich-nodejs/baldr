
import Vue from 'vue'
import Vuex from 'vuex'
import { parseContentFile } from '@/content-file.js'
import { request } from '@/media.js'

Vue.use(Vuex)

const state = {
  media: {},
  mediaDevices: [],
  restApiServers: [],
  shortcuts: {},
  slideNoCurrent: null,
  slides: {}
}

const getters = {
  media: state => {
    return state.media
  },
  isMedia: (state, getters) => {
    return Object.keys(getters.media).length > 0
  },
  mediaDevices: state => {
    return state.mediaDevices
  },
  mediaDevicesDynamicSelect: (state, getters) => {
    const resultList = []
    for (const device of getters.mediaDevices) {
      if (device.kind === 'videoinput') {
        let label
        if (device.label) {
          label = device.label
        } else {
          label = `${device.kind} (${device.deviceId})`
        }
        resultList.push({
          id: device.deviceId,
          name: label
        })
      }
    }
    return resultList
  },
  restApiServers: state => {
    return state.restApiServers
  },
  slideNoCurrent: state => {
    return state.slideNoCurrent
  },
  slideCurrent: state => {
    if (state.slideNoCurrent) {
      return state.slides[state.slideNoCurrent]
    }
  },
  slides: state => {
    return state.slides
  },
  slidesCount: (state, getters) => {
    return Object.keys(getters.slides).length
  },
  shortcuts: (state) => {
    return state.shortcuts
  }
}

const actions = {
  async setMediaDevices ({ commit }) {
    commit('setMediaDevices', await navigator.mediaDevices.enumerateDevices())
  },
  openPresentation ({ commit }, content) {
    const contentFile = parseContentFile(content)
    commit('setSlides', contentFile.slides)
    commit('setSlideNoCurrent', 1)
  },
  setSlideNext ({ commit, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.slidesCount
    if (no === count) {
      commit('setSlideNoCurrent', 1)
    } else {
      commit('setSlideNoCurrent', no + 1)
    }
  },
  setSlidePrevious ({ commit, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.slidesCount
    if (no === 1) {
      commit('setSlideNoCurrent', count)
    } else {
      commit('setSlideNoCurrent', no - 1)
    }
  },
  setStepNext ({ commit, getters }) {
    let stepNoCurrent
    const slideCurrent = getters.slideCurrent
    const no = slideCurrent.master.stepNoCurrent
    const count = slideCurrent.master.stepCount
    if (no === count) {
      stepNoCurrent = 1
    } else {
      stepNoCurrent = no + 1
    }
    commit('setStepNoCurrent', { slideCurrent, stepNoCurrent })
  },
  setStepPrevious ({ commit, getters }) {
    let stepNoCurrent
    const slideCurrent = getters.slideCurrent
    const no = slideCurrent.master.stepNoCurrent
    const count = slideCurrent.master.stepCount
    if (no === 1) {
      stepNoCurrent = count
    } else {
      stepNoCurrent = no - 1
    }
    commit('setStepNoCurrent', { slideCurrent, stepNoCurrent })
  },
  async setRestApiServers ({ commit }) {
    const servers = await request.getServers()
    commit('setRestApiServers', servers)
  }
}

const mutations = {
  setMediaDevices (state, mediaDevices) {
    state.mediaDevices = mediaDevices
  },
  setSlides (state, slides) {
    Vue.set(state, 'slides', slides)
  },
  setSlideNoCurrent (state, slideNoCurrent) {
    state.slideNoCurrent = parseInt(slideNoCurrent)
  },
  setStepNoCurrent (state, { slideCurrent, stepNoCurrent }) {
    slideCurrent.master.stepNoCurrent = stepNoCurrent
  },
  addMediumData (state, mediumData) {
    Vue.set(state.media, mediumData.URI, mediumData)
  },
  addShortcut (state, shortcut) {
    Vue.set(state.shortcuts, shortcut.keys, shortcut)
  },
  removeShortcut (state, keys) {
    Vue.delete(state.shortcuts, keys)
  },
  setRestApiServers (state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
