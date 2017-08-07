/**
 * Created by qudrat on 07/02/16.
 */

const redis = require("./redisClient")
    , _ = require('underscore')._;

module.exports = {

    // <editor-fold desc="Boss Sockets">
    addBossSocketId: function (bossId, socketId) {
        redis.hexists('bosssockets', bossId, function (err, rep) {
            if (err) {
                console.error('Error add boss sockets REDIS!');
            }
            else if (rep) {
                redis.hdel(['bosssockets', bossId]);
                redis.hset('bosssockets', bossId, JSON.stringify([{"socketId": socketId}]));
            }
            else {
                redis.hset('bosssockets', bossId, JSON.stringify([{"socketId": socketId}]));
            }
        });
    },

    getSomeOneBossSocketId: function (cb) {
        redis.hgetall('bosssockets', function (err, rep) {
            if(rep.length > 0) {
                _.find(rep, function (value, key) {
                    var arr = JSON.parse(value);
                    cb(null, arr[0].socketId);
                    return true;
                });
            }
            else {
                cb(null, null);
            }
        });
    },

    delBossSocket: function (bossId) {
        redis.hdel(['bosssockets', bossId]);
    },
    // </editor-fold>

    // <editor-fold desc="User Sockets">
    addUserSocketId: function (userId, socketId) {
        redis.hexists('usersockets', userId, function (err, rep) {
            if (err) {
                logger.error('Error add user sockets REDIS!');
            }
            else if (rep) {
                redis.hdel(['usersockets', userId]);
                redis.hset('usersockets', userId, JSON.stringify([{"socketId": socketId}]));
            }
            else {
                redis.hset('usersockets', userId, JSON.stringify([{"socketId": socketId}]));
            }
        });

    },

    getSomeOneUserSocketId: function (cb) {
        redis.hgetall('usersockets', function (err, rep) {
            var _find = false;
            _.find(rep, function (value, key) {
                var arr = JSON.parse(value);
                if(arr.length > 0) {
                    _find = true;
                    cb(null, arr[0].socketId);
                    return true;
                }
            });
            if(!_find) cb(null, null);
        });
    },

    delUserSocket: function (userId, cb) {
        redis.hdel(['usersockets', userId]);
    }
    // </editor-fold>

};

