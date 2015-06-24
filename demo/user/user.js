/**
 * 用户模块
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 * @description 使用iframe+js回调来操作弹出层登录，使用页面href跳转方式操作直接跳转的连接，需要dialog登录页面添加回调
 * @description 登录状态标识需要约定，用户信息需要约定
 */

(function() {
    'use strict';

    /**
     * 大空间
     * @type {object}
     */
    var User = {};

    /**
     * 登录页面url
     * @type {String}
     */
    User.login_url = '/login.html';

    /**
     * 登录页url iframe嵌套方式
     * @type {String}
     */
    User.dialog_login_url = '/login_dialog.html';

    /**
     * 用户状态，0为未登录，非0为已登录
     * @description 这个可以做成用户的类型或者等级
     * @type {Number}
     */
    User.status = 0;

    /**
     * 用户数据
     * @type {Object}
     */
    User.__data = {};

    /**
     * 事件空间
     * @type {Object}
     */
    User.__listeners = {};

    /**
     * 获取事件空间
     * @param  {string} name 事件名
     * @return {array} 事件队列
     */
    User.__getListener = function(name) {
        var listeners = User.__listeners;

        // 防止报错
        if(!name){
            return [];
        }

        // 如果不存在则新建
        if (!listeners[name]) {
            listeners[name] = [];
        }

        return listeners[name];
    }

    /**
     * 初始化
     */
    User.init = function() {
        // 绑定头部状态信息        
        User.on('login', function(/*data*/){
            // $('#topbar').text('欢迎你:'+ data.username);
        }).on('exit', function(){
            // $('#topbar').text('请先登录～');
        });

        // 检查登录标识
        // 读取用户数据
        // try{
        //     var data = JSON.parse(Cookie.get('user_data'));
        //     if(data.status !== 0){
        //         User.__success(data);
        //     } else {
        //         User.__trigger('error');
        //     }
        // } catch(e){
        //     User.__trigger('error');
        // }
    }

    /**
     * 绑定事件
     * @param {string} name 事件名，支持login,exit
     * @param {string} callback 事件回调
     * @return User
     */
    User.on = function(name, callback) {
        if ('function' === typeof callback) {
            User.__getListener(name).push({
                callback: callback
            });
        }
        return User;
    }

    /**
     * 绑定事件（只触发单次）
     * @param {string} name 事件名，支持login,exit
     * @param {string} callback 事件回调
     * @return User
     */
    User.one = function(name, callback) {
        // 内部方法，为了卸载
        var __call = function() {
            //卸载
            User.off(name, __call);

            // 执行回调
            if ('function' === typeof callback) {
                callback.apply(User, [].slice.call(arguments));
            }
        }

        return User.on(name, __call);
    }

    /**
     * 卸载事件
     * @param  {string}   name     事件名
     * @param  {Function|undefined} callback 事件句柄，如果空则卸载全部事件
     * @return User
     */
    User.off = function(name, callback) {
        var listeners = User.__getListener(name),
            i;

        if ('function' === typeof callback) {
            for (i = 0; i < listeners.length; i++) {
                if (callback === listeners[i].callback) {
                    listeners.splice(i--, 1);
                }
            }
        } else {
            listeners.length = 0;
        }

        return User;
    }

    /**
     * 内部触发事件
     * @param {string} name 事件名
     */
    User.__trigger = function(name) {
        var listeners = User.__getListener(name),
            i, len;

        // 如果队列为空
        if (!listeners.length) {
            return User;
        }

        // 执行队列
        i = 0;
        len = listeners.length;
        for(i = 0, len = listeners.length; i<len; i++){
            if(listeners[i].callback.call(User, User.__data) === false){
                break;
            }
        }
    }

    /**
     * 检查是否登录
     * @return {boolean} 登录状态
     */
    User.check = function(){
        return User.status !== 0;
    }

    /**
     * 登录回调
     * @param {function|object} option 回调或者配置对象
     * @param {function} option.callback 登录后回调
     * @param {boolean=true} option.dialog 是否为弹出层打开
     * @param {string=请先登录} option.title 弹出层打开的标题
     */
    User.login = function(option){
        // 如果为方法则为回调
        if('function' === typeof option){
            option = {
                callback : option
            }
        }

        // 容错
        option = option || {};

        // 默认弹出层
        if('undefined' === typeof option.dialog){
            option.dialog = true;
        }

        //容错
        if('function' !== option.callback){
            option.callback = function(){};
        }

        // 如果已登录
        if(User.check()){
            option.callback.call(User, User.__data);
            return User;
        }

        // 如果不是弹出层方式
        if(!option.dialog){
            location.href = User.login_url;
            return User;
        }

        // 弹出层已经在打开状态
        if(User.__open){
            return User;
        }

        // 打上打开标识
        User.__open = true;

        // 写入回调
        User.__callback = option.callback;

        //这里是创建弹出层iframe到页面中，弹出层登录成功回调 User.__success(user_data);

        return User;
    }

    /**
     * 退出
     * @return {[type]} [description]
     */
    User.exit = function(){
        User.status = 0;
        User.__data = {};
        return User;
    }

    /**
     * 执行回调 - 成功
     */
    User.__success = function(res){
        res = res || {};

        // 用户标识
        User.status = res.status || 1;

        // 写入数据
        User.__data = res;

        // 执行登录成功回调
        User.__trigger('login');
    }

    User.init();

    /**
     * 尽情的暴露吧
     */
    window.User = User;
})();