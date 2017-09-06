/**
 * @file 公用的按钮处理
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

(function ($) {
    'use strict';

    /**
     * 按钮构造函数
     *
     * @class
     * @param {Object} options 配置对象
     */
    function Btn(options) {
        var self = this;

        // 合并配置
        self.__config = $.extend(true, {}, Btn.defaults, options || {});

        self.$elem = $(self.config('elem'));

        if (!self.$elem.length) {
            throw new Error('选择器错误');
        }

        self.__xhr = null;

        self.__ing = null;

        self.__disabled = false;

        self.bind();
    }

    /**
     * 状态码
     * @type {Object}
     */
    Btn.status = {
        SUCCESS: 0, // 请求成功
        SUCCESS_ERROR: 1, // success返回false阻止
        CALLBACK_ERROR: 2, // 返回值出错
        ABORT: 3 // 用户主动取消

    };

    /**
     * 禁用
     *
     * @return {self}
     */
    Btn.prototype.disable = function () {
        var self = this;

        if (self.__disabled) {
            return self;
        }

        self.__disabled = true;

        self.$elem.addClass('disabled').prop('disabled', true);

        return self;
    };

    /**
     * 启用
     *
     * @return {self}
     */
    Btn.prototype.enable = function () {
        var self = this;

        if (!self.__disabled) {
            return self;
        }

        self.__disabled = false;

        self.$elem.removeClass('disabled').prop('disabled', false);

        return self;
    };

    /**
     * 设置文本的值
     *
     * @param  {string} text 要设置的值
     * @return {self}
     */
    Btn.prototype.text = function (text) {
        var self = this;

        if (!text) {
            return self;
        }

        self.$elem.each(function () {
            var $that = $(this);
            var type = this.nodeName.toLowerCase();

            if (type === 'button' || type === 'a') {
                $that.find('span').text(text);
            }

        });

        return self;
    };

    /**
     * 发送请求
     *
     * @return {self}
     */
    Btn.prototype.request = function () {
        var self = this;
        var config = self.config();
        var status = Btn.status.CALLBACK_ERROR;

        // 如果正在请求
        // 如果已禁用
        if (self.__ing || self.__disabled) {
            return self;
        }

        // 如果不请求
        if (config.beforeSend.call(self) === false) {
            return self;
        }

        // 中断之前的
        self.abort();

        self.__ing = true;

        // loading状态
        self.$elem.addClass('loading');

        // 创建新的
        self.__xhr = $.ajax({
            url: config.url,
            dataType: config.dataType,
            data: config.data,
            success: function (res) {
                if (res) {
                    status = config.success.call(self, res) === false
                    ? Btn.status.SUCCESS_ERROR
                    : Btn.status.SUCCESS;
                }

            },
            error: function (XHR, status) {
                if (XHR && status === 'abort') {
                    status = Btn.status.ABORT;
                }

            },
            complete: function () {
                // 只有在返回值错误才走error方法
                if (status === Btn.status.CALLBACK_ERROR) {
                    config.error.call(self);
                }

                self.$elem.removeClass('loading');
                self.__ing = false;

                // 执行完成方法
                config.complete.call(self, {
                    status: status

                });
            }

        });

        return self;
    };

    /**
     * 绑定事件
     *
     * @return {self}
     */
    Btn.prototype.bind = function () {
        var self = this;

        if (self.__bind) {
            return self;
        }

        self.__bind = true;

        self.$elem.on('click.btn', function () {
            self.request();
            return false;
        });

        return self;
    };

    /**
     * 取消事件
     *
     * @return {self}
     */
    Btn.prototype.unbind = function () {
        var self = this;

        if (!self.__bind) {
            return self;
        }

        delete self.__bind;

        self.$elem.off('click.btn');

        return self;
    };

    /**
     * 取消请求
     *
     * @return {self}
     */
    Btn.prototype.abort = function () {
        var self = this;

        if (self.__xhr) {
            self.__xhr.abort();
        }

        return self;
    };

    /**
     * 获取/设置配置
     *
     * @date   2015-10-13
     *
     * @param  {string}   key 名称
     * @param  {string}   val 值
     *
     * @return {Object|self}
     */
    Btn.prototype.config = function (key, val) {
        var self = this;
        var config = self.__config;

        // 如果没有参数则为获取
        if (!key) {
            return config;
        }

        if (val === void 0) {
            return config[key];
        }

        // 如果是对象,则与旧的参数合并
        if ($.isPlainObject(val)) {
            config[key] = $.extend(true, {}, config[key] || {}, val);
        }
        else {
            config[key] = val;
        }

        return self;
    };

    /**
     * 默认配置
     *
     * @type {Object}
     */
    Btn.defaults = {
        elem: null,
        success: $.noop,
        error: $.noop,
        beforeSend: $.noop,
        complete: $.noop,
        dataType: 'json'

    };

    window.Btn = Btn;
})(jQuery);
