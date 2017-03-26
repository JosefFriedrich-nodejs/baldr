#! /usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
var commander = require('commander');

// TODO: Clean up
/*
if (fs.existsSync('./index.js')) {
  var slu = require('./index.js');
} else {
  var slu = require('songbook-library-update');
}*/

// TODO: Clean up
try {
  var slu = require('songbook-library-update');
} catch (e) {
  if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
  }
}

try {
  var slu = require('./index.js');
} catch (e) {}

commander
  .version('0.0.5')
  .option('-c, --clean', 'clean up (delete all generated files)')
  .option('-f, --force', 'rebuild all images')
  .option('-F, --folder <folder>', 'process only the given song folder')
  .option('-j, --json', 'generate JSON file')
  .option('-t, --tex', 'generate TeX file')
  .option('-T, --test', 'switch to test mode')
  .parse(process.argv);

var config = {
  folder: commander.folder,
  force: commander.force
};

slu.bootstrapConfig(config);

if (commander.test) {
  slu.setTestMode();
}

if (commander.clean) {
  slu.clean();
} else if (commander.json) {
  slu.generateJSON();
} else if (commander.tex) {
  slu.generateTeX();
} else {
  slu.update();
}
