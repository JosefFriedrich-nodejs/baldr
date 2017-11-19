const {
  assert,
  document,
  path,
  presentation,
  masters,
  getDOM
} = require('baldr-test');

const {Master} = require('../index.js')(document, masters, presentation);

let propObj = {
  masterName: 'markdown',
  masterPath: path.resolve(__dirname, '..'),
  document: document,
  presentation: presentation
};

let getMarkdown = function(data) {
  propObj.data = data;
  return new Master(propObj);
};

describe('Master slide “markdown”: unit tests', () => {

  it('heading', () => {
    let markdown = getMarkdown(`
# Heading 1

## Heading 2

### Heading 3`);
    markdown.set();
    let dom = getDOM(markdown.elemSlide.innerHTML);
    assert.equal(dom.querySelector('h1').textContent, 'Heading 1');
    assert.equal(dom.querySelector('h2').textContent, 'Heading 2');
    assert.equal(dom.querySelector('h3').textContent, 'Heading 3');
  });

  it('list', () => {
    let markdown = getMarkdown(`
* one
* two
* three`);
    markdown.set();
    let dom = getDOM(markdown.elemSlide.innerHTML);
    assert.equal(dom.querySelector('ul li:nth-child(1)').textContent, 'one');
    assert.equal(dom.querySelector('ul li:nth-child(2)').textContent, 'two');
    assert.equal(dom.querySelector('ul li:nth-child(3)').textContent, 'three');
  });

});
