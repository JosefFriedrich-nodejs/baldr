#! /usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
var commander = require('commander');

/*
if (fs.existsSync('./index.js')) {
  var slu = require('./index.js');
} else {
  var slu = require('songbook-library-update');
}*/

try {
  var slu = require('songbook-library-update');
} catch (e) {
  if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
  }
}

try {
  var slu = require('./index.js');
  console.log('Using ./index.js')
} catch (e) {}

commander
  .version('0.0.5')
  .option('-f, --force', 'rebuild all images')
  .option('-j, --json', 'generate JSON file')
  .option('-t, --tex', 'generate TeX file')
  .option('-T, --test', 'switch to test mode')
  .parse(process.argv);



if (commander.force) {
  slu.bootstrapConfig({force: true});
}
else {
  slu.bootstrapConfig();
}

if (commander.test) {
  slu.setTestMode();
}

if (commander.json) {
  slu.generateJSON();
} else if (commander.tex) {
  slu.generateTeX();
} else {
  slu.update();
}
