/**
 * @file 获取xml数据
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const path = require('path');
const fs = require('fs');
const parseString = require('xml2js').parseString;

module.exports = function (options) {
    return new Promise((resolve, reject) => {
        let data;

        try {
            data = fs.readFileSync(path.resolve(__dirname, options.xmlPath)).toString();
        }
        catch (e) {
            return reject(e);
        }

        parseString(data, {trim: true, explicitArray: false}, (err, result) => {
            if (err || !result || !result.DOCUMENT || !result.DOCUMENT.item) {
                return reject(err);
            }

            if (!result.DOCUMENT.item.length) {
                result.DOCUMENT.item = [result.DOCUMENT.item];
            }

            // 获取数据吧, 妹子
            options.data = result.DOCUMENT.item;

            resolve(options);
        });
    });
};
