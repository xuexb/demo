/**
 * @file 查找对象的key
 * @author xiaowu
 *
 * @description 如果为对象，不会返回原型链上的属性
 * @param {string|Object|Array} obj 要解析的对象,不可为空或者null
 * @return {Object} 解析后的对象
 * @example
 *     Object.keys([1]); => 返回数组索引
 *     Object.keys('1,2'); => 返回字符串索引
 *     Object.keys({a:1}); => 返回对象的key
 */


'use strict';

var str = '123';
console.log(Object.keys(str));

console.log(Object.keys(1));
console.log(Object.keys(false));
console.log(Object.keys(function(){}));

var arr = [
    'a', 
    'b',
    'c'
];
console.log(Object.keys(arr));


Object.prototype.xx = function(){};
var obj = {
    a: 1,
    toString: function(){},
    valueOf: function(){}
}
for(var key in obj){
    console.log(key);
}
console.log(Object.keys(obj));//不会返回xx


var fn = function(){
    this.a = 1;
}
fn.prototype.b = 2;
console.log(Object.keys(new fn()));// 不会返回b
for (key in new fn()){
    console.log(key);
}