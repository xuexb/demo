/**
 * @file 数组map
 * @author xiaowu
 *
 * @param {Function} fn 回调，参数1为当前循环的值，参数2为索引，参数3为目标数组
 * @param {Object|undefined} context 回调fn的this的上下文
 * @return {Array} 回调的返回值数组
 * @example
 *     Array.prototype.map(fn [,context]);
 */


'use strict';

var arr = [
    1,
    3,
    5
];
var res = arr.map(function (val, index, that) {
    console.log(val, index, that, this);
    return true;
});
console.log(res);

var res2 = arr.map(function (val) {
    if (val > 3) {
        return true;
    }

    console.log(val, this);
});
console.log(res2);


var res2 = arr.map(function (val) {
    console.log(val, this);
    return val === -1;
}, {author: 'xiaowu'});
console.log(res2);
