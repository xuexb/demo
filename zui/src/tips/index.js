/**
 * @file 提示层
 * @author fe.xiaowu@gmail.com
 *
 * @events
 *     show - 提示层显示后事件
 *     close - 提示层关闭（销毁dom）后事件
 *     destroy - 提示层销毁后事件
 */

define(function (require) {
    'use strict';

    var $ = require('zepto');
    var Zui = require('zui');

    // 加载样式
    require('css!./index.css');

    var Tips = Zui.extend({

        /**
         * 构造函数
         *
         * @param {Object|string} options 配置对象或者显示字符串
         */
        constructor: function (options) {
            var self = this;
            var $inner;

            // 如果值为一个字符串，则认为这是一个内容
            if ('string' === typeof options) {
                options = {
                    content: options
                };
            }

            // 初始化
            Tips.super.constructor.call(self, Tips.defaults, options);

            self.$wrap = $('<div />').addClass('zui-tips-wrap');

            $inner = $('<div />').css({
                transform: 'translate(-50%, -50%) scale3d(1.3, 1.3, 1)'
            }).addClass('zui-tips-inner ' + self.get('className')).text(self.get('content'));

            // 如果要锁屏
            if (self.get('lock') === true) {
                self.$wrap.addClass('zui-tips-wrap-mask');
            }

            // 把dom插入到页面中
            self.$wrap.append($inner).appendTo('body');

            $inner.animate({
                transform: 'translate(-50%, -50%) scale3d(1, 1, 1)',
                opacity: 1
            }, self.get('duration'), 'ease', function () {
                // 如果有自动关闭，则延迟关闭
                if (self.get('time')) {
                    self._timer = setTimeout(self.close.bind(self), self.get('time'));
                }

                self.trigger('show');
            });

            $inner = null;
        },

        /**
         * 关闭
         *
         * @return {Object} this
         */
        close: function () {
            var self = this;

            // 如果已经关闭
            if (self.is('close')) {
                return self;
            }

            // 打上标识
            self.is('close', true);

            // 如果有延迟时间，则清除，防止自动关闭和手动冲突
            if (self._timer) {
                clearTimeout(self._timer);
                delete self._timer;
            }

            self.$wrap.find('.zui-tips-inner').animate({
                transform: 'translate(-50%, -50%) scale3d(0.7, 0.7, 1)',
                opacity: 0
            }, self.get('duration'), 'ease', function () {
                self.$wrap.remove();

                self.trigger('close destroy');
            });

            return self;
        }
    });

    /**
     * 配置参数
     *
     * @type {Object}
     * @param {boolean} options.lock 是否锁定屏幕
     * @param {number|null} [options.time=2000] 自动关闭时间，如果为null则不自动关闭
     * @param {string} options.className 自定义样式名
     */
    Tips.defaults = {
        time: 2000,
        content: 'loading',
        lock: true,
        className: 'zui-tips-default',
        duration: 200
    };

    return Tips;
});
