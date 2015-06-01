/**
 * every(fn, context)  如果有context则在回调里this为这个
 * fn = function(val, index, arr){}  val为当前循环的，index为索引，arr为当前的数组
 *
 * 必须全满足才为true
 * 只要有不满足则退出循环
 */

'use strict';

var arr = [
    'a', 'b', 'c', 'd'
]

var x1 = function(val, index){
    console.log(val, index, this);
    return val === 'c';
}
var x2 = function(val, index){
    console.log(val, index, this);
    return val === 'cD';
}
if(arr.every(x1, {})){
    console.log('ok');
}
if(arr.every(x2, {})){
    console.log('ok2');
} else {
    console.log('no2');
}

console.log('del::::::');
delete arr[1];
console.log(arr.length);
if(arr.every(x1)){
    console.log('ok');
}



Array.prototype.every = function(callback, context){
    var index = 0,
        len = this.length,
        mrak = true;

    callback = callback || function(){};

    for(; index < len; index++){
        if(this[index]){
            if(!callback.call(context, this[index], index, this)){
                mrak = false;
                break;
            }
        }
    }

    return mrak;
}



console.log('++++++++++');

var arr = [
    'a', 'b', 'c', 'd'
]

var x1 = function(val, index){
    console.log(val, index, this);
    return val === 'c';
}
var x2 = function(val, index){
    console.log(val, index, this);
    return val === 'cD';
}
if(arr.every(x1, {})){
    console.log('ok');
}
if(arr.every(x2, {})){
    console.log('ok2');
} else {
    console.log('no2');
}

console.log('del::::::');
delete arr[1];
console.log(arr.length);
if(arr.every(x1)){
    console.log('ok');
}

