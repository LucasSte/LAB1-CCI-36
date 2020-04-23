//Load HTTP module
const http = require("http");
const fs = require('fs');
const express = require('express');
const path = require('path');
const engines = require('consolidate');
const hostname = '127.0.0.1';
const port = 3000;

//Create HTTP server and listen on port 3000 for requests
let app = express();
app.use(express.static(__dirname));
app.set('views', __dirname);
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.listen(3000, function () {
    console.log("Listening to port 3000")
});
app.get('/script', (req, res) => {
    res.sendFile(__dirname + "/main.js");
})
app.get('/', (req, res) => {
    res.render(__dirname + '/index.html');
})

//listen for request on port 3000, and as a callback function have the port listened on logged
