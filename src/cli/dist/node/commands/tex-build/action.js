"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
function buildOneFile(filePath) {
    const process = child_process_1.default.spawnSync('lualatex', ['--halt-on-error', '--shell-escape', filePath], { cwd: path_1.default.dirname(filePath) });
    if (process.status === 0) {
        console.log(chalk_1.default.green('OK') + ' ' + filePath);
    }
    else {
        console.log(chalk_1.default.red('ERROR') + ' ' + filePath);
    }
}
/**
 * Build TeX files.
 *
 * @param filePaths - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`
 */
function action(filePaths) {
    media_manager_1.walk(buildOneFile, {
        path: filePaths,
        regex: 'tex'
    });
}
module.exports = action;
