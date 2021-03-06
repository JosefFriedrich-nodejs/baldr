"use strict";
/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 */
function bootstrapConfig() {
    let config;
    const configFile = path_1.default.join(path_1.default.sep, 'etc', 'baldr.json');
    if (fs_1.default.existsSync(configFile)) {
        config = require(configFile);
    }
    if (!config)
        throw new Error(`No configuration file found: ${configFile}`);
    return config;
}
/**
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
const config = bootstrapConfig();
module.exports = config;
