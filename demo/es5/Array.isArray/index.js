/**
 * @file 判断是否为数组
 * @author xiaowu
 *
 * @param {*} arr 目标变量
 * @return {boolean} 判断结果
 * @example
 *     Array.isArray(arr)
 */


'use strict';

console.log(Array.isArray([]));
console.log(Array.isArray([
    1
]));
console.log(Array.isArray([
    null
]));

console.log(Array.isArray(null, [], null));
console.log(Array.isArray(null));
console.log(Array.isArray({}));
console.log(Array.isArray(''));
console.log(Array.isArray(Array));
console.log(Array.isArray(new Array));
console.log(Array.isArray(new Object));

console.log(Array.isArray.apply(Array, [
    []
]));
console.log(Array.isArray.call(Array, []));
