// Third party packages.
var Color = require('color');
// See @bldr/themes/default-vars.scss
const colors = {
    'white-light': '#fcfcfb',
    'yellow-light': '#f0d171',
    'orange-light': '#f3a058',
    'red-light': '#e57174',
    'brown-light': '#ac8976',
    'gray-light': '#c4bcb8',
    'green-light': '#6eb464',
    'blue-light': '#658db7',
    'purple-light': '#bb8eae',
    'black-light': '#3a3331',
    white: '#fcfbfb',
    yellow: '#edc958',
    orange: '#f18f3b',
    red: '#e0585b',
    brown: '#9c755f',
    gray: '#bab0ac',
    green: '#59a14e',
    blue: '#4e79a7',
    purple: '#af7aa0',
    black: '#141110',
    'white-dark': '#d9d4d2',
    'yellow-dark': '#e8bb2c',
    'orange-dark': '#e71',
    'red-dark': '#d93134',
    'brown-dark': '#856351',
    'gray-dark': '#a2948f',
    'green-dark': '#4c8942',
    'blue-dark': '#42678e',
    'purple-dark': '#9e5f8c',
    'black-dark': '#110f0e'
};
/**
 * @param {object} color
 *
 * ```js
 * { model: 'rgb', color: [ 252, 252, 251 ], valpha: 1 }
 * ```
 */
function createGimpPaletteLine(color, name) {
    const segments = [];
    const c = color.color;
    for (const rgb of c) {
        if (rgb > 99) {
            segments.push(`${rgb} `);
        }
        else if (rgb > 9) {
            segments.push(` ${rgb} `);
        }
        else {
            segments.push(`  ${rgb} `);
        }
    }
    segments.push(` ${name}`);
    return segments.join('');
}
/**
 * Palette for Inkscape
 *
 * ~/.config/inkscape/palettes/baldr.gpl
 * ```
 * GIMP Palette
 * Name: baldr
 * 252 251 251  white-light
 * 237 201  88  yellow-light
 * ```
 */
function createGimpPalette() {
    const lines = [];
    lines.push('GIMP Palette');
    lines.push('Name: baldr');
    for (const colorName in colors) {
        const color = new Color(colors[colorName]);
        lines.push(createGimpPaletteLine(color.rgb(), colorName));
    }
    console.log(lines.join('\n'));
}
module.exports = createGimpPalette;
