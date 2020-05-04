/**
 * vuex store
 *
 * @module @bldr/lamp/store
 */

/* globals rawYamlExamples */

import Vue from 'vue'
import Vuex from 'vuex'
import { Presentation } from '@/content-file.js'
import vue, { customStore } from '@/main.js'
import nav from './nav.js'
import preview from './preview.js'
import masters from './masters.js'

Vue.use(Vuex)

const state = {
  // Highlight the cursor arrows when the presentation is navigated through
  // keyboard shortcuts
  cursorArrows: {
    up: {
      triggered: false,
      timeoutId: null
    },
    right: {
      triggered: false,
      timeoutId: null
    },
    down: {
      triggered: false,
      timeoutId: null
    },
    left: {
      triggered: false,
      timeoutId: null
    }
  },
  folderTitleTree: null,
  presentation: null,
  slideNoOld: null,
  slideNo: null,
  slides: {},
  showMetaDataOverlay: false,
  isSpeakerView: false
}

const getters = {
  cursorArrowsStates: state => {
    return state.cursorArrows
  },
  folderTitleTree: state => {
    return state.folderTitleTree
  },
  isSpeakerView: state => {
    return state.isSpeakerView
  },
  presentation: state => {
    if (state.presentation && state.presentation.slides) return state.presentation
  },
  slideNo: state => {
    return state.slideNo
  },
  slide: (state, getters) => {
    if (state.slideNo) {
      return getters.slideByNo(state.slideNo)
    }
  },
  slideNoOld: (state) => {
    return state.slideNoOld
  },
  slideOld: (state, getters) => {
    if (getters.slideNoOld) {
      return getters.slideByNo(getters.slideNoOld)
    }
  },
  slideByNo: state => no => {
    return state.slides[no - 1]
  },
  slides: (state, getters) => {
    if (state.slides.length > 0) {
      return state.slides
    }
  },
  slidesCount: (state, getters) => {
    if (!getters.slides) return
    return getters.slides.length
  },
  showMetaDataOverlay: (state) => {
    return state.showMetaDataOverlay
  },
  stepNo: (state, getters) => {
    return getters.slide.stepNo
  },
  rawYamlExamples: () => {
    return rawYamlExamples
  }
}

const actions = {
  async openPresentation ({ commit, dispatch }, { rawYamlString, mongoDbObject }) {
    const presentation = new Presentation({ rawYamlString, rawObject: mongoDbObject })
    await presentation.resolveMedia()

    commit('setPresentation', presentation)
    commit('setSlides', presentation.slides)
    // The presentation can now be entered on each slide not only the first.
    // This is possible by the routes.
    // dispatch('setSlideNoCurrent', 1)
  },
  async openPresentationById ({ dispatch }, id) {
    // Get the path
    let response = await vue.$media.httpRequest.request({
      url: 'query',
      method: 'get',
      params: {
        type: 'presentations',
        method: 'exactMatch',
        field: 'id',
        search: id
      }
    })
    if (!response.data) {
      throw new Error(`Unkown presentation with the id “${id}”`)
    }
    const mongoDbObject = response.data
    // Get yaml content as a string of the presentation.
    response = await vue.$media.httpRequest.request({
      url: `/media/${mongoDbObject.path}`,
      headers: { 'Cache-Control': 'no-cache' }
    })
    const rawYamlString = response.data
    await dispatch('openPresentation', { rawYamlString, mongoDbObject })
  },
  /**
   * Relaod the presentation and switch to the current slide (the same slide no)
   * again.
   */
  async reloadPresentation ({ dispatch, getters }) {
    const no = getters.slide.no
    const pres = getters.presentation
    if ('meta' in pres && 'id' in pres.meta) {
      await dispatch('openPresentationById', pres.meta.id)
      dispatch('setSlideNoCurrent', no)
    }
  },
  setSlideNoToOld ({ dispatch, getters }) {
    const slideNoOld = getters.slideNoOld
    if (slideNoOld) dispatch('setSlideNoCurrent', slideNoOld)
  },
  setSlideNoCurrent ({ commit, getters }, no) {
    let oldSlide
    let oldProps
    const newSlide = getters.slideByNo(no)
    const newProps = newSlide.props
    if (getters.slide) {
      oldSlide = getters.slide
      commit('setSlideNoOld', oldSlide.no)
      oldProps = oldSlide.props
      getters.slide.master.leaveSlide(
        { oldSlide, oldProps, newSlide, newProps },
        customStore.vueMasterInstanceCurrent
      )
    }

    commit('setSlideNoCurrent', no)

    newSlide.master.enterSlide(
      { oldSlide, oldProps, newSlide, newProps },
      customStore.vueMasterInstanceCurrent
    )
  },
  setStepNoCurrent ({ commit }, { slide, stepNo }) {
    const oldStepNo = slide.stepNo
    const newStepNo = stepNo
    const thisArg = customStore.vueMasterInstanceCurrent
    slide.master.leaveStep({ oldStepNo, newStepNo }, thisArg)
    commit('setStepNoCurrent', { slide, stepNo })
    slide.master.enterStep({ oldStepNo, newStepNo }, thisArg)
  },
  setSlideAndStepNoCurrent ({ dispatch, getters }, { slideNo, stepNo }) {
    if (!getters.slide || slideNo !== getters.slide.no) {
      dispatch('setSlideNoCurrent', slideNo)
    }
    if (stepNo !== getters.slide.stepNo) {
      dispatch('setStepNoCurrent', { slide: getters.slide, stepNo })
    }
  },
  async loadFolderTitleTree ({ commit, getters }) {
    if (!getters.folderTitleTree) {
      const response = await vue.$media.httpRequest.request({
        url: 'get/folder-title-tree'
      })
      commit('setFolderTitleTree', response.data)
    }
  },
  async updateFolderTitleTree ({ commit }) {
    const response = await vue.$media.httpRequest.request({
      url: 'get/folder-title-tree',
      method: 'get',
      headers: { 'Cache-Control': 'no-cache' },
      params: {
        timestamp: new Date().getTime()
      }
    })
    commit('setFolderTitleTree', response.data)
  },
  toggleMetaDataOverlay ({ commit, getters }) {
    commit('showMetaDataOverlay', !getters.showMetaDataOverlay)
  },
  highlightCursorArrow ({ commit, getters }, name) {
    const state = getters.cursorArrowsStates[name]
    if (state.triggered) return
    if (state.timeoutId) clearTimeout(state.timeoutId)
    commit('setCursorArrowTriggerState', { name, triggered: true })
    const timeoutId = setTimeout(() => {
      commit('setCursorArrowTriggerState', { name, triggered: false })
      commit('setCursorArrowTimeoutId', { name, timeoutId: null })
    }, 200)
    commit('setCursorArrowTimeoutId', { name, timeoutId })
  }
}

const mutations = {
  setFolderTitleTree (state, tree) {
    Vue.set(state, 'folderTitleTree', tree)
  },
  setSlides (state, slides) {
    Vue.set(state, 'slides', slides)
  },
  setSlideNoOld (state, slideNoOld) {
    state.slideNoOld = parseInt(slideNoOld)
  },
  setSlideNoCurrent (state, slideNo) {
    state.slideNo = parseInt(slideNo)
  },
  setStepNoCurrent (state, { slide, stepNo }) {
    slide.stepNo = stepNo
  },
  setPresentation (state, presentation) {
    Vue.set(state, 'presentation', presentation)
  },
  showMetaDataOverlay (state, showMetaDataOverlay) {
    Vue.set(state, 'showMetaDataOverlay', showMetaDataOverlay)
  },
  setCursorArrowTriggerState (state, { name, triggered }) {
    state.cursorArrows[name].triggered = triggered
  },
  setCursorArrowTimeoutId (state, { name, timeoutId }) {
    state.cursorArrows[name].timeoutId = timeoutId
  },
  setSpeakerView (state, isSpeakerView) {
    state.isSpeakerView = isSpeakerView
  }
}

export default new Vuex.Store({
  modules: {
    lamp: {
      namespaced: true,
      state,
      getters,
      actions,
      mutations,
      modules: {
        nav,
        preview,
        masters
      }
    }
  }
})
