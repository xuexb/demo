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


var arr = [
    'a', 'b', 'c', 'd'
]
var key;
for (key in arr) {
    console.log(key);
}

console.log('=============');
var key2;
for (key2 in arr) {
    if (arr.hasOwnProperty(key2)) {
        console.log(key2);
    }
}


console.log('~~~~~~~~~~~~');

var obj = {
    'a': 1,
    'b': 2,
    'c': 3,
}
var key;
for(key in obj){
    console.log(key);
}
console.log('=======');
var key2;
for(key2 in obj){
    if(obj.hasOwnProperty(key2)){
        console.log(key2);
    }
}