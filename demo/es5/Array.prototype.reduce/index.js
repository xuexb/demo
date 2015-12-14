/**
 * @file 查找数组里值的索引
 * @author xiaowu
 *
 * @description 注意的是值的比较是以 === 比较的
 *              不同indexOf的是，是以数组后往前查找，但返回的索引还是以下标0开始
 * @param {*} val 目标值
 * @param {number|undefined} startIndex 如果为数字则以当前值查找后查找，且值是以数组后往前的索引，但结果还是以下标为0开始的索引
 *                                      否则以数组最后一个往前查找
 * @return {number} 目标值在数组里的位置，未找到则为-1
 * @example
 *     Array.prototype.lastIndexOf(val [,startIndex]);
 */


'use strict';

var arr = [
    1,
    3,
    5,
    3,
    3
];
arr.reduce(function(val, index, content){
    console.log(val, index, content);
});