const { assert } = require('./lib/helper.js')
const fs = require('fs-extra')
const indexRewired = require('rewire')('../index.js')
const json = require('../json.js')
const path = require('path')
const process = require('process')
const rewire = require('rewire')
const sinon = require('sinon')
const spawn = require('child_process').spawnSync
const standard = require('mocha-standard')

let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
bootstrapConfig({
  test: true,
  path: path.resolve('test', 'songs', 'clean', 'some'),
  force: true
})

process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)

describe('Class “TeX”', () => {
  let TeX = indexRewired.__get__('TeX')
  let basePath = path.resolve('test', 'songs', 'processed', 'some')
  let tex = new TeX(basePath)

  it('method “buildPianoFilesCountTree()”', () => {
    let folderTree = json.readJSON(basePath)
    let count = tex.buildPianoFilesCountTree(folderTree)
    assert.equal(count.a[3]['Auf-der-Mauer_auf-der-Lauer'].title, 'Auf der Mauer, auf der Lauer')
    assert.equal(count.s[1]['Stille-Nacht'].title, 'Stille Nacht')
    assert.equal(count.s[3]['Swing-low'].title, 'Swing low')
    assert.equal(count.z[2]['Zum-Tanze-da-geht-ein-Maedel'].title, 'Zum Tanze, da geht ein Mädel')

    assert.deepEqual(count.s[3]['Swing-low'].pianoFiles, [ 'piano_1.eps', 'piano_2.eps', 'piano_3.eps' ])
  })

  it('method “texCmd()”', () => {
    assert.equal(tex.texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
  })

  it('method “texABC()”', () => {
    assert.equal(tex.texABC('a'), '\n\n\\tmpchapter{A}\n')
  })

  it('method “texSong()”', () => {
    let songPath = path.join(basePath, 's', 'Swing-low')
    assert.equal(
      tex.texSong(songPath),
      '\n' +
      '\\tmpheading{Swing low}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_1.eps}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_2.eps}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_3.eps}\n'
    )
  })

  it('method “generateTeX()”', () => {
    let texFile = path.join('test', 'songs', 'processed', 'some', 'songs.tex')
    tex.generateTeX(path.resolve('test', 'songs', 'processed', 'some'))
    assert.exists(texFile)

    var texContent = fs.readFileSync(texFile, 'utf8')
    var compare = fs.readFileSync(
      path.join('test', 'files', 'songs_processed.tex'), 'utf8'
    )

    assert.equal(texContent, compare)

    assert.ok(texContent.indexOf('\\tmpimage') > -1)
    assert.ok(texContent.indexOf('\\tmpheading') > -1)
  })
})

describe('file “index.js”', () => {
  describe('Configuration', () => {
    it('function “bootstrapConfig()”', () => {
      let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
      bootstrapConfig({ path: path.resolve('test', 'songs', 'clean', 'some'), test: true })
      const c = indexRewired.__get__('config')
      assert.equal(c.path, path.resolve('test', 'songs', 'clean', 'some'))
      assert.exists(path.resolve('test', 'songs', 'clean', 'some', 'filehashes.db'))
    })

    it('function “bootstrapConfig()”: exit', () => {
      let savePATH = process.env.PATH
      process.env.PATH = ''
      try {
        let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
        bootstrapConfig({ path: path.resolve('test', 'songs', 'clean', 'some'), test: true })
      } catch (e) {
        assert.equal(
          e.message,
          'Some dependencies are not installed: “mscore-to-eps.sh”, ' +
          '“pdf2svg”, “pdfcrop”, “pdfinfo”, “pdftops”, “mscore”'
        )
        assert.equal(e.name, 'UnavailableCommandsError')
      }
      process.env.PATH = savePATH
    })
  })

  describe('Private functions', () => {
    it('function “processSongFolder()”', () => {
      let processSongFolder = indexRewired.__get__('processSongFolder')
      let status = processSongFolder(
        path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
      )

      assert.deepEqual(
        status,
        {
          'changed': {
            'piano': false,
            'slides': false
          },
          'folder': 'test/songs/clean/some/a/Auf-der-Mauer_auf-der-Lauer',
          'folderName': 'Auf-der-Mauer_auf-der-Lauer',
          'force': true,
          'generated': {
            'piano': [
              'piano_1.eps',
              'piano_2.eps'
            ],
            'projector': 'projector.pdf',
            'slides': [
              '01.svg',
              '02.svg'
            ]
          },
          'info': {
            'title': 'Auf der Mauer, auf der Lauer'
          }
        }
      )
    })
  })

  describe('Exported functions', () => {
    it('function “update()”', () => {
      let stub = sinon.stub()
      indexRewired.__set__('message.songFolder', stub)
      let update = indexRewired.__get__('update')
      update()
      let songs = path.join('test', 'songs', 'clean', 'some')
      const auf = path.join(songs, 'a', 'Auf-der-Mauer_auf-der-Lauer')
      const swing = path.join(songs, 's', 'Swing-low')
      const zum = path.join(songs, 'z', 'Zum-Tanze-da-geht-ein-Maedel')
      const folders = [auf, swing, zum]

      for (let i = 0; i < folders.length; ++i) {
        assert.exists(folders[i], 'slides')
        assert.exists(folders[i], 'slides', '01.svg')
        assert.exists(folders[i], 'piano')
        assert.exists(folders[i], 'piano', 'piano.mscx')
      }

      assert.exists(auf, 'piano', 'piano_1.eps')
      assert.exists(swing, 'piano', 'piano_1.eps')
      assert.exists(zum, 'piano', 'piano_1.eps')
      assert.exists(zum, 'piano', 'piano_2.eps')

      var info = JSON.parse(
        fs.readFileSync(
          path.join(songs, 'songs.json'), 'utf8'
        )
      )
      assert.equal(
        info.a['Auf-der-Mauer_auf-der-Lauer'].title,
        'Auf der Mauer, auf der Lauer'
      )

      let clean = indexRewired.__get__('clean')
      clean()
    })

    it('function “setTestMode()”', () => {
      let setTestMode = indexRewired.__get__('setTestMode')
      setTestMode()
      const config = indexRewired.__get__('config')
      assert.equal(config.test, true)
      assert.equal(config.path, path.resolve('test', 'songs', 'clean', 'some'))
    })

    it('function “clean()”', () => {
      let clean = indexRewired.__get__('clean')
      clean()
      assert.ok(!fs.existsSync(path.join('songs', 'songs.tex')))
    })
  })
})

it('conforms to standard', standard.files([
  'index.js', 'test/*.js'
]))

describe('Command line interface', () => {
  const baseArgv = [
    '/usr/bin/node',
    path.join(path.resolve('.'), 'index.js')
  ]

  const invokeCommand = function (argv) {
    let main = indexRewired.__get__('main')
    indexRewired.__set__('process.argv', baseArgv.concat(argv))
    main()
    return indexRewired
  }

  const args = function (arg) {
    if (typeof arg === 'string') {
      return ['-', '-', arg]
    } else {
      return ['-', '-'].concat(arg)
    }
  }

  const read = function (file) {
    return fs.readFileSync(file, 'utf-8')
  }

  describe('setOptions', () => {
    it.skip('--clean', () => {
      let setOptions = indexRewired.__get__('setOptions')
      let out = setOptions(args(['--clean']))
      console.log(out)
      assert.equal(out.clean, true)
    })
  })

  describe('require as module', () => {
    it('--path', () => {
      let stub = sinon.stub()
      let message = rewire('../message.js')
      message.__set__('info', stub)
      indexRewired.__set__('message', message)

      let main = indexRewired.__get__('main')
      indexRewired.__set__('process.argv', [
        '', '', '--path', path.join('test', 'songs', 'clean', 'some')
      ])
      main()

      let commander = indexRewired.__get__('commander')
      assert.equal(commander.path, path.join('test', 'songs', 'clean', 'some'))
      assert.deepEqual(
        stub.args,
        [
          [ '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps' ],
          [ '\u001b[33m☐\u001b[39m  \u001b[33mStille-Nacht\u001b[39m: Stille Nacht\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps' ],
          [ '\u001b[33m☐\u001b[39m  \u001b[33mSwing-low\u001b[39m: Swing low\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps' ],
          [ '\u001b[33m☐\u001b[39m  \u001b[33mZum-Tanze-da-geht-ein-Maedel\u001b[39m: Zum Tanze, da geht ein Mädel\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps' ]
        ]
      )
    })

    it('--tex', () => {
      invokeCommand(['--path', path.join('test', 'songs', 'processed', 'one'), '--tex'])
      let tex = path.join('test', 'songs', 'processed', 'one', 'songs.tex')

      assert.exists(tex)
      assert.equal(
        read(tex),
        read(path.join('test', 'files', 'songs_min_processed.tex'))
      )
      fs.unlinkSync(tex)
    })

    it('--json', () => {
      invokeCommand(['--path', path.join('test', 'songs', 'processed', 'one'), '--json'])
      let json = path.join('test', 'songs', 'processed', 'one', 'songs.json')
      assert.exists(json)
      assert.equal(
        read(json),
        read(path.join('test', 'files', 'songs_min_processed.json'))
      )
      fs.unlinkSync(json)
    })

    it('--folder', () => {
      let stub = sinon.stub()
      let message = rewire('../message.js')
      message.__set__('info', stub)
      indexRewired.__set__('message', message)

      let main = indexRewired.__get__('main')
      indexRewired.__set__('process.argv', [
        '', '',
        '--test',
        '--folder',
        'test/songs/clean/some/a/Auf-der-Mauer_auf-der-Lauer'
      ])
      main()
      let output = stub.args[0][0]
      assert.ok(output.includes('Auf-der-Mauer_auf-der-Lauer'))
      assert.ok(output.includes('01.svg, 02.svg'))
      assert.ok(output.includes('piano_1.eps, piano_2.eps'))
    })
  })

  describe('Command line', () => {
    it('no arguments: normal update', () => {
      spawn('./index.js', ['--test'])
    })

    it('no arguments (second run): only json and TeX generation', () => {
      spawn('./index.js', ['--test'])
    })

    it('--force', () => {
      spawn('./index.js', ['--test', '--force'])
    })

    it('--help', () => {
      const cli = spawn('./index.js', ['--test', '--help'])
      var out = cli.stdout.toString()
      assert.ok(out.indexOf('Usage') > -1)
      assert.ok(out.indexOf('--help') > -1)
      assert.ok(out.indexOf('--version') > -1)
      assert.equal(cli.status, 0)
    })

    it('--version', () => {
      const cli = spawn('./index.js', ['--test', '--version'])
      let pckg = require('../package.json')
      assert.equal(cli.stdout.toString(), pckg.version + '\n')
      assert.equal(cli.status, 0)
    })

    // Test should be executed at the very last position.
    it('--clean', () => {
      spawn('./index.js', ['--test', '--clean'])
    })
  })
})
