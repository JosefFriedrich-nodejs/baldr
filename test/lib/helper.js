const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

exports.assert = assert;
exports.fs = fs;
exports.path = path;

exports.getDOM = getDOM = function(html) {
  let d = new JSDOM(html);
  return d.window.document;
};

exports.allMasters = [
  'audio',
  'camera',
  'editor',
  'markdown',
  'person',
  'question',
  'quote',
  'svg'
];

exports.document = getDOM(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'render.html'),
    'utf8'
  )
);

exports.presentation = {
  pwd: '/home/jf/lol'
};
