/**
 * 弹出导
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

(function() {
    'use strict';

    var $window = $(window),
        $document = $(document),
        Prefix = 'ui-dl-',
        is_animate = !!window.FormData;

    function Dialog(config, ok, cancel) {
        var self = this;

        if ('string' === typeof config) {
            config = {
                content: config
            }
        }

        config = $.extend(true, {}, Dialog.defaults, config || {});

        if (!$.isArray(config.button)) { //如果参数的button不是数组则让其为数组，因为后面要进行push操作追加
            config.button = [];
        }


        // 确定按钮
        if (ok !== undefined) {
            config.ok = ok;
        }

        console.log(config.ok)
        if (config.ok) { //如果有确认按钮则追加到button数组里
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

        if (config.cancel) { //如果有取消按钮则追加到button数组里
            config.button.push({
                id: 'cancel',
                value: config.cancelValue,
                callback: config.cancel
            });
        }

        // 更新 zIndex 全局配置
        Dialog.defaults.zIndex = config.zIndex; //把参数里的zindex更新到全局对象里

        self.__config = config;

        /**
         * jquery缓存空间
         * @type {Object}
         */
        self.__jquery = {};

        self.__listeners = {};

        self.__create();

        console.log(config)
        self.button.apply(self, config.button); //处理按钮组

        self.title(config.title);
        self.width(config.width, true);
        self.height(config.height, true);
        self.position();

        if (is_animate) {
            self.on('show', function() {
                setTimeout(function() {
                    self.find('wrap').addClass(Prefix + 'show');
                });
            });
            self.on('hide', function() {
                this.find('wrap').removeClass(Prefix + 'show');
            });
        }

        self.find('close').on('click', function() {
            self.close();
        });

        self.find('wrap').on('mousedown', function() {
            self.zIndex();
        });

        self.find('buttons').on('click', 'a', function() {
            var that = this,
                id, fn;

            if (that.className.indexOf('disabled') > -1) {
                return false;
            }

            id = $(that).data(Prefix + 'callback');
            fn = self.__listeners[id];

            if (fn && 'function' === typeof fn.callback && fn.callback.call(self) !== false) {
                self.close();
            }

            return false;
        });

        setTimeout(function() {
            self[config.show ? 'show' : 'hide']();

            if (config.lock) {
                self.lock();
            }
        });
    }

    Dialog.prototype.zIndex = function() {
        var self = this,
            zIndex = Dialog.defaults.zIndex + 2;

        self.find('wrap').css('zIndex', zIndex);

        if (Dialog.focus) {
            Dialog.focus.find('wrap').removeClass(Prefix + 'focus');
        }

        Dialog.focus = self;

        self.find('wrap').addClass(Prefix + 'focus');

        if (self.locked) {
            self.find('mask').css('zIndex', zIndex - 1);
        }

        Dialog.defaults.zIndex = zIndex;

        return self;
    }

    /**
     * 绑定事件
     * @param {string} name 事件名，支持login,exit
     * @param {string} callback 事件回调
     * @return self
     */
    Dialog.prototype.on = function(name, callback) {
        if ('function' === typeof callback) {
            this.__getListener(name).push({
                callback: callback
            });
        }
        return this;
    }

    /**
     * 绑定事件（只触发单次）
     * @param {string} name 事件名，支持login,exit
     * @param {string} callback 事件回调
     * @return self
     */
    Dialog.prototype.one = function(name, callback) {
        // 内部方法，为了卸载
        var __call = function() {
            //卸载
            this.off(name, __call);

            // 执行回调
            if ('function' === typeof callback) {
                callback.apply(this, [].slice.call(arguments));
            }
        }

        return this.on(name, __call);
    }

    /**
     * 卸载事件
     * @param  {string}   name     事件名
     * @param  {Function|undefined} callback 事件句柄，如果空则卸载全部事件
     * @return self
     */
    Dialog.prototype.off = function(name, callback) {
        var listeners = this.__getListener(name),
            i;

        if ('function' === typeof callback) {
            for (i = 0; i < listeners.length; i++) {
                if (callback === listeners[i].callback) {
                    listeners.splice(i--, 1);
                }
            }
        } else {
            listeners.length = 0;
        }

        return this;
    }

    /**
     * 内部触发事件
     * @param {string} name 事件名
     */
    Dialog.prototype.__trigger = function(name) {
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
    Dialog.prototype.__getListener = function(name) {
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
     * @return {[type]} [description]
     */
    Dialog.prototype.button = function() {
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
            button.innerHTML = callback[id].value = value;


            //如果禁用
            if (val.disabled) {
                className += ' disabled'; //禁用的class
            } else {
                //如果有回调
                if (val.callback) {
                    callback[id].callback = val.callback;
                }
            }

            if (val.focus) { //如果为聚焦
                if (self._focus) {
                    self._focus.removeClass(Prefix + 'button-focus'); //移除老聚焦的按钮
                }
                className += ' ' + Prefix + 'button-focus'; //给当前添加聚焦
                self._focus = $(button);
            }

            if (val.light) { //如果高亮
                className += ' light';
            }

            if (val.className) { //如果配置的按钮有class则追加下
                className += ' ' + val.className;
            }



            button.className = className;


            button.setAttribute('data-' + Prefix + 'callback', id); //为了委托事件用

            if (isNewButton) { //如果为新按钮则追加到dom
                callback[id].elem = button;
                buttons.appendChild(button);
            }
        }

        buttons.style.display = ags.length ? '' : 'none';

        if (self._focus) {
            self._focus.focus(); //只操作按钮的焦点，而不管窗口的焦点，否则ie6有严重bug
        }
        button = null;
        return self;
    }

    Dialog.prototype.show = function() {
        var self = this;

        if (self.visibled) {
            return self;
        }

        self.visibled = true;

        if (self.__jquery.mask) {
            self.find('mask').show();
        }

        self.find('wrap').show();
        self.__trigger('show');

        return self.zIndex();
    }
    Dialog.prototype.hide = function() {
        var self = this;

        if (self.visibled === false) {
            return self;
        }

        self.visibled = false;

        if (self.__jquery.mask) {
            self.find('mask').hide();
        }

        self.find('wrap').hide();
        self.__trigger('hide');

        return self;
    }

    Dialog.prototype.close = function() {
        var self = this;
        if (this.__trigger('close') === false) {
            return self;
        }

        if (Dialog.focus === self) {
            Dialog.focus = null;
        }

        if (self.__jquery.mask) {
            self.find('mask').remove();
        }

        self.find('wrap').remove();

        for (var key in self) {
            delete self[key];
        }

        return self;
    }

    Dialog.prototype.unlock = function() {
        var self = this;
        if (!self.locked) {
            return self;
        }

        self.find('mask').remove();

        self.find('wrap').removeClass(Prefix + 'lock');
        self.locked = false;

        //删除元素引用
        delete self.__jquery.mask;

        return self;
    }

    Dialog.prototype.lock = function() {
        var self = this,
            config = self.__config,
            div, css;

        if (self.locked) {
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


        if (self.visibled) {
            css.display = 'block';
        }

        self.__jquery.mask = $(div).css(css);
        self.locked = true;



        self.zIndex().find('wrap').addClass(Prefix + 'lock');
        return self;
    }


    Dialog.prototype.position = function() {
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

    Dialog.prototype.width = function(val, mark) {
        this.find('content').width(val);
        return mark ? this : this.position();
    }

    Dialog.prototype.height = function(val, mark) {
        this.find('content').height(val);
        return mark ? this : this.position();
    }

    Dialog.prototype.title = function(title) {
        if (title === false) {
            this.find('wrap').addClass(Prefix + 'no-title');
        } else {
            this.find('title').text(title);
            this.find('wrap').removeClass(Prefix + 'no-title');
        }
        return this;
    }

    Dialog.prototype.find = function(name) {
        var $elem = this.__jquery[name];

        if (!$elem) {
            $elem = this.__jquery[name] = this.find('wrap').find('[i="' + name + '"]');
        }

        return $elem;
    }

    Dialog.prototype.__create = function() {
        var tpl, wrap;

        tpl = '<div class="ui-dl-inner">\
                <div class="ui-dl-hd" i="header">\
                    <h3 i="title">我是标题</h3>\
                    <a class="ui-dl-close" i="close" href="#"><i>关闭</i></a>\
                </div>\
                <div class="ui-dl-cnt" i="content">' + this.__config.content + '</div>\
                <div class="ui-dl-ft" i="foot">\
                    <div class="ui-dl-clear">\
                        <div class="ui-dl-btn" i="buttons"></div>\
                    </div>\
                </div>\
            </div>';

        wrap = document.createElement('div');
        wrap.innerHTML = tpl;
        wrap.style.cssText = 'position:absolute;top:-9999rem;';

        wrap.className = this.__config.className;

        document.body.appendChild(wrap);

        this.__jquery.wrap = $(wrap);

        wrap = null;
    }

    Dialog.focus = null;

    /**
     * 默认配置参数
     * @type {Object}
     */
    Dialog.defaults = {
        content: 'loading...',
        title: '标题',
        lock: true,
        className: '',
        width: 'auto',
        height: 'auto',
        show: true,
        zIndex: 1990,
        ok: function() {},
        cancel: function() {},
        button: [],
        okValue: '确定',
        cancelValue: '取消'
    }

    window.Dialog = Dialog;
})();