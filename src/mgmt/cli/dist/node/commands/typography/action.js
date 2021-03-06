"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const core_node_1 = require("@bldr/core-node");
/**
 * Fix some typographic issues, for example quotes “…” -> „…“.
 *
 * @param filePaths - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action(filePaths) {
    media_manager_1.walk({
        everyFile(filePath) {
            console.log(chalk_1.default.green(filePath));
            let content = core_node_1.readFile(filePath);
            const before = content;
            content = content.replace(/“([^“”]*)”/g, '„$1“');
            content = content.replace(/"([^"]*)"/g, '„$1“');
            // Spaces at the end
            content = content.replace(/[ ]*\n/g, '\n');
            // Delete multiple empty lines
            content = content.replace(/\n\n\n+/g, '\n\n');
            // One newline at the end
            content = content.replace(/(.)\n*$/g, '$1\n');
            const after = content;
            if (before !== after) {
                console.log(chalk_1.default.red('before:'));
                console.log('„' + chalk_1.default.yellow(before) + '“');
                console.log(chalk_1.default.red('after:'));
                console.log('„' + chalk_1.default.green(after) + '“');
                core_node_1.writeFile(filePath, content);
            }
            else {
                console.log('No change');
                console.log('„' + chalk_1.default.blue(after) + '“');
            }
        }
    }, {
        path: filePaths
    });
}
module.exports = action;
