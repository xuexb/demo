/**
 * @file 只要有一个满足就为true
 * @author xiaowu
 *
 * @description 操作的数组不会对原数组有影响
 *              如果有一个返回true则退出当前循环
 * @param {Function} fn 回调，参数1为当前循环的值，参数2为索引，参数3为目标数组
 * @param {Object|undefined} context 回调fn的this的上下文
 * @return {boolean} 判断结果，必须全部返回true才为true，否则为false
 * @example
 *     Array.prototype.some(fn [,context]);
 */


'use strict';

var arr = [
    1,
    3,
    5
];
var res = arr.some(function (val, index, that) {
    console.log(val, index, that, this);
    return true;
});
console.log(res);

var res2 = arr.some(function (val) {
    if (val > 3) {
        return true;
    }

    console.log(val, this);
});
console.log(res2);

var res2 = arr.some(function (val) {
    if (val > 3) {
        return true;
    }

    console.log(val, this);
}, {
    author: 'xiaowu'
});
console.log(res2);
