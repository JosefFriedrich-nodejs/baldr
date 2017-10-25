const assert = require('assert');
const path = require('path');

const rewire = require('rewire')('../lib/slides.js');
const {Slides} = require('../lib/slides.js');

const minimal = path.join('test', 'files', 'minimal.baldr');

describe('Class “Slides()”', () => {

  it('Method “readYamlFile()”', () => {
    let slides = new Slides(minimal);
    let yml = slides.readYamlFile(minimal);
    assert.equal(yml[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(yml[1].question[0].answer, 1827);
  });

  it('Method “parseSlide()”', () => {
    let slides = new Slides(minimal);

    assert.deepEqual(
      slides.parseSlide(
        {
          "quote": {
            "text": "text",
            "author": "author",
            "date": "date"
          }
        },
        0
      ),
      {
        "no": 1,
        "master": "quote",
        "data": {
          "text": "text",
          "author": "author",
          "date": "date"
        },
        "css": true
      }
    );
  });

  it('Method “parseSlides()”', () => {
    let rawYaml = [
      {
        "quote": {
          "text": "text",
          "author": "author",
          "date": "date"
        }
      },
      {
        "question": [
          {
            "question": "question",
            "answer": "answer"
          }
        ]
      },
      {
        "person": {
          "name": "name",
          "image": "image"
        }
      }
    ];

    let result = {
      "1": {
        "no": 1,
        "master": "quote",
        "data": {
          "text": "text",
          "author": "author",
          "date": "date"
        },
        "css": true
      },
      "2": {
        "no": 2,
        "master": "question",
        "data": [
          {
            "question": "question",
            "answer": "answer"
          },

        ],
        "css": false
      },
      "3": {
        "no": 3,
        "master": "person",
        "data": {
          "name": "name",
          "image": "image"
        },
        "css": true
      }
    };

    let slides = new Slides(minimal);
    assert.deepEqual(slides.parseSlides(rawYaml), result);
  });

  it('Method “parse()”', () => {
    let result = {
      "1": {
        "no": 1,
        "master": "quote",
        "data": {
          "text": "Der Tag der Gunst ist wie der Tag der Ernte,\nman muss geschäftig sein sobald sie reift.\n",
          "author": "Johann Wolfgang von Goethe",
          "date": 1801
        },
        "css": true
      },
      "2": {
        "no": 2,
        "master": "question",
        "data": [
          {
            "question": "Wann starb Ludwig van Beethoven?",
            "answer": 1827
          }
        ],
        "css": false
      },
      "3": {
        "no": 3,
        "master": "person",
        "data": {
          "name": "Ludwig van Beethoven",
          "image": "beethoven.jpg"
        },
        "css": true
      }
    };

    let slides = new Slides(minimal);
    assert.deepEqual(slides.parse(), result);
  });

});
