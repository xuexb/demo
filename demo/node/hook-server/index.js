/**
 * @file hook勾子服务端脚本
 * @author xuexb <fe.xiaowu@gmail.com>
 */

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var PORT = parseInt(process.argv[2], 10) || 8999;

var server = http.createServer(function (req, res) {

    function error(err) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end(err.toString()); // fail
    }

    function next(from, to) {
        fs.readFile(from, function (err, content) {
            if (err) {
                error(err);
            }
            else {
                fs.writeFile(to, content, function (err) {
                    if (err) {
                        error(err);
                    }

                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('0'); // success
                });
            }
        });
    }

    if (req.url == '/') {
        // show a file upload form
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.end('I\'m ready for that, you know.');
    }

    // 匹配 /update 去使用 /update?path={uri} 去执行文件
    else if (req.url.indexOf('/update') === 0) {
        var callback;

        // 由于 http 模块没有query这里幅值
        req.query = require('url').parse(req.url, true).query;

        // 如果有可执行文件
        if (req.query.path && fs.existsSync(req.query.path)) {
            // 删除require缓存
            delete require.cache[req.query.path];

            var callback = require(req.query.path);

            if ('function' === typeof callback) {
                return callback(req, res);
            }
        }

        res.end('404');
    }
    else if (req.url === '/receiver' && req.method.toLowerCase() === 'post') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                error(err);
            }
            else {
                var to = fields.to;
                fs.exists(to, function (exists) {
                    if (exists) {
                        fs.unlink(to, function (err) {
                            next(files.file.path, to);
                        });
                    }
                    else {
                        fs.exists(path.dirname(to), function (exists) {
                            if (exists) {
                                next(files.file.path, to);
                            }
                            else {
                                mkdirp(path.dirname(to), 0777, function (err) {
                                    if (err) {
                                        error(err);
                                        return;
                                    }

                                    next(files.file.path, to);
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        res.end('404');
    }

});

server.listen(PORT, function () {
    console.log('receiver listening *:' + PORT);
});
