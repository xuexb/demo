// node
'use strict';
var request = require('request-regexp');
var Promise = require('es6-promise').Promise;

var arr = [];
var length = 300;

var get = function () {
    return new Promise(function (resolve, reject) {
        request({
            url: 'http://fly.layui.com/login/',
            encoding: 'utf8', // 如果是gb2312编码 
            regexp: { // 一个正则对象 
                code: '<label for="vercode">人类验证：</label> <span class="layui-form-text">(.+?)</span>'

            }

        }, function (error, response, body) {
            if (error) {
                reject(error.message);
            }
            else {
                resolve(body); // body为解析正则后的数组 
            }
        });
    });
};

console.log('loading');
new Array(length).join('1,1').split(',').forEach(function () {
    arr.push(get());
});

Promise.all(arr).then(function(res){
    var hash = {};

    res = res.map(function(val){
        return {
            code: val.code[0][0],
        }
    }).filter(function(val){
        if(hash[val.code]){
           return false; 
        } else {
            hash[val.code] = 1;
            return true;
        }
    });
    console.log(res);
}).catch(function(err){
    console.log(err);
});
