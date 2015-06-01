/**
 * promise的相关操作
 * @author xieliang
 */

'use strict';

var Promise = require('es6-promise').Promise;

//失败
new Promise(function(resolve, reject) {
    //做点什么异步的事情
    //结束的时候调用 resolve，比如：
    setTimeout(function() {
        reject({
            str: '失败'
        }); //这里才是真的返回
    }, 1000)
}).then(function(data) {
    console.log('success', data);
    return {
        str: '成功2'
    }
}).then(function(data) {
    console.log('success', data);
}).then(function(data) {
    console.log('success', data);
}, function(data){
    console.log('error', data);
    return data;
}).catch(function(data){
    console.log('catch', data);
    return '';
}).catch(function(data){
    console.log('catch', data);
    return '';
});

//失败只执行一次,即使再return也不行