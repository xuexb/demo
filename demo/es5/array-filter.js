/**
 * filter(fn, context)  如果有context则在回调里this为这个
 * fn = function(val, index, arr){}  val为当前循环的，index为索引，arr为当前的数组
 * return的值如果为假则去除当前元素
 * delete的元素就不会进入循环，filter组成的新元素视回调的返回值决定
 * 不操作原数据
 */

'use strict';

var arr = [
    'a', 'b', 'c', 'd'
]

var res = arr.filter(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
}, {});
console.log(res);

console.log('del元素后：');
delete arr[1];
console.log(arr.length);
var res = arr.filter(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
});
console.log(res);

console.log('splice元素后：');
arr.splice(1,1);
console.log(arr.length);
var res = arr.filter(function(val, index, array) {
    console.log(val, index, array, this);
    return '';
}, {});
console.log(res);


Array.prototype.filter = function(callback, context){
    var arr = [],
        index = 0,
        len = this.length;

    var has = {}.hasOwnProperty;

    callback = callback || function(){};

    for(; index<len; index++){
        // if(this[index]){
        if(has.call(this, index) && callback.call(context, this[index], index, this)){
            arr.push(this[index]);
        }
    }

    return arr;
}




console.log('+++++++++++++++');
var arr = [
    'a', 'b', 'c', 'd'
]

var res = arr.filter(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
}, {});
console.log(res);

console.log('del元素后：');
delete arr[1];
console.log(arr.length);
var res = arr.filter(function(val, index, array) {
    console.log(val, index, array, this);
    return 1;
});
console.log(res);

console.log('splice元素后：');
arr.splice(1,1);
console.log(arr.length);
var res = arr.filter(function(val, index, array) {
    console.log(val, index, array, this);
    return false;
}, {});
console.log(res);