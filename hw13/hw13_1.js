'use strict';

const fs = require('fs'), sizes = ["byte", "Kb", "Mb", "Gb", "Tb"];

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

function tree(path, tab, first) {
    if (first) {
        console.log( fs.realpathSync(path) );
    }
    let root = fs.readdirSync(path),
        len = path.length;
    // tab = tab + len;
    for (let i = 0; i < root.length; i++) {
        let file = root[i], stat, f_size = 0; 
        stat = fs.statSync(path + file);
        f_size = stat.size;
        if ( stat.isDirectory() ) {
            if (i == root.length - 1) {
                console.log( tab_maker(tab.substring(0, tab.length - 1) + "`", 1), file);
                tree(path + file + "/", tab.substring(0, tab.length - 1) + "    |", 0)
            } else {
                console.log( tab_maker(tab, 1), file);
                tree(path + file + "/", tab + "   |", 0)
            }
        } else {
            if (i == root.length - 1) {
                console.log( tab_maker(tab.substring(0, tab.length - 1) + "`", 0), file, sizeMaker(f_size, 0) );
            } else {
                console.log( tab_maker(tab, 0), file, sizeMaker(f_size, 0) );
            }
        }
        // console.log( tab_maker(tab), file);    
    }    
}

tree('./../hw5/', "|", 1);
// console.log(root);