/**
 * @file 创建例子
 * @description 根据list的数据创建es5\es6的文件夹
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

var fs = require('fs');
var path = require('path');

var list = {
    es5: [
        'Object.keys',
        'Date.now',
        'Date.parse',
        'Array.isArray',
        'JSON.parse',
        'JSON.stringify',
        'Function.prototype.bind',
        'String.prototype.trim',
        'Array.prototype.indexOf',
        'Array.prototype.lastIndexOf',
        'Array.prototype.every',
        'Array.prototype.some',
        'Array.prototype.filter',
        'Array.prototype.reduce',
        'Array.prototype.reduceRight',
        'Strict mode'
    ]
};

Object.keys(list).forEach(function (key) {
    list[key].forEach(function (val) {
        var filepath = path.resolve('./demo/', key, val);

        // 如果文件夹已存在
        if (fs.existsSync(filepath)) {
            return;
        }

        // 创建文件夹
        fs.mkdirSync(filepath);

        // 给文件夹内写入README.md，因为空文件夹git会忽略
        fs.writeFileSync(path.resolve(filepath, 'README.md'), '# ' + val);
    });
});
