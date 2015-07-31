/**
 * @file 360缓存模拟
 * @author xiaowu
 * @email fe.xiaowu@baidu.com
 */

(function (window, document) {
    'use strict';

    /**
     * 暴露空间
     * @type {Object}
     */
    var cache = window.cache = {
        set: function () {},
        get: function () {}

    };

    /**
     * 别名
     * @type {Object}
     */
    var cname = {
        js: 'script',
        css: 'style'

    };

    /**
     * 写入cookie
     *
     * @param  {string} key   名
     * @param  {string} value 值
     */
    var setcookie = function (key, value) {
        var expires;
        var date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        expires = '; expires=' + date;
        document.cookie = key + '=' + encodeURIComponent(value) + ';domain=' + document.domain + expires;
    };

    /**
     * 使用数据插入到页面head中
     *
     * @param  {string} tagName 标签名
     * @param  {string} data    数据
     */
    var append = function (tagName, data) {
        var div = document.createElement(tagName);
        div.innerHTML = data;
        document.head.appendChild(div);
        div = null;
    };

    /**
     * 读取缓存并写入到页面中
     *
     * @param  {string} id   缓存id
     * @param  {string} type 缓存类型，有js,css
     */
    var cache2html = function (id, type) {
        var data = localStorage[id];

        if (!data) {
            return;
        }

        append(cname[type], data);
    };

    /**
     * 写入缓存
     *
     * @param  {string} id 元素id
     */
    var html2cache = function (id) {
        var elem = document.getElementById(id);

        if (!elem) {
            return;
        }

        setcookie(id, '1');

        localStorage[id] = elem.innerHTML.trim();
    };

    // 如果支持缓存
    try {
        if (window.localStorage) {
            cache.get = cache2html;
            cache.set = html2cache;
        }
    }
    catch (e) {}
})(window, document);
