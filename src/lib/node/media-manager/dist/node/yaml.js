"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeMetaDataYaml = exports.writeYamlFile = exports.loadMetaDataYaml = exports.loadYaml = void 0;
const fs_1 = __importDefault(require("fs"));
const core_browser_1 = require("@bldr/core-browser");
const core_node_1 = require("@bldr/core-node");
const helper_1 = require("./helper");
const media_file_classes_1 = require("./media-file-classes");
const meta_types_1 = __importDefault(require("./meta-types"));
/**
 * Load a YAML file and convert into a Javascript object. The string
 * properties are converted in the `camleCase` format. The function
 * returns a object with string properties to save Visual Studio Code
 * type checks (Not AssetType, PresentationTypes etc).
 *
 * @param filePath - The path of a YAML file.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted in the `camleCase` format.
 */
function loadYaml(filePath) {
    return core_browser_1.convertYamlStringToObject(core_node_1.readFile(filePath));
}
exports.loadYaml = loadYaml;
/**
 * Load the metadata file in the YAML format of a media asset. This
 * function appends `.yml` on the file path. It is a small wrapper
 * around `loadYaml`.
 *
 * @param filePath - The path of a media asset without the `yml`
 * extension. For example `Fuer-Elise.mp3` not `Fuer-Elise.mp3.yml`.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted in the `camleCase` format.
 */
function loadMetaDataYaml(filePath) {
    return loadYaml(`${filePath}.yml`);
}
exports.loadMetaDataYaml = loadMetaDataYaml;
/**
 * Convert some data (usually Javascript objets) into the YAML format
 * and write the string into a text file. The property names are
 * converted to `snake_case`.
 *
 * @param filePath - The file path of the destination yaml file. The yml
 *   extension has to be included.
 * @param data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns The data converted to YAML as a string.
 */
function writeYamlFile(filePath, data) {
    const yaml = core_browser_1.convertObjectToYamlString(data);
    core_node_1.writeFile(filePath, yaml);
    return yaml;
}
exports.writeYamlFile = writeYamlFile;
/**
 * Write the metadata YAML file for a corresponding media file specified
 * by `filePath`. The property names are converted to `snake_case`.
 *
 * @param filePath - The filePath gets asciified and a yml extension is
 *   appended.
 * @param metaData - The metadata to store in the YAML file.
 * @param force - Always create the yaml file. Overwrite the old one.
 */
function writeMetaDataYaml(filePath, metaData, force) {
    if (fs_1.default.lstatSync(filePath).isDirectory())
        return;
    const yamlFile = `${helper_1.asciify(filePath)}.yml`;
    if (force ||
        !fs_1.default.existsSync(yamlFile)) {
        if (!metaData)
            metaData = {};
        const asset = new media_file_classes_1.Asset(filePath);
        if (!metaData.id) {
            metaData.id = asset.basename;
        }
        if (!metaData.title) {
            metaData.title = helper_1.deasciify(asset.basename);
        }
        metaData = meta_types_1.default.process(metaData);
        writeYamlFile(yamlFile, metaData);
        return {
            filePath,
            yamlFile,
            metaData
        };
    }
    return {
        filePath,
        msg: 'No action.'
    };
}
exports.writeMetaDataYaml = writeMetaDataYaml;
