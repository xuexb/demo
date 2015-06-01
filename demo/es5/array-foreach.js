/**
 * forEach(fn, context)  如果有context则在回调里this为这个
 * fn = function(val, index, arr){}  val为当前循环的，index为索引，arr为当前的数组
 * 有个坑就是修复的时候必须判断是否有这个属性，因为delete的时候length不变
 * return的时候不会终止
 */

'use strict';

var arr = [
    'a','b','c','d'
]

arr.forEach(function(val, index, arr){
    console.log(this, val, index, arr);
}, {});
arr.forEach(function(val, index, arr){
    console.log(this, val, index, arr);
});
// arr.splice(1, 1);
delete arr[1];
console.log(arr.length);
arr.forEach(function(val, index, arr){
    console.log(this, val, index, arr);
});


Array.prototype.forEach = function(callback, context){
    var index = 0,
        len = this.length;

    var has = {}.hasOwnProperty;

    callback = callback || function(){};

    for(; index<len; index++){
        if(has.call(this, index)){
            callback.call(context, this[index], index, this);
        }
    }
}


var arr2 = [
    'a','b','c','d'
]
arr2.forEach(function(val, index, arr){
    console.log(this, val, index, arr);
}, {});
arr2.forEach(function(val, index, arr){
    console.log(this, val, index, arr);
});
// arr2.splice(1, 1);
delete arr2[1];
console.log(arr2.length);
arr2.forEach(function(val, index, arr){
    console.log(this, val, index, arr);
});