"use strict";
 
const remote = require('electron').remote;
const fs = require('fs');
var sudo = require('sudo-prompt');


const app = remote.app;
const dialog =remote.dialog;

function backupHandler() {
    var pathToProfile = getFirefoxUserProfilePath();
    if(!pathToProfile)
        displayError("Path to Firefox profiles not found!");

    var options = {
        name: 'Firefox Bookmark Util',
    };
    
    sudoCopyFileWithBash(pathToProfile + "\\" + "places.sqlite",app.getPath("desktop"));
}

function restoreHandler() {
    var options = {
        "title": "Wo findet man places.sqlite",
        "defaultPath": app.getPath("desktop"),
        "properties": ["openFile"]
    };
    dialog.showOpenDialog(options, (filePaths) => {
        var file = filePaths[0];
        var pathToProfile = getFirefoxUserProfilePath();

        if(!pathToProfile)
            displayError("Path to Firefox profiles not found!");
        
        sudoCopyFileWithBash(file, pathToProfile);
    })
}

function getFirefoxUserProfilePath() {
    var path = app.getPath('appData') + '\\Mozilla\\Firefox\\Profiles';
    var pathFound = false;

    fs.readdirSync(path).forEach(file => {
        if(file.includes(".default") && !pathFound) {
            path += "\\" + file;
            pathFound = true;
        }
    });
    
    if(!pathFound)
        return false;
    else    
        return path;
}

function displayError(message) {
    const options = {
        type: 'error',
        buttons: ['OK'],
        title: 'Error',
        message: message,
      };
    
    dialog.showMessageBox(null, options);
}

function sudoCopyFileWithBash(src, dest) {
    var options = {
        name: 'Firefox Bookmark Util',
    };
    var bashCopy = "copy " + src + " " + dest;
    sudo.exec(bashCopy, options,
        function(error, stdout, stderr) {
            if (error) throw error;
            console.log('stdout: ' + stdout);
        }
    );
}