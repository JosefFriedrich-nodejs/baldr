"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module @bldr/master-quote
 */
const core_browser_1 = require("@bldr/core-browser");
const type_definitions_1 = require("@bldr/type-definitions");
exports.default = type_definitions_1.MasterTypes.validateMasterSpec({
    name: 'quote',
    title: 'Zitat',
    propsDef: {
        text: {
            type: String,
            required: true,
            markup: true,
            description: 'Haupttext des Zitats.'
        },
        author: {
            type: String,
            description: 'Der Autor des Zitats.'
        },
        date: {
            type: [String, Number],
            description: 'Datum des Zitats.'
        },
        source: {
            type: String,
            markup: true,
            description: 'Die Quelle des Zitats'
        },
        prolog: {
            type: String,
            markup: true,
            description: 'Längerer Text, der vor dem Zitat erscheint.'
        },
        epilog: {
            type: String,
            markup: true,
            description: 'Längerer Text, der name dem Zitat erscheint.'
        }
    },
    icon: {
        name: 'comment-quote',
        color: 'brown',
        size: 'large'
    },
    styleConfig: {
        centerVertically: true,
        darkMode: true
    },
    hooks: {
        normalizeProps(props) {
            if (typeof props === 'string') {
                props = {
                    text: props
                };
            }
            // Inject quotations marks after the first befor the last word character
            // <p><span class="quotation-mark">»</span>Quote
            props.text = props.text.replace(/^(\s*<.+>)?/, '$1<span class="quotation-mark">»</span> ');
            props.text = props.text.replace(/(<.+>\s*)?$/, ' <span class="quotation-mark">«</span>$1');
            return props;
        },
        plainTextFromProps(props) {
            return core_browser_1.convertHtmlToPlainText(Object.values(props).join(' | '));
        }
    }
});
