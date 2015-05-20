/**
 * 滚动加载
 * @author xieliang
 * @link www.xuexb.com
 * @date 20150415
 *
 * @description 请求的方式为GET，只是简单的滚动加载，必须配置html结构，不提供事件驱动
 */

(function(){
    'use strict';

    /**
     * 滚动加载
     * @param {object} options 配置，会与默认配置合并
     */
    function AjaxPage(options){
        var self = this;

        //正在请求的标识
        self.__ing = false;

        //合并
        self.__data = $.extend(true, {}, AjaxPage.defaults, options || {});

        //列表元素
        self.$list = $(self.config('elem'));

        //列表元素
        self.$loading = $('<div class="ui-ajax-loading"></div>').insertAfter(self.$list);

        self.reset();
    }

    /**
     * 清空列表
     */
    AjaxPage.prototype.empty = function(){
        return this.$list.empty(), this;
    }

    /**
     * 重置
     */
    AjaxPage.prototype.reset = function(){
        this.$loading.html('<span>正在加载...</span>').show();
        return this._unbind()._bind();
    }

    /**
     * 上一页
     */
    AjaxPage.prototype.prev = function(){
        return this.set(this.config('page') - 1);
    }

    /**
     * 下一页
     */
    AjaxPage.prototype.next = function(){
        return this.set(this.config('page') + 1);
    }

    /**
     * 加载到第X页
     * @param {int} target 目标页
     */
    AjaxPage.prototype.set = function(target){
        var self = this;

        target = parseInt(target, 10) || 0;

        if(target < 0){
            target = 0;
        }

        self.config('page', target);

        return self._request();
    }

    /**
     * 内部加载请求
     */
    AjaxPage.prototype._request = function(){
        var self = this,
            success, data;


        //如果正在请求
        if(self.__ing){
            return self;
        }

        self.__ing = true;

        data = self.config('data');
        data.page = self.config('page');
        data.page_size = self.config('page_size');

        self.__xhr = $.ajax({
            url: self.config('url'),
            data: data,
            dataType: 'html',
            cache: false,
            success: function(res) {
                //去空格
                res = $.trim(res);

                if(res){
                    //如果返回false则不执行append方法
                    if(self._trigger('success', res) !== false){
                        self.$list.append(res);
                    }

                    success = true;

                    //处理这一页加载完了
                    // if(self.$list.children().length <= data.page * data.page_size){
                    //     self.$loading.hide();
                    //     self._unbind();//取消事件
                    // }
                } else {
                    //如果空回调不返回false则让页面显示加载全部
                    if(self._trigger('empty', res) !== false){
                        self.$loading.text(data.page === 1 ? '亲，这里没有数据！' : '亲，看完了！');
                    }
                    self._unbind();//取消事件
                }
            },
            complete: function(XML, textStatus) {
                setTimeout(function(){
                    self.__ing = false;

                    self._trigger('complete');

                    if(success){
                        self.trigger();
                    }
                }, 100);
            },
            error: function(XML, textStatus) {
                // 判断是否为强制终止
                if (XML && textStatus !== 'abort') {
                    self._trigger('error', textStatus);
                    self.$loading.text('加载出错了！');
                    self._unbind();//取消事件
                }
            }
        });

        return self;
    }

    /**
     * 触发判断是否加载
     */
    AjaxPage.prototype.trigger = function(){
        $(window).trigger('scroll');
        return this;
    }

    /**
     * 触发回调
     */
    AjaxPage.prototype._trigger = function(callbackname, res){
        var self = this,
            config = self.config();

        if('function' === typeof config[callbackname]){
            return config[callbackname].apply(self, [].slice.call(arguments).slice(1));
        }
    }

    /**
     * 内部取消滚动事件
     */
    AjaxPage.prototype._unbind = function(){
        $(window).off('scroll.AjaxPage');
        return this;
    }

    /**
     * 内部绑定事件
     */
    AjaxPage.prototype._bind = function(){
        var self = this,
            offsetTop = self.config('offsetTop'),
            Timer = null;

        // console.log(self.$loading);

        function handle(){
            clearTimeout(Timer);

            Timer = setTimeout(function() {
                if (!self.__ing && window.scrollY + window.innerHeight + offsetTop >= self.$loading.offset().top) {
                    self.next();
                }

            }, 100);
        }

        handle();


        $(window).on('scroll.AjaxPage', handle);

        return self;
    }

    /**
     * 刷新
     * @param {boolean} mark 是否刷新到第一页
     */
    AjaxPage.prototype.reload = function(mark){
        if(mark === true){
            this.config('page', 1);
        }
        return this._request();
    }

    /**
     * 设置/获取配置
     * @注意,如果val为object,则会与config原有的object合并,如果想不合并,可以先 config(key,null).config(key, {});
     */
    AjaxPage.prototype.config = function(key, val){
        var self = this,
            config = self.__data;

        //如果没有参数则为获取
        if(!key){
            return config;
        }

        if(val === void 0){
            //fix data = null
            if(key === 'data' && !config[key]){
                config[key] = {};
            }
            return config[key];
        }

        //如果是对象,则与旧的参数合并
        if($.isPlainObject(val)){
            config[key] = $.extend(true, {}, config[key] || {}, val);
        } else {
            config[key] = val;    
        }

        return self;
    }


    /**
     * 默认参数
     * @type {Object}
     * @param {number} page 当前页码，该参数会附加到data上
     * @param {number} page_size 每页条数，该参数会附加到data上
     * @param {string} url 后端的url
     * @param {object} data 需要发送到后端的数字
     * @param {elem} elem 列表元素，
     * @param {number} offsetTop 滚动的偏移
     */
    AjaxPage.defaults = {
        page: 1,
        page_size: 10,
        url: '',
        data: {},
        elem: '',
        offsetTop: 0,
    }

    //无私的给window吧
    window.AjaxPage = AjaxPage;
}());