/**
 * @file integral
 * @author fe.xiaowu@gmail.com
 */

'use strict';

var Promise = require('es6-promise').Promise;

function Integral() {
    this.__listener = {};
}

Integral.prototype.__getListener = function (type) {
    var listener = this.__listener;
    if (!listener[type]) {
        listener[type] = [];
    }
    return listener[type];
};

/**
 * 绑定事件
 *
 * @param  {string}   name     事件名+空间
 * @param  {Function} callback 回调，返回 promise对象||false||undefined
 * @return {Self}
 *
 * @example
 *     on('login', function(data){
 *         var uid = data.uid;
 *
 *         return new Promise(function(resolve, reject){
 *             setTimeout(function(){
 *                  resolve({});
 *              }, 1000);
 *         })
 *     });
 */
Integral.prototype.on = function (name, callback) {
    var self = this;
    if ('function' === typeof callback) {
        self.__getListener(name).push({
            callback: callback

        });
    }
    return self;
};

/**
 * 卸载事件
 *
 * @param  {string}   name     事件名
 * @param  {Function} callback 回调名或者空
 * @return {Self}
 */
Integral.prototype.off = function (name, callback) {
    var self = this;
    var listeners = self.__getListener(name);
    var i = 0;

    if ('function' === typeof callback) {
        for (; i < listeners.length; i++) {
            if (callback === listeners[i].callback) {
                listeners.splice(i--, 1);
            }
        }
    }
    else {
        listeners.length = i;
    }

    return self;
};

/**
 * 触发事件
 *
 * @param  {string} name 事件名
 * @param  {Object} data 数据
 * @return {Self}
 */
Integral.prototype.trigger = function (name, data) {
    var self = this;
    var listener = self.__getListener(name);
    var arr = [];

    data = data || {};

    // 循环队列，并执行回调，将返回的Promise追回到all上
    listener.forEach(function (val) {
        var fn = val.callback.call(self, data);

        // 如果没有返回值或者为false 则忽略
        if (fn !== void 0 && fn !== false) {
            arr.push(fn);
        }
    });

    return Promise.all(arr);
};




