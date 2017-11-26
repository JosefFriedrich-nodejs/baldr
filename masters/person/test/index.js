const {
  assert,
  path,
  cloneConfig,
  makeDOM
} = require('baldr-test');

const person = require('../index.js');

let config = cloneConfig();
config.sessionDir = path.resolve(__dirname, '..');

let render = function(data) {
  let slide = {};
  slide.normalizedData = data;
  return person.mainHTML(slide, config);
};

describe('Master slide “person”: unit tests', () => {

  it('function “hookSetHTMLSlide()”', () => {

    let html = render({
      name: 'Ludwig van Beethoven',
      image: 'beethoven.jpg'
    });

    let doc = makeDOM(html);
    assert.equal(
      doc.querySelector('#info-box p').textContent,
      'Ludwig van Beethoven'
    );

    assert.equal(
      doc.querySelector('img').getAttribute('src'),
      path.resolve(__dirname, '..', 'beethoven.jpg')
    );

  });

});
