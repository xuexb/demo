/**
 * @file 移动图片, dist/{key} -> dist/{uri}
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const execSync = require('child_process').execSync;

module.exports = function (options) {
    return new Promise((resolve, reject) => {
        options.data.forEach(val => {
            execSync(`mv dist/${val.key} dist/${val.uri}`);
        });

        resolve(options);
    });
};
