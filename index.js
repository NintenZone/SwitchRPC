//config
let production = true;
let version = 3;

const rpc = require('discord-rich-presence')('387406899739623426');
const request = require('request');
const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let loadingWindow;
let updateWindow;
let wData;

if (handleSquirrelEvent(app)) {
    return;
}

//Listen For App to be Ready
app.on('ready', function() {
    //create window
    mainWindow = new BrowserWindow({width: 600, height: 400, frame: false});
    mainWindow.setMenu(null);
    //Load HTML
    request('http://nintenbot.js.org/rpc.json', function(error, res, body) {
        if (error || !body) {
            return mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'no-server.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
        wData = JSON.parse(body);
        if (version < wData.version && production === true) {
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'update.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
        else {
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            }));
            mainWindow.once('ready-to-show', () => {
                mainWindow.show();
            })
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Menu Template
    const home = Menu.buildFromTemplate(homeTemplate);

    Menu.setApplicationMenu(home);

});

ipcMain.on('x', function() {
    app.quit()
});

ipcMain.on('max', function() {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) return mainWindow.unmaximize();
    else mainWindow.maximize();
});

ipcMain.on('min', function() {
    if (!mainWindow) return;
    mainWindow.minimize();
});

let game;
let desc;
//Catch Values
ipcMain.on('game:value', function(e, value) {
    game = value;
    checkSet();
});
ipcMain.on('desc:value', function(e, value) {
    desc = value;
    checkSet();
});


//create menu template
const homeTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//RPC Stuff

function checkSet() {
    if (!game) return;
    if (!desc) return;
    findGame()
}

let pic;
function findGame() {
    let gameArr = wData.games;
    let gameObj = wData.gameData;

    if (gameArr.indexOf(game.toLowerCase()) >= 0) {
        let num = gameArr.indexOf(game.toLowerCase());
        let name = gameObj[num].name;
        let pic = gameObj[num].pic;
        setPresence(name, pic);
    }
    else {
        let name = game;
        let pic = "switch";
        setPresence(name, pic)
    }
}

function setPresence(name, pic) {
    rpc.updatePresence({
        state: desc,
        details: name,
        largeImageKey: pic,
        largeImageText: name,
        smallImageKey: 'online',
        smallImageText: 'Online',
        instance: false,
    });
}

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
}
