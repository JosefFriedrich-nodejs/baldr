// Third party packages.
import chalk from 'chalk'

// Project packages.
import { convertMdToTex } from '@bldr/tex-markdown-converter'
import { DeepTitle, walk } from '@bldr/media-manager'
import { readFile, writeFile } from '@bldr/core-node'

/**
 * ```tex
 * \setzetitel{
 *   jahrgangsstufe = {6},
 *   ebenei = {Musik und ihre Grundlagen},
 *   ebeneii = {Systeme und Strukturen},
 *   ebeneiii = {die Tongeschlechter Dur und Moll},
 *   titel = {Dur- und Moll-Tonleiter},
 *   untertitel = {Das Lied \emph{„Kol dodi“} in Moll und Dur},
 * }
 * ```
 *
 * @param {String} filePath - The path of a TeX file.
 */
function patchTexFileWithTitles (filePath: string): void {
  console.log(`\nReplace titles in TeX file “${chalk.yellow(filePath)}”\n`)
  const titles = new DeepTitle(filePath)

  console.log(titles)

  const setzeTitle: { [key: string]: string } = {
    jahrgangsstufe: titles.grade.toString()
  }

  const ebenen = ['ebenei', 'ebeneii', 'ebeneiii', 'ebeneiv', 'ebenev']
  for (let index = 0; index < titles.curriculumTitlesArray.length; index++) {
    setzeTitle[ebenen[index]] = titles.curriculumTitlesArray[index]
  }
  setzeTitle.titel = titles.title
  if (titles.subtitle) {
    setzeTitle.untertitel = titles.subtitle
  }

  // Replace semantic markup
  for (const key in setzeTitle) {
    setzeTitle[key] = convertMdToTex(setzeTitle[key])
  }

  const lines = ['\\setzetitel{']
  for (const key in setzeTitle) {
    lines.push(`  ${key} = {${setzeTitle[key]}},`)
  }
  lines.push('}')
  lines.push('') // to get an empty line

  const patchedTitles = lines.join('\n')

  let texFileString = readFile(filePath)
  // /s s (dotall) modifier, +? one or more (non-greedy)
  const regexp = new RegExp(/\\setzetitel\{.+?,?\n\}\n/, 's')

  const match = texFileString.match(regexp)
  if (match) {
    const unpatchedTitles = match[0]
    if (unpatchedTitles !== patchedTitles) {
      console.log(chalk.yellow(unpatchedTitles))
      texFileString = texFileString.replace(regexp, patchedTitles)
      writeFile(filePath, texFileString)
    }

    console.log(chalk.green(patchedTitles))
    if (unpatchedTitles === patchedTitles) {
      console.log('No changes!')
    }
  }
}

/**
 * Replace the title section of the TeX files with metadata retrieved
 * from the title.txt files.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 */
function action (filePaths: string[]): void {
  walk(patchTexFileWithTitles, {
    path: filePaths,
    regex: 'tex'
  })
}

export = action
