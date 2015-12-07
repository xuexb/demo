/**
 * @jQuery.tab插件包
 * @description 扩展幻灯插件包，如：图片tab加载，滚动图片，无缝滚动，淡入
 * @author xieliang
 * @email   xieyaowu@meishichina.com
 */
;(function(a, nameSpace) {
    "use strict";
    a[nameSpace].add("imgLoad", {
        attr: "data-src",
        selector: "img",
        imgIndex: "all"
    }, function(api) {
        var loadImg = function(ele){
            if (!ele['_imgLoad']) { //配合图片延迟加载
                ele['_imgLoad'] = 1;
                var attr = a(ele).attr(api.attr); //获取Attr
                if (attr) { //如果有才算真的
                    a(ele).attr("src", attr).removeAttr(api.attr);
                }
                attr = null; //释放内存
            }
        };
        if(api.plugins.indexOf('scroll') === -1){
            api.fn.list.push({
                name: "imgLoad",
                callback: function(content, index) {
                    if (api.imgIndex === "all" || (api.imgIndex | 0) == index) {//如果有图片索引
                        if (!content[0]['_imgLoad']) { //给dom上添加个标识以防治下次还加载
                            content[0]['_imgLoad'] = 1;
                            // console.log(1)//测试是否成功
                            content.find(api.selector).each(function() {
                                loadImg(this);
                            });
                        }
                    }
                }
            });
        } else {
            api.fn.findContent().find(api.selector).each(function() {
                loadImg(this);
            });
        }
    });

    a[nameSpace].add("marquee", {
        direction: "bottom"
    }, function(api) {
        var minLength = api.minLength,
            value = api.value,
            parent = api.ele.content.eq(0).parent(),
            fn = a.noop;

        api.show = false;
        api.run = 1;
        api.auto = 1;

        if (api.length <= minLength) {
            api.fn.stop();
            return false;
        }

        if (api.direction === "bottom") {
            fn = function() {
                api.fn.findContent().last().css("opacity", 0).prependTo(parent);
                parent.css("margin-top", -value + "px").animate({
                    "margin-top": 0
                }, 300, function() {
                    api.fn.findContent().first().animate({
                        "opacity": 1
                    }, 200);
                });
            }
        } else if (api.direction === "top") {
            fn = function() {
                var target = api.fn.findContent().eq(minLength).css("opacity", 0);
                parent.animate({
                    "margin-top": -value + "px"
                }, 300, function() {
                    target.animate({
                        "opacity": 1
                    }, 200, function() {
                        api.fn.findContent().first().appendTo(parent);
                        parent.css("margin-top", 0);
                        target = null;
                    });
                });
            }
        }

        api.fn.list.push({
            name: "marqueeCallback",
            callback: fn
        });

    });

    //无缝滚动
    a[nameSpace].add("scroll", function(api) {
        var content = api.ele.content,
            parent = content.eq(0).parent(),
            width = api.width;

        api.show = 0;

        //复制出第一个,最后一个
        content.eq(-1).clone().insertBefore(content.eq(0));
        content.eq(0).clone().insertAfter(content.eq(-1));

        //设置-数,让复制的第一个不显示
        parent.css("margin-left", "-" + width + "px");

        api.fn.list.push({
            name: "scrollCallback",
            callback: function(c, i) {
                parent.stop().animate({
                    "margin-left": "-" + (width * i + width) + "px"
                })
            }
        });


        api.fn.next = function() {
            if(!api.mark){
                return;
            }
            api.fn.clear();
            if (api.index + 1 >= api.length) {
                parent.stop().animate({
                    "margin-left": "-" + width * (api.length + 1) + "px"
                }, 300, function() {
                    api.fn.runCallback("callback");
                    parent.css("margin-left", "-" + width + "px");
                    api.index = 0;
                    api.fn.initNav();
                    api.auto && api.fn.auto(); //如果自动
                });
            } else {
                api.fn.set(api.index + 1);
            }
        }

        api.fn.prev = function() {
            if(!api.mark){
                return;
            }
            api.fn.clear();
            if (api.index === 0) {
                parent.stop().animate({
                    "margin-left": "0px"
                }, 300, function() {
                    parent.css("margin-left", "-" + width * (api.length + 0) + "px");
                    setTimeout(function() {
                        api.fn.initIndex(-1);
                        api.fn.initNav();
                        api.auto && api.fn.auto(); //如果自动
                    }, 100);

                });
            } else {
                api.fn.set(api.index - 1);
            }
        }
    }, {
        width: 300
    });

    //淡入
    a[nameSpace].add("fade", {
        fadeSpeed: 300
    }, function(api) {
        var content = api.ele.content;
        var fadeSpeed = api.fadeSpeed;
        api.show = 0;
        api.fn.list.push({
            name: "fadeCallback",
            callback: function(c, i) {
                content.stop().fadeOut(fadeSpeed);
                c.stop(false, true).fadeIn(fadeSpeed * 2);
            }
        });
    });
}(jQuery, "tab"));