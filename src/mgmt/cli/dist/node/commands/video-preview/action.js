"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * Create a video preview image.
 *
 * @param filePath
 * @param second
 */
function createVideoPreviewImageOneFile(filePath, second) {
    if (!second)
        second = 10;
    const assetType = media_manager_1.filePathToAssetType(filePath);
    if (assetType === 'video') {
        const output = `${filePath}_preview.jpg`;
        const outputFileName = path_1.default.basename(output);
        console.log(`Preview image: ${chalk_1.default.green(outputFileName)} at second ${chalk_1.default.green(second)})`);
        if (typeof second === 'number')
            second = second.toString();
        const process = child_process_1.default.spawnSync('ffmpeg', [
            '-i', filePath,
            '-ss', second,
            '-vframes', '1',
            '-qscale:v', '10',
            '-y',
            output
        ]);
        if (process.status !== 0) {
            throw new Error();
        }
    }
}
/**
 * Create video preview images.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(filePaths, cmdObj) {
    media_manager_1.walk({
        asset(relPath) {
            createVideoPreviewImageOneFile(relPath, cmdObj.seconds);
        }
    }, {
        path: filePaths
    });
}
module.exports = action;
