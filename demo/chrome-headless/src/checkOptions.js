/**
 * @file 检查配置
 * @author xuexb <fe.xiaowu@gmail.com>
 */

module.exports = function (options) {
    return new Promise((resolve, reject) => {
        if (!options.xmlPath) {
            reject(new TypeError('options.xmlPath cannot be empty'));
        }

        resolve(options);
    });
};
