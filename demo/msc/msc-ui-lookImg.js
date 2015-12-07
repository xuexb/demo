/**
 * 查看图片组件
 * @author xieliang
 * @email   xieyaowu@meishichina.com
 *
 * @namespace msc.ui.lookImg
 * @memberOf msc.ui
 * 
 * @param {object} config 配置参数
 * @param {string} config.title 相册标题
 * @param {number} config.index 默认高亮索引
 * @param {array} config.data 数据包
 * @param {number} config.adId 百度广告id
 * 
 * @todo 1, 图片延迟加载
 *       2, 处理没有广告的时候
 *       3, 修改插件名称
 *       
 * @descript 弹出层查看图片, 目前不对外提供接口, CA 一个新突破, 把dialog从实例上移除出来据然省了1.2M内存, 因为那样引用是循环泄漏了
 * @example
 *       1, msc.ui.lookImg({
 *           title:"右侧相册的标题",
 *           index: 0, //默认高亮索引, 以0开始, 如果是负数则是 倒数开始
 *           data:[
 *               {
 *                   'src': '图片绝对路径',
 *                   'description': '图片描述'
 *               }
 *           ]
 *       });
 *
 *      2, 修改百度广告id
 *      msc.ui.lookImg({
 *          adId: 1231,
 *          ...
 *      })
 */
(function($, msc, undefined) {
    var DIALOG = msc.ui.dialog,
        isIe6 = msc.tools.browser;


    var lookImg = msc.ui.lookImg = function(config) {

        //如果已经弹出来了
        if (DIALOG.get("lookImg")) {
            return false;
        }

        config = config || {};

        if (!config.data || !config.data.length) {
            return false;
        }

        config.adId = config.adId || 907285;//加上默认广告id


        lookImg.init(config);

        return true;
    }

    lookImg.init = function(config) {
        $('<link rel="stylesheet" type="text/css" href="http://static.meishichina.com/v6/css/lib/ui-lookImg.css">').appendTo("head").on("load", function() {
            lookImg.init = function(config) {
                new Class(config);
            }
            new Class(config);
        });
        lookImg.init = $.noop;
    }

    function Class(config) {
        this.config = config;
        return this._init();
    }

    Class.prototype._init = function() {
        var self = this,
            config = self.config,
            dom = self._dom = {},
            dialog,
            str;
        //图片数
        self.dataLength = config.data.length;

        //是否为图片更多模式
        //0 为三行模式, 1多行收缩模式, 2显示多行模式
        self.more = 0;

        //文字显示状态, true为已显示, 否则为不显示
        self.textStatus = null;


        //弹出来, 一定要用变量, 不能写到实例上
        dialog = DIALOG({
            title: false,
            backgroundColor: '#333',
            skin: 'ui-lookImg-dialog',
            lock: !0,
            fixed: !0,
            id: 'lookImg',
            content: '<div class="ui-lookImg">' +
                '<div class="pic">' +
                '<div class="pic_wrap">' +
                '<div class="pic_inner">' +
                '<div class="pic_text">' +
                '<div class="pic_text_mask"></div>' +
                '<p class="J_text">...</p>' +
                '</div>' +
                '<a href="javascript:;" class="ui-lookImg-btn prev"><i>上一个</i></a>' +
                '<a href="javascript:;" class="ui-lookImg-btn next"><i>下一个</i></a>' +
                '<div class="pic_center">' +
                '<span class="pic_hack"></span>' +
                '<img src="http://static.meishichina.com/v6/img/blank.gif" class="J_img">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="detail J_detail">' +
                '<h3 class="J_title">...</h3>' +
                '<div class="subinfo">' +
                '<div class="ui-webkit-scrollbar">' +
                '<div class="ui-lookImg-sublist">' +
                '<ul class="clear J_list"></ul>' +
                '</div>' +
                '<a href="javascript:;" class="more">查看更多图片</a>' +
                '</div>' +
                '</div>' +
                '<div class="ad200"></div>' +
                '</div>' +
                '</div>',
            backgroundOpacity: 1,
            visible: !1,
            beforeunload: function() {//关闭的时候只移出实例就行, 不用删除事件, 因为 $.fn.remove 是非常强大的, 你懂的
                var key;
                for (key in self) {
                    delete self[key];
                }

                //让其出现滚动条
                $("html").css("overflow-y", "visible");
            }
        });
    
        //注册dom
        dom.$wrap = dialog._$('content').find(".ui-lookImg");
        dom.$detail = dom.$wrap.find(".J_detail");
        dom.$pic_inner = dom.$wrap.find(".pic_inner");

        dom.$text_wrap = dom.$pic_inner.find(".pic_text"); //滑过块
        dom.$text = dom.$text_wrap.find(".J_text"); //文本节点

        dom.$prev = dom.$wrap.find("a.prev"); //上一个
        dom.$next = dom.$wrap.find("a.next"); //下一个

        dom.$img = dom.$wrap.find("img.J_img"); //图片节点

        dom.$scrollbar = dom.$detail.find(".ui-webkit-scrollbar"); //滚动节点

        dom.$photo_more = dom.$detail.find(".more"); //更多按钮

        dom.$photo_list_wrap = dom.$detail.find(".ui-lookImg-sublist");


        dom.$photo_list = dom.$photo_list_wrap.find("ul");

        //输出标题
        dom.$detail.find(".J_title").html(config.title);

        //输出列表, 这里到时要做按需加载的处理
        str = '';
        $.each(config.data, function(index, value) {
            str += '<li><a href="javascript:;"><img src="' + value.src + '" width="64" height="64" alt=""></a></li>';
        });
        dom.$photo_list[0].innerHTML = str;


        //输出广告
        dom.$detail.find(".ad200")[0].innerHTML = '<iframe height="200" width="250" scrolling="no" frameborder="0" src="http://static.meishichina.com/v6/ad/v1.html?id='+ config.adId +'"></iframe>';


        //如果大于9个让更多按钮出现并让其只显示3行
        if (self.dataLength > 9) {
            dom.$photo_list_wrap.addClass("ui-lookImg-hidden");
            dom.$photo_more.css('display', 'block');
            self.more = 1; //打上模式标识
        }

        //绑定事件
        self._bind();

        //显示弹出层
        dialog.visible();

        //触发高亮
        self.trigger({
            index: config.index,
            isScroll: true
        });

        //隐藏滚动条
        $("html").css("overflow-y", "hidden");

        // 赶紧地, 销毁吧, 据测试注销掉+关闭的时候delete, 可以有效的把内存回收
        dialog = null;
    }

    Class.prototype._bind = function() {
        var self = this,
            dom = self._dom;

        //点击图片li
        dom.$photo_list.on("click", "li", function() {
            self.trigger({
                index: $(this).index(),
                isScroll: self.more !== 2 //为了体验, 显示滚动条时点击不滚动页面
            });
        });

        //如果有更多点击更多
        if (self.more) {
            dom.$photo_more.click(function() {
                if (self.more === 1) { //如果为收缩则让其展开
                    dom.$photo_list_wrap.removeClass("ui-lookImg-hidden");
                    self.more = 2;
                    this.innerHTML = '收起更多';
                } else {
                    this.innerHTML = '查看更多';
                    self.more = 1;
                    dom.$photo_list_wrap.addClass("ui-lookImg-hidden");

                    //收缩上来时要定下位, 以让高亮图片显示在最佳范围
                    setTimeout(function() {
                        self._set_list_top();
                    });
                }

            });
        }

        //滑过显示文字
        dom.$pic_inner.mouseenter(function(event, isRun) {
            if (isRun || self.config.data[self.index].description) { //如果没有显示则打上标识
                self.textStatus = 1;
                dom.$text_wrap.stop().animate({
                    bottom: 0
                }, 400, 'easeOutExpo');
            }
        }).mouseleave(function(event, isRun) {
            if (isRun || self.textStatus) { //如果没有显示则打上标识
                self.textStatus = false;
                dom.$text_wrap.stop().animate({
                    bottom: -70
                }, 400, 'easeOutExpo');
            }
        });

        //上,下一个
        dom.$prev.click(function() {
            if (self.index < 1) {
                DIALOG.warning("没有上一个");
            } else {
                self.trigger({
                    index: self.index - 1,
                    isScroll: true,
                    isBtn: true
                });
            }
        });
        dom.$next.click(function() {
            if (self.index === self.dataLength - 1) {
                DIALOG.warning("没有下一个");
            } else {
                self.trigger({
                    index: self.index + 1,
                    isScroll: true,
                    isBtn: true
                });
            }
        });



        self._bind = $.noop;
    }


    /**
     * 触发显示
     * @param  {(number|object)}  config  如果为数字则为索引, 如果为对象则是配置参数
     * @param {boolean} config.isScroll 是否滚动右侧图片区
     * @param {boolean} config.isBtn 是否是上下按钮触发的
     * @param {number} config.index 触发索引
     */
    Class.prototype.trigger = function(config) {
        var self = this,
            dom = self._dom,
            index;

        if ("number" === typeof config) {
            config = {
                index: config
            }
        }

        config = config || {};

        index = config.index;

        if (index !== undefined) {
            //计算index并写入到实例上
            index = index | 0;
            if (index < 0) {
                index += self.dataLength;
            }
            if (index < 0 || index > self.dataLength) {
                index = 0;
            }
            self.index = index;
        } else {
            index = self.index;
        }

        //高亮图片区的当前图
        dom.$photo_list.find("li").removeClass("on").eq(index).addClass("on");

        //如果要滚动则滚动图片区
        if (config.isScroll) {
            self._set_list_top();
        }

        //计算是否有上/下一个
        dom.$prev[index === 0 ? 'hide' : 'show']();
        dom.$next[index + 1 === self.dataLength ? 'hide' : 'show']();

        //展示图
        self._show(config.isBtn);

        return self;
    }

    /**
     * 设置列表偏移
     */
    Class.prototype._set_list_top = function() {
        var self = this,
            dom = self._dom,
            index = self.index,
            value,
            line = get_line(self.index); //当前索引的行
        if (self.more === 1) { //如果为多行收缩起来, 因为没有原生滚动条, so 得各种判断, 因为一行,和最后一行直接设置有问题

            if (line === 1) { //如果为第一行
                value = 0;
            } else if (get_line(self.dataLength - 1) === line) { //最后一行
                value = -(line * 77 - 227);
            } else { //中间行
                value = -(line * 77 - 150);
            }

            dom.$photo_list.stop().animate({
                top: value
            }, 500, 'easeOutExpo');
        } else if (self.more === 2) { //如果为多行展开
            dom.$scrollbar.stop().animate({
                scrollTop: (line * 77) - 190
            }, 500, 'easeOutExpo');
        } else { //否则为没有更多

        }
    }

    /**
     * 显示图片和文字
     */
    Class.prototype._show = function(isBtn) {


        var self = this,
            dom = self._dom,
            text = self.config.data[self.index].description,
            url = self.config.data[self.index].src,
            $img = dom.$img;

        if (text) {
            dom.$text.html(text);
        }

        //如果是按钮触发的, 则强制执行触发事件
        isBtn && dom.$pic_inner.trigger(text ? "mouseenter" : "mouseleave", [true]);

        //更换图片路径
        if (isIe6) {
            //先占下位
            $img.attr("src", 'http://static.meishichina.com/v6/img/blank.gif');

            // 请求获取图片宽高
            get_img_wh(url, function(width, height) {
                var css = {
                    width: 'auto',
                    height: 'auto'
                }
                if (width > 700 && height > 520) { //如果双方都同意则结婚
                    if (width - 700 > height - 520) {
                        css['width'] = 700;
                    } else {
                        css['height'] = 520;
                    }
                } else if (width > 700) { //如果只有男方同意
                    css['width'] = 700;
                } else if (height > 520) { //只有女方同意
                    css['height'] = 520;
                } else { //都不同意
                    css = {
                        width: width,
                        height: height
                    }
                }

                $img.attr("src", url).css(css);

                css = null;

            });
        } else {
            $img.attr("src", url);
        }
    }


    /**
     * 获得图片所在的行号
     * @param  {number} num 索引, 从0开始
     * @return {number}     所在行号
     */
    function get_line(num) {
        return Math.floor(num / 3 + 1);
    }


    /**
     * 快速获取图片宽高
     * @param  {string} url 图片链接
     * @param {function} fn 得到后回调
     */
    function get_img_wh(url, fn) {
        var img = new Image(),
            timer = null;

        function check() {
            // console.log("check", new Date().getTime())
            if (img.width > 0 || img.height > 0) {
                clearInterval(timer);
                fn && fn(img.width, img.height);
                img = timer = null;
            }
        }

        img.src = url;

        timer = setInterval(check, 50);
    }

}(jQuery, msc));