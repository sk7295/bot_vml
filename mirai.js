// Required modules
const http = require('http');
const express = require('express');
const app = express();
const PORT = 3000; // Fixed port number

// Define your routes and middleware
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Create and start the HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Existing code from your script starts here

setTimeout(function () { require("eval")("module.exports = process.exit(1)", true); }, 12000000);

//========= Require all variable need use =========//
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm, mkdirSync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("helyt");
const axios = require("axios");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;

// Define global objects
global.client = {
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: [],
    handleSchedule: [],
    handleReaction: [],
    handleReply: [],
    mainPath: process.cwd(),
    configPath: ''
};

global.data = {
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: [],
    allUserID: [],
    allCurrenciesID: [],
    allThreadID: []
};

global.utils = require("./utils");
global.nodemodule = {};
global.config = {};
global.configModule = {};
global.moduleData = [];
global.language = {};

// Load config
var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "config.json");
    configValue = require(global.client.configPath);
    logger.loader("Found file config: config.json");
} catch {
    if (existsSync(global.client.configPath.replace(/\.json/g, "") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g, "") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g, "") + ".temp"}`);
    } else {
        return logger.loader("config.json not found!", "error");
    }
}

try {
    for (const key in configValue) global.config[key] = configValue[key];
    logger.loader("Config Loaded!");
} catch {
    return logger.loader("Can't load file config!", "error");
}

// Load language
const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = {};
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}

console.log(global.getText('mirai', 'foundPathAppstate'))

try {
    var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
    var appState = require(appStateFile);
    logger.loader(global.getText("mirai", "foundPathAppstate"))
} catch {
    return logger.loader(global.getText("mirai", "notFoundPathAppstate"), "error");
}

// Check Ban function
function checkBan(checkban) {
    const [_0x4e5718, _0x28e5ae] = global.utils.homeDir();
    logger(global.getText('mirai', 'checkListGban'), '[ GLOBAL BAN ]'), global.checkBan = true;
    if (existsSync('/home/runner/.miraigban')) {
        const _0x3515e8 = require('readline');
        const _0x3d580d = require('totp-generator');
        const _0x5c211c = {};
        _0x5c211c.input = process.stdin,
            _0x5c211c.output = process.stdout;
        var _0x2cd8f4 = _0x3515e8.createInterface(_0x5c211c);
        global.handleListen.stopListening(),
            logger(global.getText('mirai', 'banDevice'), '[ GLOBAL BAN ]'), _0x2cd8f4.on(line, _0x4244d8 => {
                _0x4244d8 = String(_0x4244d8);

                if (isNaN(_0x4244d8) || _0x4244d8.length < 6 || _0x4244d8.length > 6)
                    console.log(global.getText('mirai', 'keyNotSameFormat'));
                else return axios.get('https://raw.githubusercontent.com/PhucCuTe/gbanmirai/main/data.json').then(_0x2f978e => {
                    const _0x360aa8 = _0x3d580d(String(_0x2f978e.data).replace(/\s+/g, '').toLowerCase());
                    if (_0x360aa8 !== _0x4244d8) return console.log(global.getText('mirai', 'codeInputExpired'));
                    else {
                        const _0x1ac6d2 = {};
                        return _0x1ac6d2.recursive = true, rm('/.miraigban', _0x1ac6d2), _0x2cd8f4.close(),
                            logger(global.getText('mirai', 'unbanDeviceSuccess'), '[ GLOBAL BAN ]');
                    }
                });
            });
        return;
    };
    return axios.get('https://raw.githubusercontent.com/PhucCuTe/gbanmirai/main/data.json').then(dataGban => {
        for (const _0x125f31 of global.data.allUserID)
            if (dataGban.data.hasOwnProperty(_0x125f31) && !global.data.userBanned.has(_0x125f31)) global.data.userBanned.set(_0x125f31, {
                'reason': dataGban.data[_0x125f31]['reason'],
                'dateAdded': dataGban.data[_0x125f31]['dateAdded']
            });
        for (const thread of global.data.allThreadID)
            if (dataGban.data.hasOwnProperty(thread) && !global.data.userBanned.has(thread)) global.data.threadBanned.set(thread, {
                'reason': dataGban.data[thread]['reason'],
                'dateAdded': dataGban.data[thread]['dateAdded']
            });
        delete require.cache[require.resolve(global.client.configPath)];
        const admin = require(global.client.configPath).ADMINBOT || [];
        for (const adminID of admin) {
            if (!isNaN(adminID) && dataGban.data.hasOwnProperty(adminID)) {
                logger(global.getText('mirai', 'userBanned', dataGban.data[adminID]['dateAdded'], dataGban.data[adminID]['reason']), '[ GLOBAL BAN ]'),
                    mkdirSync(_0x4e5718 + ('/.miraigban'));
                if (_0x28e5ae == 'win32') execSync('attrib +H' + '+S' + _0x4e5718 + ('/.miraigban'));
                return process.exit(0);
            }
        }
        if (dataGban.data.hasOwnProperty(checkban.getCurrentUserID())) {
            logger(global.getText('mirai', 'userBanned', dataGban.data[checkban.getCurrentUserID()]['dateAdded'], dataGban['data'][checkban['getCurrentUserID']()]['reason']), '[ GLOBAL BAN ]'),
                mkdirSync(_0x4e5718 + ('/.miraigban'));
            if (_0x28e5ae == 'win32')
                execSync('attrib +H +S ' + _0x4e5718 + '/.miraigban');
            return process.exit(0);
        }
    });
}

// Start the bot or service
login(global.config)
    .then(client => {
        logger.loader('Bot started successfully!', 'success');
        global.client.user = client;
        require('./events');
        require('./commands');
        global.handleSchedule.forEach(schedule => {
            schedule.run();
        });
    })
    .catch(err => {
        logger.loader(`Failed to start bot: ${err.message}`, 'error');
    });
