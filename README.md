[![npm](https://img.shields.io/npm/v/baldr-sbook-updtr.svg)](https://www.npmjs.com/package/baldr-sbook-updtr)
[![Build Status](https://travis-ci.org/JosefFriedrich-nodejs/baldr-sbook-updtr.svg?branch=master)](https://travis-ci.org/JosefFriedrich-nodejs/baldr-sbook-updtr)

# baldr-sbook-updtr - BALDUR Songbook Updater

A command line utilty to generate from MuseScore files image files for
the BALDUR Songbook.

Further informations can be found on the
[API documentation site](https://joseffriedrich-nodejs.github.io/baldr-sbook-updtr/)
of the project.

## Installation

```
sudo npm install --global --unsafe-perm baldr-sbook-updtr
```

## Dependencies

Please install this dependenies:

* [mscore-to-eps.sh](https://github.com/JosefFriedrich-shell/mscore-to-eps.sh)
* [MuseScore](https://musescore.org/)
* [pdf2svg](https://github.com/dawbarton/pdf2svg)
* [pdfcrop](https://ctan.org/tex-archive/support/pdfcrop)
* [pdfinfo](https://poppler.freedesktop.org/)
* [pdftops](https://poppler.freedesktop.org/)

## Testing

```
npm install
npm test
```
