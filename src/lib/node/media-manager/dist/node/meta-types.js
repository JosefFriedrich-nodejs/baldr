"use strict";
/**
 * Code to manage and process the meta data types of the media server.
 *
 * A media asset can be attached to multiple meta data types (for example:
 * `meta_types: recording,composition`). All meta data types belong to the type
 * `general`. The meta type `general` is applied at the end.
 *
 * The meta data types are specified in the module
 * {@link module:@bldr/media-server/meta-type-specs meta-type-specs}
 *
 * @module @bldr/media-manager/meta-types
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node packages.
const path_1 = __importDefault(require("path"));
// Project packages.
const core_browser_1 = require("@bldr/core-browser");
const config_1 = __importDefault(require("@bldr/config"));
const titles_1 = require("./titles");
const meta_type_specs_1 = __importDefault(require("./meta-type-specs"));
const two_letter_abbreviations_1 = require("./two-letter-abbreviations");
two_letter_abbreviations_1.checkTypeAbbreviations(meta_type_specs_1.default);
/**
 * Check a file path against a regular expression to get the type name.
 *
 * @param filePath
 *
 * @returns The type names for example `person,group,general`
 */
function detectTypeByPath(filePath) {
    filePath = path_1.default.resolve(filePath);
    const typeNames = new Set();
    for (const typeName in meta_type_specs_1.default) {
        const typeSpec = meta_type_specs_1.default[typeName];
        if (typeSpec.detectTypeByPath) {
            let regexp;
            if (typeof typeSpec.detectTypeByPath === 'function') {
                regexp = typeSpec.detectTypeByPath(typeSpec);
            }
            else {
                regexp = typeSpec.detectTypeByPath;
            }
            if (filePath.match(regexp))
                typeNames.add(typeName);
        }
    }
    typeNames.add('general');
    if (typeNames.size)
        return [...typeNames].join(',');
}
/**
 * Generate the file path of the first specifed meta type.
 *
 * @param data - The mandatory property is “metaTypes” and “extension”.
 *   One can omit the property “extension”, but than you have to specify
 *   the property “mainImage”.
 * @param oldPath - The old file path.
 *
 * @returns A absolute path
 */
function formatFilePath(data, oldPath) {
    if (!data.metaTypes)
        throw new Error(`Your data needs a property named “metaTypes”.`);
    // TODO: support multiple types
    // person,general -> person
    const typeName = data.metaTypes.replace(/,.*$/, '');
    const typeSpec = meta_type_specs_1.default[typeName];
    if (!typeSpec)
        throw new Error(`Unkown meta type “${typeName}”.`);
    if (!typeSpec.relPath || typeof typeSpec.relPath !== 'function') {
        return '';
    }
    // The relPath function needs this.extension.
    if (!data.extension) {
        if (!data.mainImage)
            throw new Error(`Your data needs a property named “mainImage”.`);
        data.extension = core_browser_1.getExtension(data.mainImage);
        // b/Bush_George-Walker/main.jpeg
    }
    if (data.extension === 'jpeg')
        data.extension = 'jpg';
    let oldRelPath = '';
    if (oldPath) {
        oldRelPath = path_1.default.resolve(oldPath);
        oldRelPath = oldRelPath.replace(config_1.default.mediaServer.basePath, '');
        oldRelPath = oldRelPath.replace(/^\//, '');
    }
    // b/Bush_George-Walker/main.jpeg
    const relPath = typeSpec.relPath({ typeData: data, typeSpec, oldRelPath });
    if (!relPath)
        throw new Error(`The relPath() function has to return a string for meta type “${typeName}”`);
    // To avoid confusion with class MediaFile in the module @bldr/media-client
    delete data.extension;
    const basePath = typeSpec.basePath ? typeSpec.basePath : config_1.default.mediaServer.basePath;
    return path_1.default.join(basePath, relPath);
}
/**
 * @param value
 */
function isValue(value) {
    if (value || typeof value === 'boolean') {
        return true;
    }
    return false;
}
/**
 * Apply the meta type specifications to all props.
 *
 * @param data - An object containing some meta data.
 * @param func - A function with the arguments `spec` (property
 *   specification), `value`, `propName`
 * @param typeSpec - The specification of one meta type.
 * @param replaceValues - Replace the values in the metadata object.
 */
function applySpecToProps(data, func, typeSpec, replaceValues = true) {
    function applyOneTypeSpec(props, propName, data, func, replaceValues) {
        const propSpec = props[propName];
        const value = func(propSpec, data[propName], propName);
        if (replaceValues && isValue(value)) {
            data[propName] = value;
        }
    }
    const propSpecs = typeSpec.props;
    for (const propName in propSpecs) {
        applyOneTypeSpec(propSpecs, propName, data, func, replaceValues);
    }
    return data;
}
/**
 * @param propSpec - The
 *   specification of one property
 */
function isPropertyDerived(propSpec) {
    if (propSpec && propSpec.derive && typeof propSpec.derive === 'function') {
        return true;
    }
    return false;
}
/**
 * Sort the given object according the type specification. Not specifed
 * propertiers are attached on the end of the object. Fill the object
 * with derived values.
 *
 * @param data - An object containing some meta data.
 * @param typeSpec - The specification of one meta type.
 */
function sortAndDeriveProps(data, typeSpec) {
    const origData = core_browser_1.deepCopy(data);
    const result = {};
    let folderTitles;
    let filePath;
    if (data.filePath) {
        filePath = data.filePath;
        folderTitles = new titles_1.DeepTitle(data.filePath);
    }
    // Loop over the propSpecs to get a sorted object
    const propSpecs = typeSpec.props;
    for (const propName in propSpecs) {
        const propSpec = propSpecs[propName];
        const origValue = origData[propName];
        let derivedValue;
        if (isPropertyDerived(propSpec) && propSpec.derive) {
            derivedValue = propSpec.derive({ typeData: data, typeSpec, folderTitles: folderTitles, filePath });
        }
        // Use the derived value
        if (isValue(derivedValue) &&
            ((!propSpec.overwriteByDerived && !isValue(origValue)) ||
                propSpec.overwriteByDerived)) {
            result[propName] = derivedValue;
            // Use orig value
        }
        else if (isValue(origValue)) {
            result[propName] = origValue;
        }
        // Throw away the value of this property. We prefer the derived
        // version.
        delete origData[propName];
    }
    // Add additional properties not in the propSpecs.
    for (const propName in origData) {
        const value = origData[propName];
        if (isValue(value)) {
            result[propName] = value;
        }
    }
    return result;
}
/**
 * @param data - An object containing some meta data.
 * @param typeSpec - The type name
 */
function formatProps(data, typeSpec) {
    function formatOneProp(spec, value) {
        if (isValue(value) &&
            spec.format &&
            typeof spec.format === 'function') {
            return spec.format(value, { typeData: data, typeSpec });
        }
        return value;
    }
    return applySpecToProps(data, formatOneProp, typeSpec);
}
/**
 * @param data - An object containing some meta data.
 * @param typeSpec - The specification of one meta type.
 */
function validateProps(data, typeSpec) {
    function validateOneProp(spec, value, prop) {
        // required
        if (spec.required && !isValue(value)) {
            throw new Error(`Missing property ${prop}`);
        }
        // validate
        if (spec.validate && typeof spec.validate === 'function' && isValue(value)) {
            const result = spec.validate(value);
            if (!result) {
                throw new Error(`Validation failed for property “${prop}” and value “${value}”`);
            }
        }
    }
    applySpecToProps(data, validateOneProp, typeSpec, false);
}
/**
 * Delete properties from the data.
 *
 * @param data - An object containing some meta data.
 * @param typeSpec - The specification of one meta type.
 */
function removeProps(data, typeSpec) {
    for (const propName in typeSpec.props) {
        if (data[propName]) {
            const value = data[propName];
            const propSpec = typeSpec.props[propName];
            if (!isValue(value) ||
                (propSpec.state && propSpec.state === 'absent') ||
                (propSpec.removeByRegexp &&
                    propSpec.removeByRegexp instanceof RegExp &&
                    typeof value === 'string' &&
                    value.match(propSpec.removeByRegexp))) {
                delete data[propName];
            }
        }
    }
    return data;
}
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 * @param typeName - The type name
 */
function processByType(data, typeName) {
    if (!meta_type_specs_1.default[typeName]) {
        throw new Error(`Unkown meta type name: “${typeName}”`);
    }
    const typeSpec = meta_type_specs_1.default[typeName];
    if (!typeSpec.props) {
        throw new Error(`The meta type “${typeName}” has no props.`);
    }
    if (typeSpec.initialize && typeof typeSpec.initialize === 'function') {
        data = typeSpec.initialize({ typeData: data, typeSpec });
    }
    data = sortAndDeriveProps(data, typeSpec);
    data = formatProps(data, typeSpec);
    // We need filePath in format. Must be after formatProps
    data = removeProps(data, typeSpec);
    validateProps(data, typeSpec);
    if (typeSpec.finalize && typeof typeSpec.finalize === 'function') {
        data = typeSpec.finalize({ typeData: data, typeSpec });
    }
    return data;
}
/**
 * Merge type names to avoid duplicate metadata type names:
 */
function mergeTypeNames(...typeName) {
    const types = new Set();
    for (let i = 0; i < arguments.length; i++) {
        const typeNames = arguments[i];
        if (typeNames) {
            for (const typeName of typeNames.split(',')) {
                types.add(typeName);
            }
        }
    }
    return [...types].join(',');
}
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 */
function process(data) {
    // The meta type specification is in camel case. The meta data is
    // stored in the YAML format in snake case
    data = core_browser_1.convertPropertiesSnakeToCamel(data);
    if (!data.metaTypes) {
        data.metaTypes = 'general';
    }
    else if (data.metaTypes.indexOf('general') === -1) {
        data.metaTypes = `${data.metaTypes},general`;
    }
    if (data.metaTypes) {
        for (const typeName of data.metaTypes.split(',')) {
            data = processByType(data, typeName);
        }
    }
    // Do not convert back. This conversion should be the last step, before
    // object is converted to YAML.
    // convertProperties(data, 'camel-to-snake')
    return data;
}
exports.default = {
    detectTypeByPath,
    formatFilePath,
    process,
    typeSpecs: meta_type_specs_1.default,
    mergeTypeNames
};
