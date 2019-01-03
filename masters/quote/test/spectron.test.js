const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Master slide “quote”: “example.baldr” #spectron', function () {
  this.timeout(40000)

  beforeEach(function () {
    this.spectron = new Spectron('@bldr/electron-app', 'masters/quote/example.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it('Text on the example slides', function () {
    return this.app.client
      .getText('.text')
      .then(text => { assert.equal(text, '» No date «') })

      .click('#nav-slide-next')
      .getText('.text')
      .then(text => { assert.equal(text, '» No author «') })

      .click('#nav-slide-next')
      .getText('.text')
      .then(text => { assert.equal(text, '» All values «') })

      .click('#nav-slide-next')
      .getText('.text')
      .then(text => { assert.equal(text, '» only text «') })

      .click('#nav-slide-next')
      .getText('.text')
      .then(text => { assert.equal(text, '» Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift. «') })
  })
})