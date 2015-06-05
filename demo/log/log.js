/**
 * 上报日志
 * @author xieliang
 *
 * @example
 *     log.send({
 *         type: 'utm',
 *         param1: 1,
 *         param2: 2,
 *     });
 */

(function() {
    'use strict';

    var log = {};

    /**
     * 日志全局id
     * @type {Number}
     */
    log.guid = 1;

    /**
     * 发送日志请求
     * @param  {object} options 配置参数
     */
    log.send = function(options) {
        var param = '',
            key, img, guid;

        options = options || {};

        //带上来路
        options.referrer = document.referrer;

        //随机数
        options.r = new Date().getTime();

        //这里还可以添加一些别的变量，比如cookie啥的

        for (key in options) {
            if (options.hasOwnProperty(key)) {
                param += encodeURIComponent(key) + '=' + options[key] + '&';
            }
        }

        guid = log.getGuid();

        img = new Image();

        // 这里一定要挂在window下
        // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
        // 导致服务器收不到日志
        window[guid] = img;

        img.onload = img.onerror = img.onabort = function() {
            // 下面这句非常重要
            // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
            // 则在gif动画播放过程中，img会多次触发onload
            // 因此一定要清空
            img.onload = img.onerror = img.onabort = null;

            //GC
            window[guid] = null;

            // 下面这句非常重要
            // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
            // 因此这里一定要置为null
            img = null;
        };

        // 一定要在注册了事件之后再设置src
        // 不然如果图片是读缓存的话，会错过事件处理
        // 最后，对于url最好是添加客户端时间来防止缓存
        // 同时服务器也配合一下传递Cache-Control: no-cache;
        img.src = "http://log.com/c.gif?" + param;

        param = null;
    }

    /**
     * 获取日志全局id
     * @return {string}
     */
    log.getGuid = function() {
        return 'utm_log_' + (log.guid++);
    }

    //暴露
    window.log = log;
})();