/**
 * Created by qudrat on 07/02/16.
 */

var redis = require("redis");

var redisCl = redis.createClient();

redisCl.on('error', function (err) {
    console.error('Cannot connect to Redis. Error - ', err);
});

module.exports = redisCl;