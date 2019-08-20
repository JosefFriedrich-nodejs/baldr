const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Master slide “question”: “example.baldr” #spectron', function () {
  this.timeout(50000)

  beforeEach(function () {
    this.spectron = new Spectron('@bldr/electron-app', 'masters/question/example.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it('Text on the example slides', function () {
    return this.app.client
      .getText('li:nth-child(1) .question')
      .then(text => { assert.equal(text, 'Question one?') })

      .click('#nav-slide-next')
      .getText('.question')
      .then(text => { assert.equal(text, 'This is a question?') })
      .getCssProperty('.answer', 'visibility')
      .then(style => { assert.equal(style.value, 'hidden') })

      .click('#nav-slide-next')
      .getText('li:nth-child(1) .question')
      .then(text => { assert.equal(text, 'Question one?') })
      .getCssProperty('li:nth-child(2) .question', 'visibility')
      .then(style => { assert.equal(style.value, 'hidden') })
      .getCssProperty('li:nth-child(3) .question', 'visibility')
      .then(style => { assert.equal(style.value, 'hidden') })

      .click('#nav-slide-next')
      .getText('.question')
      .then(text => { assert.equal(text, 'One big question?') })
  })
})