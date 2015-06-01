/**
 * promise的相关操作
 * @author xieliang
 */

'use strict';

var Promise = require('es6-promise').Promise;

var arr = [];

//success
new Array(10).join(',').split(',').forEach(function(val, index){
    arr.push(new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve(index);
        }, index * 100 );
    }));
});

Promise.all(arr).then(function(data){
    console.log(data);
    return [1]
}, function(data){
    console.log(data);
}).then(function(data){
    console.log(data);
});

// 必须全部执行完才执行then