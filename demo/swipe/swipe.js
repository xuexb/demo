/**
 * @file 滑动组件,只支持左右缓冲滑动，支持change事件
 * @author xieyaowu
 * @email xieyaowu@baidu.com
 *
 * @example
 *     html: #demo>ul>li
 *     js: new Swipe({elem: '#demo', end: function(){}});
 *     css:
 *         #demo{ overflow: hidden; }
 *         #demo ul { width: 100000px; backface-visibility: hidden; perspective: 1000; }
 *         #demo ul li { display: table-cell; vertical-align: top; width: 2000px; }
 *     说明:
 *         设置li宽是为了页面加载js前不变形，因为页面resize的时候js会动态设置li的宽，
 *         如果只是一页建议不初始化js，可设置li,ul为display:block;width:100%;
 *         页面默认展示请使用php循环直接显示，更友好
 */

/* global $ */

var Swipe = (function () {
    // 'use strict';

    var guid = 0;
    var $window = $(window);

    function Swipe(config) {
        var self = this;

        // 合并默认配置
        self.__config = config = $.extend(true, {}, Swipe.defaults, config || {});

        self.$wrap = $(config.elem);

        self.$inner = self.$wrap.children().eq(0);

        self.$item = self.$inner.children();

        self.length = self.$item.length;

        // 当前显示的索引
        self.index = null;

        self.__guid = guid++;

        // 当前滚动的宽，这个宽会在resize的时候初始
        self.__width = self.$wrap.width();

        // 设置内容宽
        self.$item.width(self.__width);

        self.__bindTouch();

        // 变化窗口时重置宽
        $window.on('resize.swipe' + self.__guid, function () {
            self.resetWidth();
        });
    }

    /**
     * 重置宽
     *
     * @return {Object} self
     */
    Swipe.prototype.resetWidth = function () {
        var self = this;

        self.__width = self.$wrap.width();

        self.$item.width(self.__width);

        return self.to();
    };

    /**
     * 绑定touch事件
     */
    Swipe.prototype.__bindTouch = function () {
        var self = this;
        var scrollY;
        var startX;
        var startY;
        var distX;
        var distY;
        var move;
        var end;

        self.$wrap.on('touchstart.swipe' + self.__guid, function (event) {
            var point = event.touches[0];
            startX = point.pageX;
            startY = point.pageY;

            distX = 0;
            scrollY = void 0;

            // 添加“触摸移动”事件监听
            self.$wrap[0].addEventListener('touchmove', move, false);
            // 添加“触摸结束”事件监听
            self.$wrap[0].addEventListener('touchend', end, false);
        });

        // 触摸移动函数
        move = function (event) {
            var point = event.touches[0];
            var index = self.index;

            // 偏移
            distX = point.pageX - startX;
            distY = point.pageY - startY;

            if (scrollY === void 0) {
                scrollY = Math.abs(distY) > Math.abs(distX) ? 1 : 0;
            }

            // 如果不是上下滑动
            if (scrollY !== 1) {
                event.preventDefault();

                if ((index === 0 && distX > 0) || (index >= self.length - 1 && distX < 0)) {
                    distX *= 0.4;
                }

                // 动画
                self.__anim(-index * self.__width + distX, 0);
            }
        };

        // 触摸结束函数
        end = function () {
            if (scrollY !== true) {
                if (Math.abs(distX) > self.__width / 6) {
                    self[distX > 0 ? 'prev' : 'next']();
                }
                else {
                    self.to(self.index);
                }
            }

            self.$wrap[0].removeEventListener('touchmove', move, false);
            self.$wrap[0].removeEventListener('touchend', end, false);
        };
    };

    /**
     * 动画滚动
     *
     * @param  {number} dist  距离
     * @param  {number} speed 速度
     */
    Swipe.prototype.__anim = function (dist, speed) {
        var css = this.$inner[0].style;

        // css.webkitTransitionDuration = css.transitionDuration = speed + 'ms';
        // css.webkitTransform = css.transform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';

        // GPU加速
        css.webkitTransition = css.transition = speed + 'ms ease-out';
        css.webkitTransform = css.transform = 'translate3d(' + dist + 'px, 0, 0)';
    };

    /**
     * 上一页
     *
     * @return {Object} self
     */
    Swipe.prototype.prev = function () {
        return this.to('prev');
    };

    /**
     * 下一页
     *
     * @return {Object} self
     */
    Swipe.prototype.next = function () {
        return this.to('next');
    };

    /**
     * 设置到第几页
     *
     * @param  {number} index 索引
     * @param  {number} speed 速度
     * @return {Object} self
     */
    Swipe.prototype.to = function (index, speed) {
        var self = this;
        var length = self.length;
        var oldIndex = self.index;

        // 如果没有内容
        if (length < 1) {
            return self;
        }

        // 如果没有传速度参数才获取
        if (speed === void 0) {
            speed = self.__config.speed;
        }

        // 如果没有则默认为直接跳转默认索引
        if (index === void 0) {
            index = oldIndex;
            speed = 0;

            // 处理next,prev的情况
        }
        else if ('string' === typeof index) {
            if (index === 'next') {
                index = oldIndex + 1;
            }
            else if (index === 'prev') {
                index = oldIndex - 1;
            }
        }
        else {
            index = parseInt(index, 10) || 0;
        }

        // 判断是否需要循环
        if (index < 0) {
            index = 0;
        }
        else if (index > length - 1) {
            index = length - 1;
        }

        self.index = index;

        // 动画
        self.__anim(-index * self.__width, speed);

        // 触发change事件
        self.__config.change.call(self, index, length);

        return self;
    };

    /**
     * 销毁
     *
     * @return {Object} self
     */
    Swipe.prototype.destroy = function () {
        var key;
        var self = this;

        // 注销事件
        $window.off('resize.swipe' + self.__guid);
        self.$wrap.off('touchstart.swipe' + self.__guid);

        for (key in self) {
            if (self.hasOwnProperty(key)) {
                delete self[key];
            }
        }

        return self;
    };

    /**
     * 配置参数
     * @type {Object}
     */
    Swipe.defaults = {
        // change回调
        change: $.noop,
        // 容器
        elem: null,
        // 时间
        speed: 300
    };

    return Swipe;
})();
