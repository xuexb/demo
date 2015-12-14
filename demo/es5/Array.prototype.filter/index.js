/**
 * @file 数组筛选
 * @author xiaowu
 *
 * @description 只保留回调里返回true的结果集，不会对原数组有影响
 *              如果所有回调都没有返回true，则结果为空数组
 * @param {Function} fn 回调，参数1为当前循环的值，参数2为索引，参数3为目标数组
 * @param {Object|undefined} context 回调fn的this的上下文
 * @return {boolean} 判断结果，必须全部返回true才为true，否则为false
 * @example
 *     Array.prototype.filter(fn [,context]);
 */


'use strict';

var arr = [
    1,
    3,
    5
];
var res = arr.filter(function (val, index, that) {
    console.log(val, index, that, this);
    return true;
});
console.log(res);

var res2 = arr.filter(function (val) {
    if (val > 3) {
        return true;
    }

    console.log(val, this);
});
console.log(res2);


var res2 = arr.filter(function (val) {
    return val === -1;
    console.log(val, this);
}, {author: 'xiaowu'});
console.log(res2);
