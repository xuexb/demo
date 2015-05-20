/**
 * 桌面提醒
 * @description 只支持 谷歌,火狐,360Chrome模式, 在不支持的浏览器不做任何处理, 
 *              如果是cmd/amd请根据自己的需求打包, 会在页面加载时会请求用户授权, 如果已授权或者拒绝的跳过
 * @author guoliang && xieliang
 *
 * @example
 *     1, new notification("我是标题");
 *     2, notification("我是标题");//new不new都一样, 但我希望你new
 *     3, new notification("我是标题", "我是内容");
 *     4, new notification("我是标题", {icon: 'icon地址'});
 *     5, var a = new notification("我是标题", {
 *                 onclick: function(){}, 
 *                 onshow: function(){}, 
 *                 onclose: function(){}
 *            });     外部关闭a.close();
 *     6, new notification("我是标题", {time: 3000});//自动关闭
 */
;(function(window) {
    'use strict';

    var Notification = window.Notification,
        support = !!Notification,
        noop = function() {},
        request,
        Class;


    //如果支持
    if (support && Notification.permission === 'default') {
        document.addEventListener('click', request = function() {
            Notification.requestPermission();

            //卸载事件
            document.removeEventListener('click', request);
            request = null;
        }, false);
    }



    // 构造函数
    Class = function(options, content) {
        var self = this,
            temp;



        //('title')
        if ('string' === typeof options) {
            if ('string' === typeof content) { //(title, content)
                options = {
                    title: options,
                    body: content
                }
            } else if ('object' === typeof content) { //(title, {})
                temp = options;
                options = content;
                options.title = temp;
            } else if ('number' === typeof content) {
                options = {
                    title: options,
                    time: content
                }
            } else {
                options = {
                    body: options
                }
            }
        } else {
            options = Object.prototype.toString.call(options) === '[object Object]' ? options : {};
        }


        for (temp in Class.defaults) {
            options[temp] = options[temp] || Class.defaults[temp];
        }


        //创建实例
        temp = self.__Obj = new Notification(options.title, options);


        //添加事件
        temp.onclick = options.onclick;
        temp.onshow = options.onshow;
        temp.onclose = function() {
            delete self.__Obj;
            options.onclose.call(this);
        }


        //如果有定时器
        if (options.time) {
            setTimeout(function() {
                self.close();
            }, options.time);
        }

        return self;
    }


    //如果不支持 ~_~   或者已禁用
    if (!support || Notification.permission === 'denied') {
        Class = function(){}
    }

    /**
     * 关闭
     */
    Class.prototype.close = function() {
        var self = this;
        if (self.__Obj) {
            self.__Obj.close();
        }
        return self;
    }

    // 默认参数
    Class.defaults = {
        title: '提示',
        body: '内容',
        // 标签类别
        tag: '',
        // 通知图标
        icon: 'http://static.easywed.cn/dist/images/lib/logo-60-40.png',
        // 显示通知
        onshow: noop,
        // 关闭通知
        onclose: noop,
        // 单击通知
        onclick: noop,
        time: 3000 //s
    }


    //如果是cmd||amd
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return Class;
        });
    } else {
        window.notification = Class;
    }

}(window));