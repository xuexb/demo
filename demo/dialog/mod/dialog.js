/**
 * 弹出导
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 *
 * @description 内部方法以 __ 开头，标识类以 _ 开头
 *              ie7+
 *              提供事件驱动（`show`,`hide`,`close`）
 *              提供内部元素接口
 *              按钮支持多状态
 */

/* global $ */

(function () {
    'use strict';

    var $window = $(window),
        $document = $(document),
        Prefix = 'ui-dl-',
        is_animate = !!window.addEventListener,
        guid = 0;

    function Dialog(config, ok, cancel) {
        var self = this;

        // 如果第一个参数为str
        if ('string' === typeof config) {
            config = {
                content: config
            }
        }

        // 合并默认配置
        config = $.extend(true, {}, Dialog.defaults, config || {});

        //如果参数的button不是数组则让其为数组，因为后面要进行push操作追加
        if (!$.isArray(config.button)) {
            config.button = [];
        }

        // 确定按钮
        if (ok !== undefined) {
            config.ok = ok;
        }

        // 如果有确认按钮则追加到button数组里
        if (config.ok) {
            config.button.push({
                id: 'ok',
                value: config.okValue,
                callback: config.ok,
                focus: true, //确认按钮默认为聚焦状态
                light: true //高亮
            });
        }

        // 取消按钮
        if (cancel !== undefined) {
            config.cancel = cancel;
        }

        //如果有取消按钮则追加到button数组里
        if (config.cancel) {
            config.button.push({
                id: 'cancel',
                value: config.cancelValue,
                callback: config.cancel
            });
        }

        // 更新 zIndex 全局配置
        Dialog.defaults.zIndex = config.zIndex;

        // 写入配置
        self.__config = config;

        /**
         * jquery缓存空间
         * @type {Object}
         */
        self.__jquery = {};

        /**
         * 事件空间
         * @type {Object}
         */
        self.__listeners = {};

        // 创建骨架到页面，但是看不到类
        self.__create();

        // 如果是iframe
        if (config.url) {
            // 添加类名
            self.find('wrap').addClass(Prefix + 'iframe');

            // 清空填充
            self.find('content').css('padding', 0);

            // 创建iframe
            self.__jquery.iframe = $('<iframe />')
                .attr({
                    src: config.url,
                    allowtransparency: 'yes',
                    scrolling: config.iframeScroll ? 'yes' : 'no' //ie7下有滚动条
                }).on('load', function () {
                    self.iframeAuto();
                });

            // 设置到页面
            self.content(self.find('iframe'));

            // 绑定关闭时清空
            self.on('close', function () {
                // 重要！需要重置iframe地址，否则下次出现的对话框在IE6、7无法聚焦input
                // IE删除iframe后，iframe仍然会留在内存中出现上述问题，置换src是最容易解决的方法
                this.find('iframe').attr('src', 'about:blank').remove();
            });
        }

        self.button.apply(self, config.button) //设置按钮
            .time(config.time) //设置时间
            .title(config.title) //设置标题
            .width(config.width, true) //设置宽
            .height(config.height, true) //设置高
            .position(); //定位

        // 如果支持动画则添加css3类让其动画显示出来
        if (is_animate) {
            self.on('show', function () {
                //强制重排
                $.noop(self.find('wrap').get(0).offsetWidth);
                self.find('wrap').addClass(Prefix + 'show');
            }).on('hide', function () {
                this.find('wrap').removeClass(Prefix + 'show');
            });

            //覆盖方法
            // $.each(['hide', 'close'], function (index, val) {
            //     var _that = self[val];
            //     self[val] = function () {
            //         self.find('wrap').addClass(Prefix + 'hide');
            //         clearTimeout(self._closetime);
            //         self._closetime = setTimeout(function () {
            //             _that.call(self);
            //         }, 300);
            //         return self;
            //     }
            // });
        }

        // 绑定关闭事件
        self.find('close').on('click', function () {
            return !self.close();
        });

        // 绑定点击层的时候置顶
        self.find('wrap').on('mousedown', function () {
            self.zIndex();
        });

        // 绑定按钮组事件，禁用和loading不可点
        self.find('buttons').on('click', 'a', function () {
            var that = this,
                fn;

            // 如果禁用或者加载中
            if (that.className.indexOf('disabled') > -1 || that.className.indexOf('loading') > -1) {
                return false;
            }

            // 找到这个按钮的回调
            fn = self.__listeners[$(that).data('id')];

            // 如果回调里返回false则不关闭 或者直接设置false
            if (fn) {
                if (fn.callback === false || ($.isFunction(fn.callback) && fn.callback.call(self) === false)) {
                    return false;
                }
            }

            return !self.close();
        });

        // 显示/隐藏
        self[config.visible ? 'show' : 'hide']();

        // 如果锁屏
        if (config.lock) {
            self.lock();
        }

        //设置全局id
        self._guid = ++guid;

        // 绑定resize定位，这里不用cache是因为jquery触发resize本来就是队列形式，所有没有全局cache
        $window.on('resize.dialog-' + guid, function () {
            self.position();
        });
    }

    /**
     * iframe自适应
     * @return self
     */
    Dialog.prototype.iframeAuto = function () {
        var self = this,
            config = self.__config,
            $iframe = self.find('iframe'),
            test;

        if ($iframe.length && (config.width === 'auto' || config.height === 'auto')) {
            try {
                // 跨域测试
                test = $iframe[0].contentWindow.frameElement;
            }
            catch (e) {}

            if (test) {

                if (config.width === 'auto') {
                    self.width($iframe.contents().width());
                }
                if (config.height === 'auto') {
                    self.height($iframe.contents().height());
                }
            }
        }
        return self;
    }

    /**
     * 设置内容
     * @param  {string|dom} message 内容
     * @return self
     */
    Dialog.prototype.content = function (message) {
        this.find('content').html(message); //设置内容不解释
        return this.position();
    }

    /**
     * 置顶
     * @return self
     */
    Dialog.prototype.zIndex = function () {
        var self = this,
            zIndex = Dialog.defaults.zIndex + 2;

        self.find('wrap').css('zIndex', zIndex);

        if (self.__jquery.mask) {
            self.find('mask').css('zIndex', zIndex - 1);
        }

        // 重置到默认，让以后弹的层都在其之上
        Dialog.defaults.zIndex = zIndex;

        return self;
    }

    /**
     * 绑定事件
     * @param {string} name 事件名，支持hide,show,close
     * @param {function|boolean} callback 事件回调
     * @return self
     */
    Dialog.prototype.on = function (name, callback) {
        this.__getListener(name).push({
            callback: callback === true ? function () {
                return true;
            } : callback === false ? function () {
                return false;
            } : $.isFunction(callback) ? callback : function () {}
        });
        return this;
    }

    /**
     * 绑定事件（只触发单次）
     * @param {string} name 事件名，支持hide,show,close
     * @param {function|boolean} callback 事件回调
     * @return self
     */
    Dialog.prototype.one = function (name, callback) {
        // 内部方法，为了卸载
        var fn;
        fn = callback === true ? true : callback === false ? false : 'function' === typeof callback ? function () {
            //卸载
            this.off(name, fn);

            // 执行回调
            callback.apply(this, [].slice.call(arguments));
        } : null;

        return this.on(name, fn);
    }

    /**
     * 卸载事件
     * @param  {string}   name     事件名
     * @param  {Function|undefined} callback 事件句柄，如果空则卸载全部事件
     * @return self
     */
    Dialog.prototype.off = function (name, callback) {
        var listeners = this.__getListener(name),
            i;

        if ('function' === typeof callback) {
            for (i = 0; i < listeners.length; i++) {
                if (callback === listeners[i].callback) {
                    listeners.splice(i--, 1);
                }
            }
        }
        else {
            listeners.length = 0;
        }

        return this;
    }

    /**
     * 内部触发事件
     * @param {string} name 事件名
     */
    Dialog.prototype.__trigger = function (name) {
        var listeners = this.__getListener(name),
            i, len, mark;

        // 如果队列为空
        if (!listeners.length) {
            return this;
        }

        // 执行队列
        i = 0;
        len = listeners.length;
        for (i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i].callback.call(this) === false) {
                mark = false;
                break;
            }
        }

        return mark;
    }

    /**
     * 获取事件空间
     * @param  {string} name 事件名
     * @return {array} 事件队列
     */
    Dialog.prototype.__getListener = function (name) {
        var listeners = this.__listeners;

        // 防止报错
        if (!name) {
            return [];
        }

        // 如果不存在则新建
        if (!listeners[name]) {
            listeners[name] = [];
        }

        return listeners[name];
    }

    /**
     * 按钮
     * @example
     *     ({id:'',name:'',callback:noop},{})
     * @return self
     */
    Dialog.prototype.button = function () {
        var self = this,
            buttons = self.find('buttons')[0], //dom下
            callback = self.__listeners, //0000事件空间
            ags = [].slice.call(arguments);

        var i = 0,
            val, value, id, isNewButton, button, className;

        for (; i < ags.length; i++) {

            val = ags[i]; //当前的按钮对象

            id = val.id || value; //找到id

            value = val.value || (callback[id] && callback[id].value) || '确定'; //如果没有设置value

            isNewButton = !callback[id]; //是否已经存在
            button = isNewButton ? document.createElement('a') : callback[id].elem; //如果已存在则拿dom，否则创建dom
            button.href = '#'; //你懂的
            className = ''; //按钮class

            if (isNewButton) { //如果为新按钮
                callback[id] = {};
            }

            //写入到按钮和空间上
            callback[id].value = value;
            button.innerHTML = '<span>' + value + '</span>';

            //如果禁用
            if (val.disabled) {
                className += ' disabled'; //禁用的class
            }
            else {
                //如果有回调
                if (val.callback !== undefined) {
                    callback[id].callback = val.callback;
                }
            }

            if (val.focus) { //如果为聚焦
                if (self._focus) {
                    self._focus.removeClass('focus'); //移除老聚焦的按钮
                }
                className += ' focus'; //给当前添加聚焦
                self._focus = $(button);
            }

            if (val.light) { //如果高亮
                className += ' light';
            }

            if (val.loading) {
                className += ' loading';
            }

            if (val.className) { //如果配置的按钮有class则追加下
                className += ' ' + val.className;
            }

            button.className = className;

            button.setAttribute('data-id', id); //为了委托事件用

            if (isNewButton) { //如果为新按钮则追加到dom
                callback[id].elem = button;
                buttons.appendChild(button);
            }
        }

        buttons.style.display = buttons.children.length ? '' : 'none';

        if (self._focus) {
            self._focus.focus(); //只操作按钮的焦点，而不管窗口的焦点，否则ie6有严重bug
        }
        button = null;
        return self.position();
    }

    /**
     * 显示
     * @return self
     */
    Dialog.prototype.show = function () {
        var self = this;

        if (self._visibled) {
            return self;
        }

        self._visibled = true;

        if (self.__jquery.mask) {
            self.find('mask').show();
        }

        self.find('wrap').show();

        // 触发显示回调
        self.__trigger('show');

        return self.zIndex();
    }

    /**
     * 隐藏
     * @return self
     */
    Dialog.prototype.hide = function () {
        var self = this;

        if (self._visibled === false) {
            return self;
        }

        self._visibled = false;

        if (self.__jquery.mask) {
            self.find('mask').hide();
        }

        self.find('wrap').hide();

        // 触发隐藏回调
        self.__trigger('hide');

        return self;
    }

    /**
     * 关闭层
     * @description 与hide的区别是close后就会销毁，不能再显示
     * @return self
     */
    Dialog.prototype.close = function () {
        var self = this;

        // 如果已经关闭或者回调里返回false则不关闭
        if (self._closed || self.__trigger('close') === false) {
            return self;
        }

        // 卸载事件
        $window.off('resize.dialog-' + self._guid);

        if (self.__jquery.mask) {
            self.find('mask').remove();
        }

        self.find('wrap').remove();

        for (var key in self) {
            delete self[key];
        }

        self._closed = true;

        return self;
    }

    /**
     * 关闭锁屏
     * @return self
     */
    Dialog.prototype.unlock = function () {
        var self = this;

        if (!self._locked) {
            return self;
        }

        self.find('mask').remove();

        self._locked = false;

        //删除元素引用
        delete self.__jquery.mask;

        return self;
    }

    /**
     * 锁屏
     * @return self
     */
    Dialog.prototype.lock = function () {
        var self = this,
            config = self.__config,
            div, css;

        if (self._locked) {
            return self;
        }

        div = document.createElement('div');

        css = {};

        div.className = Prefix + 'mask';

        if (config.backgroundColor) {
            css['backgroundColor'] = config.backgroundColor;
        }
        if (config.backgroundOpacity) {
            css['opacity'] = config.backgroundOpacity;
        }

        document.body.appendChild(div);

        if (self._visibled) {
            css.display = 'block';
        }

        self.__jquery.mask = $(div).css(css);
        self._locked = true;

        div = null;

        self.zIndex().find('wrap').addClass(Prefix + 'lock');
        return self;
    }

    /**
     * 定位
     * @return self
     */
    Dialog.prototype.position = function () {
        var wrap = this.find('wrap')[0],
            fixed = this.__config.fixed, //判断是否为fixed定位
            dl = fixed ? 0 : $document.scrollLeft(), //如果不是则找到滚动条
            dt = fixed ? 0 : $document.scrollTop(), //同上
            ww = $window.width(), //窗口的宽
            wh = $window.height(), //窗口的高
            ow = wrap.offsetWidth, //当前弹层的宽
            oh = wrap.offsetHeight, //同上
            left = (ww - ow) / 2 + dl,
            top = (wh - oh) / 2 + dt; //(wh - oh) * 382 / 1000 + dt;//项目不让使用黄金比例

        wrap.style.left = Math.max(parseInt(left), dl) + 'px';
        wrap.style.top = Math.max(parseInt(top), dt) + 'px';

        return this;

    }

    /**
     * 设置宽
     * @param  {string|int} val  宽
     * @param  {boolean} mark 如果有值则不触发定位
     * @return self
     */
    Dialog.prototype.width = function (val, mark) {
        this.find('content').width(val);
        return mark ? this : this.position();
    }

    /**
     * 设置高
     * @param  {string|int} val  高
     * @param  {boolean} mark 如果有值则不触发定位
     * @return self
     */
    Dialog.prototype.height = function (val, mark) {
        this.find('content').height(val);
        return mark ? this : this.position();
    }

    /**
     * 设置标题
     * @param  {boolean|string} title 设置标题，如果为false则不显示标题
     * @return self
     */
    Dialog.prototype.title = function (title) {
        if (title === false) {
            this.find('wrap').addClass(Prefix + 'no-title');
        }
        else {
            this.find('title').text(title);
            this.find('wrap').removeClass(Prefix + 'no-title');
        }
        return this;
    }

    /**
     * 查找弹层里面jquery元素
     * @param  {string} name 元素名，支持 wrap,foot,buttons,header,title,close,inner,content
     * @return jquery元素
     */
    Dialog.prototype.find = function (name) {
        var $elem = this.__jquery[name];

        if (!$elem) {
            $elem = this.__jquery[name] = this.find('wrap').find('[i="' + name + '"]');
        }

        return $elem;
    }

    /**
     * 设置时间
     * @param  {undefined|int} num 关闭时间单位ms，为空则清除自动关闭
     * @return self
     */
    Dialog.prototype.time = function (num) {
        var self = this,
            timer = self._timer;

        if (timer) {
            clearTimeout(timer);
        }

        if (num) {
            self._timer = setTimeout(function () {
                self.close();
            }, num);
        }

        return self;
    }

    /**
     * 内部创建弹层到页面
     */
    Dialog.prototype.__create = function () {
        var config, tpl, wrap;

        config = this.__config;

        tpl = '<div class="ui-dl-inner" i="inner">\
                <div class="ui-dl-hd" i="header">\
                    <h3 i="title"></h3>\
                    <a class="ui-dl-close" i="close" href="#"><i>关闭</i></a>\
                </div>\
                <div class="ui-dl-cnt" i="content" style="padding:' + config.padding + '">\
                    ' + config.content + '\
                </div>\
                <div class="ui-dl-ft" i="foot">\
                    <div class="ui-dl-btn" i="buttons"></div>\
                </div>\
            </div>';

        wrap = document.createElement('div');
        wrap.innerHTML = tpl;
        wrap.style.cssText = 'position:' + (config.fixed ? 'fixed' : 'absolute') + ';top:-9999rem;';

        wrap.className = this.__config.className;

        document.body.appendChild(wrap);

        this.__jquery.wrap = $(wrap);

        wrap = null;
    }

    /**
     * 默认配置参数
     * @type {Object}
     */
    Dialog.defaults = {
        padding: '20px 30px', //内容填充
        content: 'loading...', //内部
        title: '标题', //标题
        fixed: false, //是否fixed
        lock: true, //是否遮罩
        className: '', //类名
        width: 'auto', //宽
        height: 'auto', //高
        visible: true, //是否可见
        zIndex: 1990, //默认索引
        ok: null, //确定按钮
        cancel: null, //取消按钮
        button: [], //按钮组
        okValue: '确定', //确定
        cancelValue: '取消', //取消
        url: null, //iframeurl
        iframeScroll: false, //iframe 滚动
        time: null //自动关闭
    }

    window.Dialog = Dialog;
})();
