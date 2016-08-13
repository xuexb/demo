/**
 * @file 提示层 - loading
 * @author fe.xiaowu@gmail.com
 * @example
 *     显示加载层: loading.show();
 *     隐藏加载层: loading.hide();
 */

define(function (require) {
    'use strict';

    var Tips = require('./index');

    // 获取当前的loading对象
    var cache = null;

    // 加载样式
    require('css!./loading.css');

    /**
     * 显示
     *
     * @param  {string} content 显示的字符串
     *
     * @return {Object}         loading对象
     */
    function loading(content) {
        loading.hide();

        cache = new Tips({
            time: null,
            lock: true,
            content: content || '数据加载中',
            className: 'zui-tips-loading'
        });

        return loading;
    }

    loading.show = loading;

    /**
     * 隐藏loading层
     *
     * @return {Object} loading对象
     */
    loading.hide = function () {
        if (cache) {
            cache.close();
            cache = null;
        }
        return loading;
    };

    return loading;
});
