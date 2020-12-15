# SwitchRPC
Discord Rich Presence integration for Nintendo Switch.
SwitchRPC is a Rich Presence application for Discord that allows you to set your game, and some details about it.
If you have any issues or find any bugs you can get assistance on the [support server.](https://discord.gg/NqG6pN9)

## Installation
If you're on windows, head over to the [releases](https://github.com/NintenZone/SwitchRPC/releases) tab and grab the latest release. (Open up "Assets" and download the SwitchRPC-Setup.exe file.)

Mac and Linux installers coming soon™.

### Manual Installation (Useful for Mac and Linux Installs)

*The dollar sign ($) denotes that you're using the command line/a terminal. Don't actually type it. To get to the terminal, open the "Terminal" app or similar (in the Applications/Utilities folder on macOS).*

1. Download and install [node.js](https://nodejs.org/en/) (either version should work fine)
2. Clone this repository:  
`$ git clone https://github.com/NintenZone/SwitchRPC.git` or download and decompress the source code from the [latest release](https://github.com/NintenZone/SwitchRPC/archive/master.zip)
6. CD into the directory you downloaded  
`$ cd ~/Downloads/SwitchRPC` for example
291029. Install dependencies  
`$ npm install`
83. Install electron globally, if not already installed  
`$ sudo npm install electron -g`  
*Note: This will prompt for a password. This is your computer login password, and it won't show up while you type. Type it in and press enter. This is necessary to install the "Electron" app that SwitchRPC runs on.*
69. Run the app!  
`$ electron .`

You may find it useful to create a script to run the app in the future. To do so, type the following in your terminal:
```bash
$ cat > run.sh
electron .
```  
Press the key combo Control + D at this point, and your terminal should return to a normal prompt. Run this final command:  
`$ chmod +x run.sh`  
And you should now be able to open "run.sh" like a regular file to open the app. You can drag this script to the second half of your dock on macOS (and rename it to your liking).

## Copyright 2018-2021 NintenZone Technologies. Nintendo Switch, and the Nintendo Switch logos are property of Nintendo.
