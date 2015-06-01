/**
 * promise的相关操作
 * @author xieliang
 */

'use strict';

var Promise = require('es6-promise').Promise;

//成功例子
new Promise(function(resolve, reject) {
    //做点什么异步的事情
    //结束的时候调用 resolve，比如：
    setTimeout(function() {
        resolve({
            str: '成功'
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
    console.log('success', data);//因为前者没有return

    return 'xx';
}).then(function(data) {
    console.log('success', data);//因为前者没有return
}).catch(function(e){
    console.log(e);
});

//成功回调支持链式,只要上个有return后者都能拿到数据