/**
 * Created by qudrat on 07/02/16.
 */

const io = require('socket.io-client')
    , finders = require('./finders')
    , should = require('should')
    , async = require('async');

var bossSocketURL = 'http://localhost:3000/boss';
var userSocketURL = 'http://localhost:3000/user';
var bossSocket, userSocket, bossSocketId, userSocketId;

describe("Socket IO", function () {

    it('Boss and user sockets', function (done) {
        this.timeout(5000);
        async.waterfall([

                // init user socket
                function (callback) {
                    var user = io.connect(userSocketURL);
                    user.on('connect', function () {
                        userSocket = user;
                        console.info('1) User socket connected.');
                        callback(null, true);
                    });
                },

                // init boss socket
                function (next, callback) {
                    var boss = io.connect(bossSocketURL);
                    boss.on('connect', function () {
                        bossSocket = boss;
                        console.info('2) Boss socket connected.');
                        callback(null, true);
                    });
                },

                // get dates
                function (next, callback) {
                    finders.getSomeOneUserSocketId(function (err, socketId) {
                        if (socketId) {
                            bossSocketId = socketId;
                            return callback(null, true);
                        }
                        callback(true, null);
                    });
                },
                function (next, callback) {
                    finders.getSomeOneUserSocketId(function (err, socketId) {
                        if (socketId) {
                            userSocketId = socketId;
                            return callback(null, true);
                        }
                        callback(true, null);
                    });
                },

                // Send task to user and receive in boss side
                function (next, callback) {
                    var data = {
                        "name": "createFibonachiFunction",
                        "estimate": 2,
                        "result": false
                    };
                    console.info('3) Testing: Send task for user and receive');
                    console.info('\t- Boss: send task for user  (emit.taskForUser)');
                    userSocket.emit('taskForUser', data, function (result) {
                        console.info('\t- User: receive task from boss   (on.taskForUser)');
                        should.exist(result);
                        result.should.be.an.instanceOf(Object);
                        result.should.have.properties('success');
                        result.success.should.be.an.instanceOf(Boolean);
                        result.success.should.equal(true);

                        setTimeout(function run() {
                            var data = {
                                "name": "createFibonachiFunction",
                                "estimate": 2,
                                "result": true
                            };
                            console.info('\t- User: answer for task and send to boss   (emit.answerUserForTask)');
                            bossSocket.emit('answerUserForTask', data, function (result) {
                                console.info('\t- Boss: receive answer from user   (on.answerUserForTask)');
                                should.exist(result);
                                result.should.be.an.instanceOf(Object);
                                result.should.have.properties('success');
                                result.success.should.be.an.instanceOf(Boolean);
                                result.success.should.equal(true);
                                callback(null, true);
                            });
                        }, 1000);
                    });
                }
            ],

            function (err, result) {
                bossSocket.disconnect();
                userSocket.disconnect();
                done();
            });


    });


});