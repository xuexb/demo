'use strict';

var Mdocjs = require('mdjs');

var app = new Mdocjs().clear_cache();

// 更新勾子
app.express.post('/update', function (req, res, next) {
    require('child_process').exec('git pull', {
        cwd: app.options.root
    }, function (a, b) {
        console.log(a, b, new Date().getTime());
    });

    res.end('ok');
});
