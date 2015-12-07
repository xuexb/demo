/**
 * @ 返回顶部按钮
 * @name msc.goTop
 * @memberOf msc
 * @description 右下角定位层,默认高为300,小于1200的时候会给浮动层添加 .fixed-footer-min, 可使用msc.goTop.addItem(str) 来追加到浮动层里, 依赖event模块，全局css
 * @date 20140102
 * @author xieliang
 * @email xieyaowu@meishichina.com
 * @function
 * @todo 添加offsetY + 不显示weixin + 屏幕width宽
 * @example
 *     1, 初始化
 *         msc.goTop(); 或者 msc.goTop.init();
 *     2, 设置底部对齐对象
 *         默认为 #J_footer_box, 可以手动设置，如：
 *         msc.goTop.footerEle = $("#xl");
 *         msc.goTop.init();
 *     3, 追加代码
 *         msc.goTop.addItem('<div></div>');//向底部容器里追加html代码(也可以是dom/jQuery对象)
 *     4, 对外暴露触发定位方法，可在某声ajax场景下使用，因为可能页面长度改变了，而返顶没有动的bug;
 *         msc.goTop.trigger();
 *     5, 修改相对宽
 *         msc.goTop.offsetWidth = 1000;//1200, false
 *     6, 修改偏移y
 *         msc.goTop.offsetY = 20;
 */
;(function($, msc) {
    "use strict";
    var isIe6 = msc.tools.browser.isIe6,
        goTop = msc.goTop = function() {
            return goTop.init();
        },
        
        fixed_footer_fn,
        scroll_fn,
        resize_fn,
        visible = 0,
        loaded;

    //配置默认参数
    goTop.offsetY = 10;
    goTop.footerEle = $("#J_footer_box");
    goTop.offsetWidth = 990;

    /**
     * 初始化
     */
    goTop.init = function() {
        if (loaded) { //保证只加载一次
            return goTop;
        };
        loaded = 1;
        goTop.ele = $('<div class="fixed-footer"><a href="javascript:;" title="点击返回页面顶部" onclick="window.scrollTo(0,0);" class="fixed-footer-go"></a><div class="fixed-footer-weixin"><div class="fixed-footer-weixin-inner"><span>美食天下微信</span></div></div></div>').appendTo(document.body); //把ele放到空间下
        goTop.footerEle = goTop.footerEle || $("#J_footer_box");
        goTop.eleHeight = goTop.ele.outerHeight(true) + goTop.offsetY;
        fixed_footer_fn = !isIe6 && goTop.footerEle.length ? function(obj) {
            if (obj.scrollTop + obj.height + goTop.offsetY >= goTop.footerEle.offset().top) {
                goTop.ele[0].style.bottom = obj.scrollTop + obj.height - goTop.footerEle.offset().top + goTop.offsetY + "px";
            } else {
                goTop.ele[0].style.bottom = "10px"
            }
        } : $.noop;
        return goTop._bind(); //绑定事件并定位
    };


    /**
     * 内部滚动事件
     * @param  {window.event} obj window对象的参数对象
     */
    goTop._scroll = function(obj) {
        fixed_footer_fn(obj);
        if (obj.scrollTop < 100) {
            if (visible) {
                visible = 0;
                goTop.ele.find(".fixed-footer-go").stop().fadeOut();
            };
        } else {
            if (!visible) {
                visible = 1;
                goTop.ele.find(".fixed-footer-go").stop(false, true).fadeIn();
            };
        };
        if (isIe6) { //兼容ie6
            goTop.ele.css("top", obj.scrollTop + obj.height - goTop.eleHeight);
        };
    }

    /**
     * 内部窗口改变事件
     */
    goTop._resize = function(obj) {
        var right = "auto",
            left = "auto",
            width = obj.width;
        if (!goTop.offsetWidth || width < goTop.offsetWidth + 200) {
            right = "68px";
            goTop.ele[0].className = 'fixed-footer fixed-footer-min';
        } else {
            goTop.ele[0].className = 'fixed-footer';
            left = (width - goTop.offsetWidth) / 2 + goTop.offsetWidth + 10;
        };
        goTop.ele.css({
            left: left,
            right: right
        });
        left = right = width = null;

        // if (isIe6) { //解决ie6resize的时候不能定top
            scroll_fn.trigger("goTop");
        // };
    }

    /**
     * 绑定事件
     */
    goTop._bind = function() {
        resize_fn = msc.event.resize.add(goTop._resize);
        scroll_fn = msc.event("scroll", isIe6 ? 50 : 0).add(goTop._scroll);

        if (isIe6) { //兼容ie6默认不显示问题,因为ie6用的是top
            goTop.ele.find(".fixed-footer-weixin").delayHover();
        };
        resize_fn.trigger();
        return goTop;
    };


    /**
     * 追加块到浮动层, 可以解决一些如威信,收藏等图标
     * 如: msc.goTop.addItem('<div class="fixed-footer-weixin">这里可以是威信</div>');
     */
    goTop.addItem = function(str) {
        if (!loaded) {
            goTop.init();
        };
        goTop.ele.prepend(str);
        return goTop;
    };

    /**
     * 触发让其定位
     */
    goTop.trigger = function(){
        resize_fn && resize_fn.trigger();
    }
}(jQuery, msc));