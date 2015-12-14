/**
 * @file 数组循环
 * @author xiaowu
 *
 * @description 循环不可被停止
 * @param {Function} fn 回调，参数1为当前循环的值，参数2为索引，参数3为目标数组
 * @param {Object|undefined} context 回调fn的this的上下文
 * @return {undefined} 无返回值
 * @example
 *     Array.prototype.forEach(fn [,context]);
 */


'use strict';

var arr = [
    1,
    3,
    5
];
var res = arr.forEach(function (val, index, that) {
    console.log(val, index, that, this);
    return true;
});
console.log(res);

var arr2 = [
    {
        a: 3
    }
];
arr2.forEach(function (val) {
    val.b = 3;
});
console.log(arr2);

var res2 = arr.forEach(function (val) {
    console.log(val, this);
    return val === -1;
}, {
    author: 'xiaowu'
});
console.log(res2);
