/**
 * @file 移动端滑动插件，支持左右滑动
 * @author xieyaowu
 * @email xieyaowu@baidu.com
 *
 * @example
 *     html: #demo>ul>li*n
 *     js: new Swipe({elem: '#demo', change: function(){}});
 *     css:
 *         #demo { overflow: hidden; }
 *         #demo ul { overflow: hidden; max-height:xxx; backface-visibility: hidden; perspective: 1000; }
 *         #demo ul li { vertical-align: top; width: 100%; float:left; }
 *     说明:
 *         该插件不集成css
 *         li为纵向排列，js控制ul的X轴来滑动
 *         为了更好的用户体验，且保持在加载js前页面排版不变形，需要设置ul的最大高并益出隐藏，设置li为宽100%，并左浮动，这样可以
 *         保证加载前不变形，然后插件会在初始化时设置ul为10000px以让li可纵型排列
 *         如果页面分页不够时建议不加载js初始化
 */

/* global $ */

(function () {
    'use strict';

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
        self.index = config.index;

        self.__guid = guid++;

        // 当前滚动的宽，这个宽会在resize的时候初始
        self.__width = self.$wrap.width();

        // 设置很大，为的是让li纵型排列
        self.$inner.width(10000);

        // 设置内容宽
        self.$item.width(self.__width);

        self.__bindTouch();

        // 变化窗口时重置宽
        $window.on('resize.swipe' + self.__guid, function () {
            self.resetWidth();
        });
    }

    /**
     * 重置宽，在窗口resize的时候自动调用，如果页面有变形可手动调用该接口，会判断必须滑屏在可见时才算
     *
     * @return {Object} self
     */
    Swipe.prototype.resetWidth = function () {
        var self = this;

        var width = self.$wrap.width();

        // 如果不可见
        // 这里是Zepto的判断，如果为jquery则为is(':hidden')
        if (width === 0) {
            return self;
        }

        self.__width = width;

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
     * 上一页，目前如果小于0 则＝0
     *
     * @return {Object} self
     */
    Swipe.prototype.prev = function () {
        return this.to(this.index - 1);
    };

    /**
     * 下一页，目前不可超出最大页
     *
     * @return {Object} self
     */
    Swipe.prototype.next = function () {
        return this.to(this.index + 1);
    };

    /**
     * 设置到第几页
     *
     * @description 如果不传参则直接移动到当前索引，常用于resize时重围位置、初始化时设置默认位置
     * @param  {number} index 索引
     * @param  {number} speed 速度
     * @return {Object} self
     */
    Swipe.prototype.to = function (index, speed) {
        var self = this;
        var length = self.length;

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
            index = self.index;
            speed = 0;
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
        if ('function' === typeof self.__config.change) {
            self.__config.change.call(self, index, length);
        }

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
        // change回调, 参数1为index,参数2为length,this指向当前实例
        change: function () {},
        // 滑屏包裹容器，支持string,elem,Zepto
        elem: null,
        // 动画展现时间，单位ms
        speed: 300,
        // 默认索引，如果不为0可在实例化后调用.to()方法移动到该索引位置
        index: 0
    };

    // 对外暴露
    var A = window.A;
    if (!A) {
        A = window.A = {};
    }
    A.ui = A.ui || {};
    A.ui.swipeXW = Swipe;
})();
