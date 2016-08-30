'use strict';

const fs = require('fs'), sizes = ["byte", "Kb", "Mb", "Gb", "Tb"];
let resp = "";

function tab_maker(tab, isDir) {
    if ( isDir ) {
        return tab + "---";
    } else {
        return tab + "--->";
    }
}

function sizeMaker(size, depth) {
    if (size/1024 > 1 && depth < sizes.length - 1) {
        return sizeMaker(size/1024, depth + 1);
    } else {
        return "( " + String(Math.round(size * 100) / 100) + " " + sizes[depth] + " )";
    }
}

function tree(path, tab, no_first) {
    if (!no_first) {
        tab = "|";
        console.log( fs.realpathSync(path) );
        resp = "<h3>" + fs.realpathSync(path) + "</h3>";
    }
    let root = fs.readdirSync(path);
    for (let i = 0; i < root.length; i++) {
        let file = root[i], stat, f_size = 0; 
        stat = fs.statSync(path + file);
        f_size = stat.size;
        if ( stat.isDirectory() ) {
            if (i == root.length - 1) {
                resp += "<p>" + tab_maker(tab.substring(0, tab.length - 1) + "`", 1) + " " + file + "</p>";
                console.log( tab_maker(tab.substring(0, tab.length - 1) + "`", 1), file);
                tree(path + file + "/", tab.substring(0, tab.length - 1) + "    |", 1)
            } else {
                resp += "<p>" + tab_maker(tab, 1) + " " + file + "</p>";
                console.log( tab_maker(tab, 1), file);
                tree(path + file + "/", tab + "   |", 1)
            }
        } else {
            if (i == root.length - 1) {
                resp += "<p>" + tab_maker(tab.substring(0, tab.length - 1) + "`", 0) + " " + file + sizeMaker(f_size, 0) + "</p>";
                console.log( tab_maker(tab.substring(0, tab.length - 1) + "`", 0), file, sizeMaker(f_size, 0) );
            } else {
                resp += "<p>" + tab_maker(tab, 0) + " " + file + sizeMaker(f_size, 0) + "</p>";
                console.log( tab_maker(tab, 0), file, sizeMaker(f_size, 0) );
            }
        }
    }  
    return resp;
}

// console.log( tree('./../hw5/') );
module.exports = tree;