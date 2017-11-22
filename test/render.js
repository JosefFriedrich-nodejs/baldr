const {
  assert,
  returnDOM
} = require('baldr-test');

let rewire;
let document;

describe('“render.js”', function() {

  beforeEach(() => {
    rewire = require('rewire')('../render.js');
    document = returnDOM();
    rewire.__set__('document', document);
  });

  it('“Function toggleModal()”', () => {
    let toggleModal = rewire.__get__('toggleModal');
    let modal = document.getElementById('modal');

    assert.equal(toggleModal(), 'block');
    assert.equal(modal.style.display, 'block');

    assert.equal(toggleModal(), 'none');
    assert.equal(modal.style.display, 'none');

    assert.equal(toggleModal(), 'block');
    assert.equal(modal.style.display, 'block');
  });

  it('Function “errorPage()”', () => {
    let errorPage = rewire.__get__('errorPage');
    let error = {
      stack: 'stack',
    };
    errorPage('message', 'source', 'lineNo', 'colNo', error);
    let getText = function(selector) {
      return document.querySelector(selector).textContent;
    };
    assert.equal(getText('#slide p:nth-child(1)'), 'message');
    assert.equal(getText('#slide p:nth-child(2)'), 'Source: source');
    assert.equal(getText('#slide p:nth-child(3)'), 'Line number: lineNo');
    assert.equal(getText('#slide p:nth-child(4)'), 'Column number: colNo');
    assert.equal(getText('#slide pre'), 'stack');
  });

  it('Function “searchForBaldrFile()”', () => {
    let search = rewire.__get__('searchForBaldrFile');

    assert.equal(
      search(['lol.baldr']),
      'lol.baldr'
    );

    assert.equal(
      search(['lol.BALDR']),
      'lol.BALDR'
    );

    assert.equal(
      search(['lil', 'lol.BALDR', 'troll']),
      'lol.BALDR'
    );

    assert.throws(function() {search(['lil', 'troll']);});

    assert.equal(
      search(['first.baldr', 'last.baldr']),
      'last.baldr'
    );
  });
});
