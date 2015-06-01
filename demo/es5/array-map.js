/**
 * map(fn, context)  如果有context则在回调里this为这个
 * fn = function(val, index, arr){}  val为当前循环的，index为索引，arr为当前的数组
 * 以return的值组成新的数组
 * delete元素后不会进行回调循环,但新的arr.length还是老的一样, 有个坑就是新的元素在老元素delete的值会为空
 */

'use strict';

var arr = [
    'a', 'b', 'c', 'd'
]

var res = arr.map(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
}, {});
console.log(res);

console.log('del元素后：');
delete arr[1];
console.log(arr.length);
var res = arr.map(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
}, {});
console.log(res);

console.log('splice元素后：');
arr.splice(1,1);
console.log(arr.length);
var res = arr.map(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
}, {});
console.log(res);

Array.prototype.map = function(callback, context){
    var index = 0,
        len = this.length,
        arr = [];

    var has = {}.hasOwnProperty;

    callback = callback || function(){};

    for(; index<len; index++){
        if(has.call(this, index)){
            arr.push(callback.call(context, this[index], index, this));
        } else {
            arr.push(void 0);
        }
    }

    arr.length = len;

    return arr;
}



console.log('========');
var arr2 = [
    'a', 'b', 'c', 'd'
]

var res = arr2.map(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
}, {});
console.log(res);

console.log('删除元素后：');
delete arr2[1];
console.log(arr2.length);
var res = arr2.map(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
}, {});
console.log(res);


console.log('splice元素后：');
arr2.splice(1,1);
console.log(arr2.length);
var res = arr2.map(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
}, {});
console.log(res);


