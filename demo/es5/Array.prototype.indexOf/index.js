/**
 * @file 查找数组里值的索引
 * @author xiaowu
 *
 * @description 注意的是值的比较是以 === 比较的
 * @param {*} val 目标值
 * @param {number|undefined} startIndex 如果为数字则以当前值查找，但结果还是以下标为0开始的索引
 * @return {number} 目标值在数组里的位置，未找到则为-1
 * @example
 *     Array.prototype.indexOf(val [,startIndex]);
 */


'use strict';

var arr = [
    1,
    3,
    5
];
console.log(arr.indexOf(null));
console.log(arr.indexOf());
console.log(arr.indexOf('1'));
console.log(arr.indexOf(1));
console.log(arr.indexOf(2));
console.log(arr.indexOf(3));
console.log(arr.indexOf(3, 3));
console.log(arr.indexOf(5, 1));

console.log('----');
var arr2 = [
    {
        a: 1
    },
    2
];
console.log(arr2.indexOf({
    a: 1
}));