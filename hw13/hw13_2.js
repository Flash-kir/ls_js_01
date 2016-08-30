'use strict';

const fs = require('fs'), http = require('http'), tree = require('./hw13_1.js');

http.createServer(function (req, res) {
    let file_name = "." + req.url;
    if ( fs.existsSync(file_name) ) {
        if ( fs.statSync(file_name).isDirectory() ) {
            res.setHeader('Content-Type', 'text/html');
            res.write( tree(file_name) );
        } else {
            let content = fs.readFileSync(file_name, 'utf8');
            res.write( content );
        }
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.write( "<h1>Not such file/directory found!</h1>" );
    }
    res.end();
}).listen(7777);