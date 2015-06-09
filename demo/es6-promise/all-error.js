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
            // console.log('1:' + index);
        }, index * 100);
    }));
});

new Array(10).join(',').split(',').forEach(function(val, index) {
    arr.push(new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(index);
            // console.log('2:' + index);
        }, index * 100);
    }, 100));
});


Promise.all(arr).catch(function(e) {
    console.log(e);
}).then(function(data) {
    console.log('success:', data);
}, function(data) {
    console.log('error:', data);
});


//只要all里任何遇到 错误,则then不执行resolve 但没有参数, reject只执行一次