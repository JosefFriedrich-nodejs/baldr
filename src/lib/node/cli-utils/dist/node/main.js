"use strict";
/**
 * Some utilities for the subcommands of the package @bldr/cli.
 *
 * @module @bldr/cli-utils
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRunner = void 0;
// Node packages.
const childProcess = __importStar(require("child_process"));
const os_1 = __importDefault(require("os"));
// Third party packages.
const ora_1 = __importDefault(require("ora"));
// TODO remove dependency object-assign
// Error: Cannot find module 'object-assign'
const gauge_1 = __importDefault(require("gauge"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * Run commands on the command line in a nice and secure fashion.
 */
class CommandRunner {
    /**
     * @param {Object} options
     * @property {Boolean} verbose
     */
    constructor(options) {
        this.verbose = (options && options.verbose) ? true : false;
        this.spinner = ora_1.default({ spinner: 'line' });
        this.gauge = new gauge_1.default();
        this.gauge.setTheme('ASCII');
        this.message = '';
    }
    /**
     *
     */
    checkRoot() {
        const user = os_1.default.userInfo();
        if (user.username !== 'root') {
            console.error('You need to be root: sudo /usr/local/bin/baldr …');
            process.exit();
        }
    }
    /**
     * Start the Ora terminal spinner.
     */
    startSpin() {
        this.spinner.start();
    }
    /**
     * Start the Gauge progress bar.
     */
    startProgress() {
        this.gauge.show('default', 0);
    }
    /**
     * Update the Gauge progress bar.
     */
    updateProgress(completed, text) {
        this.gauge.pulse();
        this.gauge.show(text, completed);
    }
    /**
     * Execute a command on the command line. This function is a wrapper around
     * [`childProcess.spawn()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
     *
     * For example `cmd.exec('youtube-dl', youtubeId, { cwd: ytDir })`.
     * We have to run the commands asynchronous because of the spinner.
     *
     * @param args - One or more arguments.
     * @param options - See `childProcess.spawn()`
     *   [options](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
     *
     * @returns {Object}
     *   [see on nodejs.org](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
     */
    exec(args, options) {
        if (this.verbose)
            this.startSpin();
        // To get error messages on unkown commands
        if (!options)
            options = {};
        if (options.shell === undefined)
            options.shell = true;
        if (options.encoding === undefined)
            options.encoding = 'utf-8';
        return new Promise((resolve, reject) => {
            let command;
            let commandString;
            if (args.length === 1) {
                command = childProcess.spawn(args[0], options);
                commandString = args[0];
            }
            else {
                command = childProcess.spawn(args[0], args.slice(1), options);
                commandString = `${args[0]} ${args.slice(1).join(' ')}`;
            }
            if (this.verbose) {
                this.message = `Exec: ${chalk_1.default.yellow(commandString)}`;
            }
            if (options && options.detached) {
                command.unref();
                resolve();
            }
            let stdout = '';
            let stderr = '';
            command.stdout.on('data', (data) => {
                this.logStdOutErr(data);
                stdout = stdout + data;
            });
            // somehow songbook build stays open without this event.
            command.stderr.on('data', (data) => {
                this.logStdOutErr(data);
                stderr = stderr + data;
            });
            command.on('error', (code) => {
                reject(new Error(stderr));
            });
            command.on('exit', (code) => {
                if (code === 0) {
                    resolve({ stdout, stderr });
                }
                else {
                    reject(new Error(stderr));
                }
            });
        });
    }
    /**
     * Append the buffed data stream from the child process to the spinner text.
     *
     * @param data - The binary output from childProcess.
     */
    logStdOutErr(data) {
        if (this.verbose) {
            let cleanedText = data.toString().trim();
            cleanedText = cleanedText.replace(/<s> \[webpack\.Progress\]/, '');
            cleanedText = cleanedText.replace(/\s{2,}/, ' ');
            this.setSpinnerText(this.message + ' ' + cleanedText);
        }
    }
    /**
     * Set the spinner text and cut the lenght of the text to fit in a
     * terminal window.
     *
     * @param text - The text to set on the spinner.
     */
    setSpinnerText(text) {
        this.spinner.text = text.substring(0, process.stdout.columns - 3);
    }
    /**
     * @param message - A message to show after the spinner.
     */
    log(message) {
        this.message = message;
        this.setSpinnerText(message);
    }
    /**
     * Catch an error and exit the progress.
     */
    catch(error) {
        this.stopSpin();
        console.log(error);
        process.exit();
    }
    /**
     * Stop the gauge progress bar.
     */
    stopProgress() {
        this.gauge.hide();
    }
    /**
     * Stop the command line spinner.
     */
    stopSpin() {
        this.spinner.stop();
    }
}
exports.CommandRunner = CommandRunner;
