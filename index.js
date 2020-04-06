//config
let production = true;
let version = 4;

//dependencies
const rpc = require('discord-rich-presence')('387406899739623426');
const request = require('request');
const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
let data;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.setMenu(null);

    request('http://nintenbot.js.org/rpc.json', function(err, res, body) {
        if (err || !body) {
            mainWindow.loadFile('no-server.html');
        }
        try {
            data = JSON.parse(body);
            mainWindow.loadFile('index.html')
        }
        catch(e) {
            mainWindow.loadFile('no-server.html')
        }
    });
}

app.whenReady().then(createWindow);


ipcMain.on('getGameData', function(event) {
    let gameArray = [];

    data.gameLibrary.forEach(function(game) {
        gameArray.push(game.name);
    });

    gameArray.sort();

    event.sender.send('sendingGameData', gameArray);
});

ipcMain.on('x', function() {
    app.quit();
});

ipcMain.on('max', function () {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) return mainWindow.unmaximize();
    else return mainWindow.maximize();
});

ipcMain.on('min', function() {
    if (!mainWindow) return;
    mainWindow.minimize();
});

let name;
let desc;
//catch values
ipcMain.on('game:value', function(e, value) {
    name = value;
});

ipcMain.on('desc:value', function (e, value) {
   desc = value;
   findGame();
});

let status = "online";
ipcMain.on("online", function() {
    status = "online";
    findGame();
});
ipcMain.on("away", function() {
    status = "away";
    findGame();
});

//RPC
function findGame() {
    let gotGame = name;
    let pic = "switch";
    if (!name || !desc) return;
    data.gameLibrary.forEach(function(game) {
        game.aliases.forEach(function(alias) {
            if (alias === name.toLowerCase()) {
                gotGame = game.name;
                pic = game.pic;
            }
        });
    });

    setPresence(gotGame, desc, pic, status);
}

function setPresence(game, desc, pic, status) {
    rpc.updatePresence({
        state: desc,
        details: game,
        largeImageKey: pic,
        largeImageText: game,
        smallImageKey: status,
        smallImageText: status.charAt(0).toUpperCase() + status.slice(1)
    })
}