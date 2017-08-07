/**
 * Created by qudrat on 07/02/16.
 */

const http = require('http')
    , fs = require('fs')
    , express = require('express')
    , socketIO = require('socket.io')
    , manageSockets = require('./socketIO/manageSockets');

var app = express();
var server = http.createServer(app);
server.listen(3000, function () {
    console.info('Server listening on port %d ', 3000);
});
var IO = socketIO(server).listen(server);
manageSockets.initBoss(IO);
manageSockets.initUser(IO);