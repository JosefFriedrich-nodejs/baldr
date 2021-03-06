"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const config_1 = __importDefault(require("@bldr/config"));
const action_js_1 = __importDefault(require("../build-sync/action.js"));
const action_js_2 = __importDefault(require("../build/action.js"));
/**
 * Normalize the metadata files in the YAML format (sort, clean up).
 *
 * @param what - What is to update. `api`,
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(what, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner({ verbose: true });
        cmd.checkRoot();
        cmd.startSpin();
        const opts = {
            remote: true,
            local: true,
            api: true,
            config: true,
            media: true,
            vue: true
        };
        if (what === 'api') {
            opts.config = false;
            opts.media = false;
            opts.vue = false;
        }
        else if (what === 'config') {
            opts.api = false;
            opts.media = false;
            opts.vue = false;
        }
        else if (what === 'media') {
            opts.api = false;
            opts.config = false;
            opts.vue = false;
        }
        else if (what === 'vue') {
            opts.api = false;
            opts.config = false;
            opts.media = false;
        }
        if (cmdObj.onlyRemote) {
            opts.local = false;
        }
        if (cmdObj.onlyLocal) {
            opts.remote = false;
        }
        // config
        if (opts.local && opts.config) {
            cmd.log('Updating the configuration locally using ansible.');
            yield cmd.exec(['/usr/local/bin/ansible-playbook-localhost.sh', 'b/baldr']);
        }
        if (opts.remote && opts.config) {
            cmd.log('Updating the configuration remotely using ansible.');
            yield cmd.exec(['ssh', config_1.default.mediaServer.sshAliasRemote, `\"/usr/local/bin/ansible-playbook-localhost.sh b/baldr\"`]);
        }
        // api
        if (opts.local && opts.api) {
            const result = yield cmd.exec(['git', 'status', '--porcelain'], { cwd: config_1.default.localRepo });
            // For example:
            //  M src/cli-utils/main.js\n M src/cli/src/commands/update/action.js\n
            if (result.stdout) {
                console.log(`Git repo is not clean: ${config_1.default.localRepo}`);
                console.log(result.stdout);
                process.exit(1);
            }
            cmd.log('Updating the local BALDR repository.');
            yield cmd.exec(['git', 'pull'], { cwd: config_1.default.localRepo });
            cmd.log('Installing missing node packages in the local BALDR repository.');
            yield cmd.exec(['npx', 'lerna', 'bootstrap'], { cwd: config_1.default.localRepo });
            cmd.log('Restarting the systemd service named “baldr_api.service” locally.');
            yield cmd.exec(['systemctl', 'restart', 'baldr_api.service']);
            cmd.log('Restarting the systemd service named “baldr_wire.service” locally.');
            yield cmd.exec(['systemctl', 'restart', 'baldr_wire.service']);
        }
        if (opts.remote && opts.api) {
            cmd.log('Updating the remote BALDR repository.');
            yield cmd.exec(['ssh', config_1.default.mediaServer.sshAliasRemote, `\"cd ${config_1.default.localRepo}; git pull\"`]);
            cmd.log('Installing missing node packages in the remote BALDR repository.');
            yield cmd.exec(['ssh', config_1.default.mediaServer.sshAliasRemote, `\"cd ${config_1.default.localRepo}; npx lerna bootstrap\"`]);
            cmd.log('Restarting the systemd service named “baldr_api.service” remotely.');
            yield cmd.exec(['ssh', config_1.default.mediaServer.sshAliasRemote, '\"systemctl restart baldr_api.service\"']);
        }
        // vue
        if (opts.vue) {
            cmd.stopSpin();
            yield action_js_2.default('lamp');
            yield action_js_1.default();
            cmd.startSpin();
        }
        // media
        if (opts.local && opts.media) {
            cmd.log('Commiting local changes in the media repository.');
            yield cmd.exec(['git', 'add', '-Av'], { cwd: config_1.default.mediaServer.basePath });
            try {
                yield cmd.exec(['git', 'commit', '-m', 'Auto-commit'], { cwd: config_1.default.mediaServer.basePath });
            }
            catch (error) { }
            cmd.log('Pull remote changes into the local media repository.');
            yield cmd.exec(['git', 'pull'], { cwd: config_1.default.mediaServer.basePath });
            cmd.log('Push local changes into the remote media repository.');
            yield cmd.exec(['git', 'push'], { cwd: config_1.default.mediaServer.basePath });
            cmd.log('Updating the local MongoDB database.');
            yield cmd.exec(['curl', 'http://localhost/api/media/mgmt/update']);
        }
        if (opts.remote && opts.media) {
            cmd.log('Pull remote changes from the git server into the remote media repository.');
            yield cmd.exec(['ssh', config_1.default.mediaServer.sshAliasRemote, `\"cd ${config_1.default.mediaServer.basePath}; git add -Av; git reset --hard HEAD; git pull\"`]);
            cmd.log('Updating the remote MongoDB database.');
            yield cmd.exec([
                'curl',
                '-u', `${config_1.default.http.username}:${config_1.default.http.password}`,
                `https://${config_1.default.http.domainRemote}/api/media/mgmt/update`
            ]);
        }
        cmd.stopSpin();
    });
}
module.exports = action;
