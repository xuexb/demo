/**
 * 日志分析
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('./util');
var UAParser = require('ua-parser-js');
var pack = require('./package.json');

/**
 * json文档存放目录
 * @type {String}
 */
var JSON_DIR = pack.JSON_DIR;

/**
 * 版本文件目录
 * @type {String}
 */
var VAR_PATH = pack.VAR_PATH;

/**
 * 机器人列表
 * @type {Array}
 */
var ROBOT_ARR = [
    'Baiduspider',
    'MJ12bot',
    'Yahoo',
    'AdsBot-Google-Mobile',
    'AdsBot-Google',
    'Sogou',
    'Googlebot',
    'bingbot',
    'YisouSpider',
    'Feedly',
    'Blogtrottr',
    'HaosouSpider',
];

/**
 * 获取文件名，但不判断是否存在
 * @param  {string|undefined} time 日间
 * @return {string}
 */
function getFileName(time) {
    var d;

    if (time) {
        d = new Date(time);
        if (String(d.getTime()) === 'NaN') {
            d = new Date();
        }
    }
    else {
        d = new Date();
    }

    d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

    return {
        time: d,
        path: path.resolve(JSON_DIR, d + '.json')

    };
}

module.exports = function (req, res, next) {
    var filepath = getFileName(req.params.time);
    var varfile = util.getFileContentToJson(VAR_PATH);
    var data;
    var resdata;
    var parser;

    var time = filepath.time;
    filepath = filepath.path;

    if (!varfile.date || !varfile.date.length || !util.inArray(time, varfile.date)) {
        return res.json({
            errcode: 1,
            errmsg: '日期不被支持'

        });
    }

    // 获取缓存文件
    resdata = util.getFileContentToJson(filepath + '.data');
    if (resdata.errcode === 0) {
        return res.json(resdata);
    }

    // 否则获取日志文件
    data = util.getFileContentToJson(filepath);

    if (!data.log || !data.log.length) {
        return res.json({});
    }

    // 开始分析
    resdata = {
        browser: {},
        os: {},
        http_status: {},
        robot: {},
        http_bot: {
            bot: 0,
            all: 0

        }

    };

    parser = new UAParser();
    data.log.forEach(function (val) {
        var temp = parser.setUA(val.http_user_agent).getResult();

        // 浏览器
        if (temp.browser && temp.browser.name && temp.browser.version) {
            if (!resdata.browser[temp.browser.name]) {
                resdata.browser[temp.browser.name] = {
                    count: 0,
                    version: {}

                };
            }
            resdata.browser[temp.browser.name].count += 1;
            temp.browser.version = temp.browser.version.split('.')[0];
            if (!resdata.browser[temp.browser.name].version[temp.browser.version]) {
                resdata.browser[temp.browser.name].version[temp.browser.version] = 0;
            }
            resdata.browser[temp.browser.name].version[temp.browser.version] += 1;
        }

        // 系统
        if (temp.os && temp.os.name && temp.os.version) {
            if (!resdata.os[temp.os.name]) {
                resdata.os[temp.os.name] = {
                    count: 0,
                    version: {}

                };
            }
            resdata.os[temp.os.name].count += 1;
            temp.os.version = temp.os.version.split('.')[0];
            if (!resdata.os[temp.os.name].version[temp.os.version]) {
                resdata.os[temp.os.name].version[temp.os.version] = 0;
            }
            resdata.os[temp.os.name].version[temp.os.version] += 1;

            // http状态码
            if (!resdata.http_status[val.status]) {
                resdata.http_status[val.status] = 0;
            }
            resdata.http_status[val.status] += 1;
        }

        // 机器人
        temp = null;
        if (val.http_user_agent) {
            temp = val.http_user_agent.match(new RegExp('(' + ROBOT_ARR.join('|') + ')'));
        }
        if (temp) {
            temp = temp[0];
            resdata.http_bot.bot += 1;
            if (!resdata.robot[temp]) {
                resdata.robot[temp] = 0;
            }
            resdata.robot[temp] += 1;
        }
        resdata.http_bot.all += 1;
    });

    // 写入缓存
    fs.writeFileSync(filepath + '.data', JSON.stringify(resdata));

    res.json(resdata);
};
