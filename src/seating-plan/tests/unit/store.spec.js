/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'
import { Person } from '../../src/store/modules/grades'

describe('Vuex global store #unittest', () => {
  beforeEach(() => {
    store.dispatch('createTestData')
    store.commit('setCurrentGrade', '1a')
  })

  afterEach(() => flushState())

  describe('getters', () => {
    it('person', () => {
      const person = store.getters.person({ firstName: 'Josef', lastName: 'Friedrich', grade: '1a' })
      assert.strictEqual(person.firstName, 'Josef')
    })

    it('personById', () => {
      const person = store.getters.personById('1a: Friedrich, Josef')
      assert.strictEqual(person.firstName, 'Josef')
    })

    it('personsByGrade: 1a', () => {
      const persons = store.getters.personsByGrade('1a')
      assert.strictEqual(persons['Friedrich, Josef'].firstName, 'Josef')
    })

    it('personsByGrade: 1b', () => {
      const persons = store.getters.personsByGrade('1b')
      assert.strictEqual(Object.keys(persons).length, 7)
    })

    it('personsByCurrentGrade', () => {
      const persons = store.getters.personsByCurrentGrade
      assert.strictEqual(Object.keys(persons).length, 1)
      assert.strictEqual(persons['Friedrich, Josef'].firstName, 'Josef')
    })

    it('getJobsOfPerson', () => {
      const person = store.getters.personById('1a: Friedrich, Josef')

      // Lüftwart
      store.dispatch('addPersonToJob', {
        personId: '1a: Friedrich, Josef',
        jobName: 'Lüftwart'
      })
      assert.deepEqual(store.getters.jobsOfPerson(person), ['Lüftwart'])

      // Schaltwart
      store.dispatch('addPersonToJob', {
        personId: '1a: Friedrich, Josef',
        jobName: 'Schaltwart'
      })
      assert.deepEqual(
        store.getters.jobsOfPerson(person),
        ['Lüftwart', 'Schaltwart']
      )
    })

    it('personsByGrade', function () {
      const persons = store.getters.personsByGrade('1a')
      assert.strictEqual(persons['Friedrich, Josef'].firstName, 'Josef')
    })

    it('currentPersonsCount: 1a', function () {
      store.commit('setCurrentGrade', '1a')
      assert.strictEqual(store.getters.currentPersonsCount, 1)
    })

    it('currentPersonsCount: Q11', function () {
      store.commit('setCurrentGrade', 'Q11')
      assert.strictEqual(store.getters.currentPersonsCount, 16)
    })

    it('personsPlacedCount', function () {
      assert.strictEqual(store.getters.personsPlacedCount('1a'), 0)
    })

    it('personsPlacedCount: Place one', function () {
      store.dispatch('placePersonById', {
        seatNo: 1,
        personId: '1a: Friedrich, Josef'
      })
      assert.strictEqual(store.getters.personsPlacedCount('1a'), 1)
    })

    it('isGradePlacedCurrent', function () {
      assert.isFalse(store.getters.isGradePlacedCurrent)
      store.dispatch('placePersonById', {
        seatNo: 1,
        personId: '1a: Friedrich, Josef'
      })
      assert.isTrue(store.getters.isGradePlacedCurrent)
    })

    it('jobsOfGrade', function () {
      const personId = '1a: Friedrich, Josef'
      store.dispatch('addPersonToJob', {
        personId,
        jobName: 'Lüftwart'
      })
      const jobs = store.getters.jobsOfGrade('1a')
      assert.strictEqual(jobs['Lüftwart']['Friedrich, Josef'].firstName, 'Josef')
    })
  })

  describe('actions', function () {
    it('addPerson', function () {
      const person = new Person('Max', 'Mustermann', '1x')
      store.dispatch('addPerson', person)
      const personById = store.getters.personById('1x: Mustermann, Max')
      assert.strictEqual(personById.firstName, 'Max')
      const grade = store.getters.grade(person.grade)
      assert.strictEqual(grade.name, '1x')
      const persons = store.getters.personsByGrade(person.grade)
      assert.strictEqual(Object.keys(persons).length, 1)
      // personsCount is 1
      assert.strictEqual(store.getters.personsCount('1x'), 1)
    })

    it('addPerson: trim support', function () {
      store.dispatch('addPerson', { firstName: 'Max ', lastName: ' Mustermann', grade: ' 1x ' })
      const person = store.getters.personById('1x: Mustermann, Max')
      assert.strictEqual(person.firstName, 'Max')
      assert.strictEqual(person.lastName, 'Mustermann')
      assert.strictEqual(person.grade, '1x')
    })

    it('deletePerson', function () {
      const person = new Person('Max', 'Mustermann', '1x')
      store.dispatch('addPerson', person)
      store.commit('setCurrentGrade', person.grade)
      store.dispatch('placePersonById', {
        seatNo: 1,
        personId: '1x: Mustermann, Max'
      })
      store.dispatch('addPersonToJob', {
        personId: '1x: Mustermann, Max',
        jobName: 'Lüftwart'
      })

      // Delete
      store.dispatch('deletePerson', person)
      // personsCount is 0
      assert.strictEqual(store.getters.personsCount('1x'), 0)
      // personsPlacedCount is 0
      assert.strictEqual(store.getters.currentPersonsPlacedCount, 0)
      // Grade is empty
      const persons = store.getters.personsByGrade(person.grade)
      assert.strictEqual(Object.keys(persons).length, 0)
    })

    it('placePersonById', function () {
      const personId = '1a: Friedrich, Josef'
      store.dispatch('placePersonById', {
        seatNo: 1,
        personId
      })
      const person = store.getters.personById(personId)
      assert.strictEqual(person.seatNo, 1)
    })

    it('addPersonToJob', function () {
      const personId = '1a: Friedrich, Josef'
      store.dispatch('addPersonToJob', {
        personId,
        jobName: 'Lüftwart'
      })
      const person = store.getters.personById(personId)
      const jobs = store.getters.jobsOfPerson(person)
      assert.deepStrictEqual(jobs, ['Lüftwart'])
    })

    it('addGrade', function () {
      store.dispatch('addGrade', '1x')
      assert.strictEqual(store.state.grades['1x'].name, '1x')
    })

    it('deleteGrade', function () {
      store.dispatch('deleteGrade', '1a')
      assert.isFalse({}.hasOwnProperty.call(store.state.grades, '1a'))
    })

    it('deleteGrade: without persons', function () {
      store.dispatch('addGrade', '1x')
      store.dispatch('deleteGrade', '1x')
      assert.isFalse({}.hasOwnProperty.call(store.state.grades, '1x'))
    })

    it('removePersonFromJob', function () {
      const personId = '1a: Friedrich, Josef'
      const jobName = 'Lüftwart'
      store.dispatch('addPersonToJob', { personId, jobName })
      store.dispatch('removePersonFromJob', { personId, jobName })
      const person = store.getters.personById(personId)
      const jobs = store.getters.jobsOfPerson(person)
      assert.deepEqual(jobs, [])
    })
  })

  describe('flushState', () => {
    it('app', () => {
      store.dispatch('showModal')
      assert.strictEqual(store.state.app.showModal, true)
      flushState()
      assert.strictEqual(store.state.app.showModal, false)
    })

    it('jobs', () => {
      assert.strictEqual(store.getters.listJobs.length, 5)
      flushState()
      assert.strictEqual(store.getters.listJobs.length, 0)
    })

    it('seats', () => {
      flushState()
      assert.strictEqual(store.state.seats.count, 32)
    })
  })
})
