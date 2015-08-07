(function () {
    'use strict';

    function Search(config) {
        var self = this;

        /**
         * 缓存数据对象
         * @type {Object}
         */
        self.__data = {};

        /**
         * 配置参数
         * @type {Object}
         */
        self.__config = $.extend({}, Search.defaults, config || {});

        /**
         * 异步请求Ajax对象
         * @type {Ajax}
         */
        self.__xhr = null;
    }

    /**
     * 配置配置参数
     * @type {Object}
     */
    Search.defaults = {
        // 请求前回调
        beforeSend: $.noop,
        // 完成回调
        complete: $.noop,
        // 成功回调
        success: $.noop,
        // 错误回调
        error: $.noop,
        // 异步接口链接
        url: null,
        // 后端传送数据
        data: {},
        // 返回值类型
        dataType: 'json',
        // 请求方式
        type: 'GET'

    };

    /**
     * 设置参数
     *
     * @param {string} key 参数名
     * @param {string} val 参数值
     * @return {Object} self
     */
    Search.prototype.set = function (key, val) {
        if (val) {
            this.__data[key] = val;
        }
        return this;
    };

    /**
     * 删除参数
     *
     * @param {string} key 参数名
     * @return {Object} self
     */
    Search.prototype.del = function (key) {
        delete this.__data[key];
    };

    /**
     * 获取参数
     *
     * @param {string} key 参数名
     * @return {string} 参数值
     */
    Search.prototype.get = function (key) {
        return this.__data[key];
    };

    /**
     * 发送请求，支持重复发送
     *
     * @return {Object} self
     */
    Search.prototype.request = function () {
        var self = this;
        var config = self.__config;

        // 如果当前有异步请求
        if (self.__xhr) {
            self.__xhr.abort();
        }

        // 执行请求前回调
        config.beforeSend.call(self);

        // 设置新异步请求对象
        self.__xhr = $.ajax({
            data: $.extend(true, {}, config.data, self.__data),
            type: config.type,
            url: config.url,
            dataType: config.dataType,
            error: function (XHR, status) {
                if (XHR && status !== 'abort') {
                    config.error.call(self, XHR, status);
                }
            },
            complete: function () {
                config.complete.call(self);
                if (self.__xhr) {
                    self.__xhr = null;
                }
            },
            success: function (res) {
                config.success.call(self, res);
            }

        });
    };

    window.Search = Search;
})();
