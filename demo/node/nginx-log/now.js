/**
 * 日志分析
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

var fs = require('fs');
var path = require('path');
var UAParser = require('ua-parser-js');
var pack = require('./package.json');
var parseJson = require('./parseJson-now');
var util = require('./util');

/**
 * json文件路径
 * @type {string}
 */
var JSON_DIR = pack.JSON_DIR;

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

module.exports = function (req, res, next) {
    var data;
    var resdata;
    var cacheFile = path.resolve(JSON_DIR, 'cache.json');


    // 获取缓存文件
    resdata = util.getFileContentToJson(cacheFile);

    // 如果存在+没有错+时间在 30分钟内则命中cache
    if (resdata.errcode === 0 && resdata.time >= Date.now() - 1000 * 60 * 30) {
        return res.json(resdata);
    }

    // 获取log解析后的json数据
    parseJson(function (data) {
        var parser;

        // 开始分析
        resdata = {
            errcode: 0,
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
        data.forEach(function (val) {
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
        
        // 记录时间
        resdata.time = Date.now();

        // 写入缓存
        fs.writeFileSync(cacheFile, JSON.stringify(resdata));

        res.json(resdata);
    });
};
