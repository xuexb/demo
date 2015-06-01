/**
 * redis的相关操作
 * @author xieliang
 */

'use strict';

var redis = require('redis');

var client = redis.createClient('6379', '127.0.0.1');

client.on('ready', function() {
    console.log('ready');
});

client.on('error', function() {
    console.log('error');
});

client.set('name', 'value', function(err){
    if(err){
        return console.log(err);
    }

    client.get('name', function(err, content){
        if(err){
            return console.log(err);
        }

        console.log('content:'+ content);
    });
});