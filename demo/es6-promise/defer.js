/**
 * promise的相关操作
 * @author xieliang
 */

'use strict';

var Promise = require('es6-promise').Promise;

var getDefer = function() {
    var defer = {};
    defer.promise = new Promise(function(resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
    });

    return defer;
}

function ajax() {
    var defer = getDefer();
    //做点什么异步的事情
    //结束的时候调用 defer.resolve，比如：
    setTimeout(function() {
        defer.resolve('成功'); //这里才是真的返回
    }, 1000)

    return defer.promise;
}

ajax().then(function(data) {
    console.log(data);
}).then(function(data) {
    console.log(data);
});