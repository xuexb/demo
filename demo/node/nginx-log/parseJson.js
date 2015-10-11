/**
 * 解析日志为json文件
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

// require
var NginxParser = require('nginxparser');
var fs = require('fs');
var path = require('path');
var util = require('./util');

/**
 * 日志文件全路径
 * @type {String}
 */
var LOG_PATH = '/usr/local/var/log/nginx/access.log';

/**
 * json文档存放目录
 * @type {String}
 */
var JSON_DIR = '/Users/baidu/Desktop/';

/**
 * 版本文件目录
 * @type {String}
 */
var VAR_PATH = '/Users/baidu/Desktop/var.json';

/**
 * 日志文件规则
 * @type {String}
 */
var LOG_RULE = '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"';

var parser = new NginxParser(LOG_RULE);
var data = [];
var datetime = new Date();

// 文件名
var filename = datetime.getFullYear() + '-' + (datetime.getMonth() + 1) + '-' + datetime.getDate();

// 创建检查器
var rule = LOG_RULE.match(/\$(\w+)/g);
if (rule) {
    rule = rule.map(function (val) {
        return String(val).replace('$', '');
    });
}

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
    var varfile;

    if (err) {
        throw err;
    }


    // 如果版本号不存在
    varfile = util.getFileContentToJson(VAR_PATH, {
        date: []
    });

    // 写入支持的版本号文件
    if (!util.inArray(filename, varfile.date)) {
        varfile.date.push(filename);
    }

    fs.writeFileSync(path.resolve(VAR_PATH), JSON.stringify(varfile));

    // data.splice(100);

    // 写入日志文件
    fs.writeFileSync(path.resolve(JSON_DIR, filename + '.json'), JSON.stringify({
        log: data
    }));

    console.log('Done!');
});
