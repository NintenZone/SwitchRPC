//Config
let beta = false;
let version = 1;

const RPC = require('discord-rich-presence')('387406899739623426');

console.log('Loading SwitchRPC Beta-1.0...');
console.log('Loading control panel...');

const request = require('request');

console.log('Loaded control panel successfully.');
console.log('Loading http module...');

const http = require('http');
const formidable = require('formidable');

console.log('Loaded http module successfully.');

console.log('Starting up the file system...');
const fs = require('fs');
console.log('File system started.');

console.log("Connecting to your Discord client...");
const rpc = require('discord-rich-presence')('387406899739623426');
console.log("Connected to your client successfully.");

console.log('Just setting some extra things up...');
const util = require('util');
console.log('We\'re almost ready to go!');

console.log('Creating the control panel, prepare for liftoff!');

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() === 'get') {
        displayForm(res);
    }
    else if (req.method.toLowerCase() === 'post') {
        processIndividualFields(req, res);
    }

});

function displayForm(res) {
    fs.readFile('./index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

server.listen(1185);

let wData;

console.log('Fetching latest data from server...');
request('http://nintenbot.js.org/rpc.json', function(error, res, body) {
    wData = JSON.parse(body);
    console.log('Loaded data from server.')
    if (version < wData.version && beta === false) {
        console.log("This build is outdated! Please download the latest version from https://github.com/NintenZone/SwtichRPC/releases/");
        process.exit();
    }

});
console.log("Control panel created. Ready to rumble!");
console.log("Server listening on http://localhost:1185.");
console.log("Please go to http://localhost:1185 in your browser to continue.");

function processAllFields(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('Nice, getting right on that!');
    });
}

let game;
let desc;

function processIndividualFields(req, res) {
    var fields = [];
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value) {
        if (field === "game") {
            game = value;
        }
        if (field === "desc") {
            desc = value;
        }
        setData()
    });

    form.on('end', function() {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write('Nice! Getting right on that.\n' +
            '<a href="http://localhost:1185/">Click Here To Set Your Status Again</a>');
        res.end();
    });
    form.parse(req);
}

function setData() {
    let gameArr = wData.games;
    let gameObj = wData.gameData;

    if (!game) return;
    if (!desc) return;

    if (gameArr.indexOf(game.toLowerCase()) >= 0) {
        let num = gameArr.indexOf(game.toLowerCase());
        let name = gameObj[num].name;
        let pic = gameObj[num].pic;
        setPresence(name, pic);
    }
    else{
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
        smallImageKey: 'online',
        instance: false,
    });
}

