/**
 * 图片懒加载插件
 * @description 目前只支持竖向滚动, 文档/注释待修改
 * @author xieliang
 * @example
 *     1, 延迟加载
 *         new ImgLoad("#id img") 或者
 *         new ImgLoad({
 *             elem: $("#id img.imgLoad")
 *         });//默认真实图片路径在 data-src 里, 默认为淡入
 *     2, 修改真实图片路径
 *         new ImgLoad({elem: "img.imgLoad", attr:"data-img-src"});
 *     3, 修改淡入效果
 *         new ImgLoad({elem:"#id", effect:"show"});//没有淡入效果
 *     4, 自定义事件
 *         var a = ImgLoad({"elem":"img", event:"xieliang"});//定义事件名
 *         在需要的地方 a.trigger();加载全部
 *         a.trigger(".img.eq(3)");加载某个, 选择可以是img或者img外层对象
 *         a.trigger("img");//加载 img
 *         $("img").trigger("xieliang");//触发自定义事件
 *     5, 设置屏幕偏移, 支持 正，负
 *         new ImgLoad({threshold:-100, elem:"img"});
 *
 * @changelog
 *     添加滚动延迟
 */
define(function(require) {
    'use strict';
    var $ = require('./jquery'),
        count = 0,
        prototype;

    /**
     * 构造函数
     * @param {object} config 配置对象
     */
    function ImgLoad(config) {
        var self = this;

        //如果直接写的选择器
        if(!$.isPlainObject(config)){
            config = {
                elem: config
            }
        }

        // 合并配置
        self.config = config = $.extend({}, ImgLoad.defaults, config || {});


        self.__cache = {};

        self.__dom = {
            elem: $(config.elem)
        }

        self.guid = 'imgLoad'+ (count += 1);

        self.__length = self.__dom.elem.length;
        self.__ok_length = 0;

        if (self.__length < 1) {
            return self;
        }

        return self.init();
    }


    /**
     * 原型链
     * @type {object}
     */
    prototype = ImgLoad.prototype;


    /**
     * 注销
     */
    prototype.destroy = function () {
        var key,
            self = this;


        for (key in self) {
            delete self[key];
        }

        return self;
    }


    /**
     * 初始化
     */
    prototype.init = function() {
        var self = this,
            cache = self.__cache,
            config = self.config,
            guid = self.guid;



        //debug
        // window.cache = window.cache || {};
        // window.cache[self.guid] = cache;


        //遍历所有的图片
        self.__dom.elem.each(function() {
            var $that = $(this),
                key;

            //如果当前图片没有加载过且有占位链接
            if (!$that.data('imgLoad') && $that.attr(config.attr)) {

                key = count++;

                //缓存到对象上
                cache[key] = $that.data('imgLoad', key);

                // console.log(this)
            } else {
                self.__length -= 1;
            }
        });


        //如果是滚动才绑定滚动事件
        if (config.event === 'scroll') {
            self.__dom.container = $(config.container);

            self.__dom.container.on('scroll.' + guid + ' resize.' + guid, function() {
                if(self.__timer){
                    clearTimeout(self.__timer);
                }

                self.__timer = setTimeout(function(){
                    self.__scroll();
                }, 100);
            });

            //默认触发下, 解决初始的时候屏幕不在顶部而不加载图片
            self.__scroll();
        } else if (config.event) {
            self.__dom.elem.one(config.event, function() {
                self.__trigger($(this).data('imgLoad'));
            });
        }



        //debug
        // $window.on("scroll", function(){
        //     console.log(cache);
        // });
    }


    /**
     * 外部加载图片
     * @param {string|element|jQuery} selector 已知的一个选择器元素
     * @return {object} Self
     */
    prototype.trigger = function(selector) {
        var self = this,
            $elem,
            key;

        //如果全部加载完了
        if(self.__ok_length >= self.__length){
            return self;
        }

        //如果有选择器
        if (selector) {
            $elem = $(selector);
            $elem = $elem[0] && $elem[0].tagName.toUpperCase() === 'IMG' ? $elem : $elem.find('img');
            $elem.each(function() {
                self.__trigger($(this).data('imgLoad'));
            });
        } else {
            for (key in self.__cache) {
                self.__trigger(key);
            }
        }
        return self;
    }


    /**
     * 内部触发元素
     * @param  {string} key 元素的key键
     */
    prototype.__trigger = function(key) {
        var self = this,
            config = self.config,
            cache = self.__cache,
            $img;


        if (key && cache[key]) {
            $img = cache[key];
            delete cache[key]; //删除缓存里的
            self.__length -= 1;


            $('<img />').on('load', //创建个img来预加载
                function() {
                     //显示该图片
                    $img.hide().attr('src', $img.attr(config.attr))[config.effect]().removeAttr(config.attr);

                    // 释放缓存
                    setTimeout(function(){
                        $img = null;
                    });
            }).attr('src', $img.attr(config.attr))
        }
    }


    /**
     * 滚动触发
     */
    prototype.__scroll = function() {
        var self = this,
            config = self.config,
            $container = self.__dom.container,
            key, $img, offset,
            win_scrollTop = config.container === window ? 
                $container.scrollTop() : 
                $container.offset().top + $container.height(),
            win_height = $container.height();

        for (key in self.__cache) {
            $img = self.__cache[key];
            offset = $img.offset();

            if ($img.is(':visible') && 
                    win_scrollTop + win_height >= (offset.top + config.threshold) && 
                    (offset.top + $img.height() >= win_scrollTop)) { //高级可见
                self.__trigger(key);
            }
        }

        //如果已加载大于等于总数
        if (self.__ok_length >= self.__length) { 
            $container.off('scroll.' + self.guid + ' resize.' + self.guid);
        }

    }


    /**
     * 默认参数
     * @type {Object}
     */
    ImgLoad.defaults = { //默认配置
        elem: '',//选择器或者对象
        attr: 'data-src', //连接占位
        effect: 'fadeIn', //效果
        event: 'scroll', //事件
        container: window,//滚动对象
        threshold: 0 //偏移,可为正/负数
    }

    return ImgLoad;
});