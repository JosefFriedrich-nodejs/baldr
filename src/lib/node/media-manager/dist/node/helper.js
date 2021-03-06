"use strict";
/**
 * @module @bldr/media-manager/helper
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.untildify = exports.deasciify = exports.idify = exports.asciify = void 0;
const transliteration_1 = require("transliteration");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
/**
 * Convert some unicode strings into the ASCII format.
 */
function asciify(input) {
    const output = String(input)
        .replace(/[\(\)';]/g, '') // eslint-disable-line
        .replace(/[,\.] /g, '_') // eslint-disable-line
        .replace(/ +- +/g, '_')
        .replace(/\s+/g, '-')
        .replace(/[&+]/g, '-')
        .replace(/-+/g, '-')
        .replace(/-*_-*/g, '_')
        .replace(/Ä/g, 'Ae')
        .replace(/ä/g, 'ae')
        .replace(/Ö/g, 'Oe')
        .replace(/ö/g, 'oe')
        .replace(/Ü/g, 'Ue')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/!/g, '');
    return transliteration_1.transliterate(output);
}
exports.asciify = asciify;
/**
 * This function can be used to generate IDs from different file names.
 *
 * It performes some addictional replacements which can not be done in `asciify`
 * (`asciffy` is sometimes applied to paths.)
 */
function idify(input) {
    let output = asciify(input);
    // asciify is used by rename. We can not remove dots because of the exentions
    output = output.replace(/\./g, '');
    //  “'See God's ark' ” -> See-Gods-ark-
    output = output.replace(/^[^A-Za-z0-9]*/, '');
    output = output.replace(/[^A-Za-z0-9]*$/, '');
    // Finally remove all non ID characters.
    output = output.replace(/[^A-Za-z0-9-_]+/g, '');
    return output;
}
exports.idify = idify;
/**
 * This function can be used to generate a title from an ID string.
 */
function deasciify(input) {
    return String(input)
        .replace(/_/g, ', ')
        .replace(/-/g, ' ')
        .replace(/Ae/g, 'Ä')
        .replace(/ae/g, 'ä')
        .replace(/Oe/g, 'Ö')
        .replace(/oe/g, 'ö')
        .replace(/Ue/g, 'Ü')
        .replace(/ue/g, 'ü');
}
exports.deasciify = deasciify;
/**
 * Replace ~ with the home folder path.
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
function untildify(filePath) {
    if (filePath[0] === '~') {
        return path_1.default.join(os_1.default.homedir(), filePath.slice(1));
    }
    return filePath;
}
exports.untildify = untildify;
