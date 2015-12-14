/**
 * @file 解析为json对象
 * @author xiaowu
 *
 * @description 同eval,new Function不同的是，该解析很严格，必须符合json要求
 * @param {string} str 要解析的字符串，如果不是一个规范的字符串将抛错
 * @return {Object} 解析后的对象
 * @example
 *     JSON.parse(str);
 */


'use strict';

var str = '{"name":"leinov","sex":"famle","address":"beijing"}';


console.log(JSON.parse(str));
console.log(JSON.parse('[]'));
console.log(JSON.parse('{a:1}'));
