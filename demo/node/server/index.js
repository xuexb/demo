'use strict';

var http = require('http');
var url = require('url');
var path = require('path');

var server = module.exports = {};

server.__cache = [];

server.on = function(method, reg, callback) {
    if ('function' === typeof reg) {
        callback = reg;
        reg = '';
    }

    server.__cache.push({
        method: method.toUpperCase(),
        reg: reg,
        callback: callback,
    });

    return server;
};

['get', 'post'].forEach(function(val) {
    server[val] = function(reg, callback) {
        return server.on(val, reg, callback);
    }
});

server.all = function(reg, callback) {
    return server.on('*', reg, callback);
};


server.listen = function() {
    var server = http.createServer(createServer);
    return server.listen.apply(server, arguments);
};


function createServer(req, res) {
    var method = req.method;
    var parseUrl = url.parse(req.url);
    var cache = server.__cache;
    var flag = false;

    var i = -1;
    var len = cache.length;
    var next = function() {
        var val;

        i += 1;

        if (i >= len) {
            return end();
        }

        val = cache[i];

        if (val.method !== '*' && val.method !== method) {
            return next();
        }

        if (val.reg) {
            if ('string' === typeof val.reg && val.reg !== parseUrl.pathname) {
                return next();
            } else if (val.reg.constructor === RegExp && !val.reg.test(parseUrl.pathname)) {
                return next();
            }
        }

        val.callback.call(server, req, res, function() {
            flag = true;
            next();
        });
    }

    var end = function() {
        if(flag){
            return;
        }

        // 处理文件
        // 
        // 处理目录
    }

    next();
}

//test
var app = server;
app.get('/', function(req, res, next) {
    console.log('/', 'ok');
    next();
});

app.get(/.md$/, function(req, res) {
    console.log('*.md', 'ok');
});

app.get(/(.*)/, function(req, res, next) {
    console.log('*', 'ok');
    console.log(req.param)
    res.end('1');
})
app.listen(90);