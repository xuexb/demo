/**
 * every(fn, context)  如果有context则在回调里this为这个
 * fn = function(val, index, arr){}  val为当前循环的，index为索引，arr为当前的数组
 *
 * 必须全满足才为true
 * 只要有不满足则退出循环
 */

'use strict';


Object.prototype.test = 1;
Object.prototype.test2 = 1;
Array.prototype.x = 1;
Array.prototype.x2 = 1;


var i = 0;
var arr = [
    'a', 'b', 'c', 'd'
]
for(; i<arr.length; i++){
    console.log(i);
}



console.log('====================');
var obj = {
    'a': 1,
    'b': 2,
    'c': 3,
}
var i2 = 0;
obj.length = 3;
for(;i2<obj.length;i2++){
    console.log(i2);
}