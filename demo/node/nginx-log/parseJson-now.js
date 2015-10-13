/**
 * 解析日志为json文件 - 实时计算
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

// require
var NginxParser = require('nginxparser');
var path = require('path');
var pack = require('./package.json');

/**
 * 日志文件全路径
 * @type {String}
 */
var LOG_PATH = pack.LOG_PATH;

/**
 * 日志文件规则
 * @type {String}
 */
var LOG_RULE = '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"';

var parser = new NginxParser(LOG_RULE);
var data = [];

// 创建检查器
var rule = LOG_RULE.match(/\$(\w+)/g);
if (rule) {
    rule = rule.map(function (val) {
        return String(val).replace('$', '');
    });
}

module.exports = function (callback) {
    parser.read(path.resolve(LOG_PATH), function (row) {
        var temp = {};
        // 必须符合检查器
        rule.forEach(function (val) {
            if (row.hasOwnProperty(val) && row[val] !== null && row[val] !== undefined) {
                temp[val] = row[val];
            }
        });
        data.push(temp);
    }, function (err) {
        if (err) {
            throw err;
        }
        if ('function' === typeof callback) {
            callback(data);
        }
    });
};
