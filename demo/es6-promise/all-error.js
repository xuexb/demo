/**
 * promise的相关操作
 * @author xieliang
 */

'use strict';

var Promise = require('es6-promise').Promise;

var arr = [];

//success
new Array(10).join(',').split(',').forEach(function(val, index) {
    arr.push(new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(index);
            console.log('1:' + index);
        }, index * 100);
    }));
});

new Array(10).join(',').split(',').forEach(function(val, index) {
    arr.push(new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(index);
            console.log('2:' + index);
        }, index * 100);
    }));
});

Promise.all(arr).then(function(data) {
    console.log('success:', data);
}, function(data) {
    console.log('error:', data);
}).catch(function(e) {
    console.log(e);
});


//只要all里任何遇到 错误,则then里不执行resolve, reject只执行一次