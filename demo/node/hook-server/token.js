/**
 * @file 更新用户钩子
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

module.exports = function (req, res) {
    // 授权token
    if (req.query.token !== '123') {
        return res.end('token 无效');
    }

    require('child_process').exec('echo ok >> test.log', function (err, msg) {
        if (err) {
            console.error(err);
            res.end('token 更新失败');
        }
        else {
            return res.end('token 更新成功');
        }
    });
};
