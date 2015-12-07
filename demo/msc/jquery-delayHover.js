/**
 * @name jQuery滑过插件 (滑过延迟添加类)
 * @author xieliang
 * @createDate 20131128
 * @email xieyaowu@meishichina.com
 * @param   {object}        config                      配置参数
 * @param   {string}        config.className            要添加的类名, 默认为on
 * @param   {number}        config.delay                滑过事件的延迟时间, 默认为0, 单位ms
 * @param   {number}        config.delayStart           滑入事件的延迟时间, 默认为0, 单位ms
 * @return  {jQuery}        当前jQuery对象
 * @example
 *     1: $(selector).delayHover();//滑过ele时添加on类,滑出取消
 *     2: $(selector).delayHover({className:"meishichina", delay: 300});//滑入ele时添加meishichina类,滑出取消类,滑入没有延迟,滑出有300ms延迟
 *     3: $(selector).delayHover({delay:300, delayStart:100});//滑入ele时添加on类,滑出取消,滑入100ms延迟,滑出300ms延迟
 */

;(function(a) {
    "use strict";
    a.fn.delayHover = function(config) {
        var self = this;
        if (!self.length) { //如果当前选择器没有内容
            return self;
        };
        config = a.extend({},a.fn.delayHover.defaults, config || {});//合并
        return self.each(function() {
            var $this = a(this);
            if (!$this.data("_hover")) { //如果没有加载过该插件才加载
                var TIME = null, //定时器
                    mark = null; //开关标识
                $this.data("_hover", !0).bind("mouseenter", function() {
                    if(mark){
                        clearTimeout(TIME);
                        TIME = null;
                    } else {
                        TIME = setTimeout(function() {
                            $this.addClass(config.className);
                            // console.log("滑入");
                            mark = true;
                        },
                        config.delayStart | 0);
                    };
                }).bind("mouseleave", function() {
                    if(mark){
                        TIME = setTimeout(function() {
                            $this.removeClass(config.className);
                            //console.log("滑出");
                            mark = false;
                        },
                        config.delay | 0);
                    } else {
                        clearTimeout(TIME);
                        TIME = null;
                    };
                });
            };
        });
    };

    a.fn.delayHover.defaults = { //默认参数
        className: "on", //类名
        delay: 0, //延迟时间,ms
        delayStart: 0 //滑入延迟时间,ms
    };
}(jQuery));