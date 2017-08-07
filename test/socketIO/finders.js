/**
 * Created by qudrat on 07/02/16.
 */

const redisModel = require('../../redis/models');

module.exports = {

    getSomeOneUserSocketId: function (cb) {
        redisModel.getSomeOneUserSocketId(function (err, socketId) {
            if(socketId) {
                return cb(null, socketId);
            }
            cb(null, null);
        });
    },

    getSomeOneBossSocketId: function (cb) {
        redisModel.getSomeOneBossSocketId(function (err, socketId) {
            if(socketId) {
                return cb(null, socketId);
            }
            cb(null, null);
        });
    }
};