import Vue from 'vue'

class Job {
  constructor (name, icon) {
    this.name = name
    this.icon = icon
  }
}

const state = {}

const getters = {
  jobByName: (state) => (jobName) => {
    return state[jobName]
  },
  jobIconFromName: (state, get) => (jobName) => {
    const job = get.jobByName(jobName)
    return job.icon
  },
  jobsAsArray: (state) => {
    const names = Object.keys(state)
    const jobs = []
    for (const name of names) {
      jobs.push(state[name])
    }
    return jobs
  }
}

/**
 * Naming convention:
 *
 * CRUD:
 * - create
 * - delete
 */
const actions = {
  createJob: ({ commit }, { name, icon }) => {
    const job = new Job(name, icon)
    commit('createJob', job)
  },
  deleteJob: ({ commit }, jobName) => {
    commit('deleteJob', jobName)
  }
}

/**
 * Naming convention:
 *
 * CRUD:
 * - create
 * - delete
 */
const mutations = {
  createJob: (state, job) => {
    if (!{}.hasOwnProperty.call(state, job.name)) {
      Vue.set(state, job.name, job)
    }
  },
  deleteJob: (state, jobName) => {
    Vue.delete(state, jobName)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
