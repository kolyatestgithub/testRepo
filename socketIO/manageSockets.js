/**
 * Created by qudrat on 07/02/16.
 */

const redisModel = require('../redis/models');

module.exports = {

    initBoss: function (IO) {

        IO.of('/boss').on('connection', function (socket) {

            console.info('BOSS connected. socketId: ', socket.id);
            var bossId = (Math.random()* 1000).toFixed(0);
            redisModel.addBossSocketId(bossId, socket.id);

            socket.on('error', function (err) {
                console.error('Error in connection socket BOSS: ', err);
            });

            socket.on("answerUserForTask", function (data, cb) {
                console.info("BOSS receive answer for task from User");
                // some logic
                cb({
                    "success": true
                });
            });

            socket.once('disconnect', function () {
                console.info('Boss: disconnected! socketId:', socket.id);
                redisModel.delBossSocket(bossId);
            });

        });
    },

    initUser: function (IO) {

        IO.of('/user').on('connection', function (socket) {

            console.info('USER connected. socketId: ', socket.id);
            var userId = (Math.random()* 1000).toFixed(0), bossId;
            redisModel.addUserSocketId(userId, socket.id);

            socket.on('error', function (err) {
                console.error('Error in connection socket BOSS: ', err);
            });

            socket.on("taskForUser", function (data, cb) {
                console.info("User receive task from Boss");
                cb({
                    "success": true
                });
            });

            socket.once('disconnect', function () {
                console.info('User: disconnected! socketId:', socket.id);
                redisModel.delUserSocket(userId);
            });

        });
    }
};