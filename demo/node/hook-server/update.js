/**
 * @file 更新代码钩子
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

module.exports = function (req, res) {
    require('child_process').exec('echo ok >> test.log', function (err, msg) {
        if (err) {
            console.error(err);
            res.end('更新失败');
        }
        else {
            res.end('更新成功');
        }
    });
};
