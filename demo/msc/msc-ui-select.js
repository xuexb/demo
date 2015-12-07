/**
 * 美化select
 * @todo 键盘事件,事件委托,添加focus,blur等操作, 多选
 * @description 这一版存在诸多的bug,且没有优化
 * @author xieliang
 * @email xieyaowu@meishichina.com
 *
 * @memberOf msc.ui
 * @namespace msc.ui.select
 * @example
 *     1, msc.ui.select("#id")
 *     2, msc.ui.select({
 *         id:".class",
 *         width:100,
 *         defaultValue: true,
 *         event: 'hover'
 *     })
 */
(function($, msc) {
    var isIe6 = msc.tools.browser.isIe6,
        $document = $(document);
    var select = msc.ui.select = function(config) {
        if (!$.isPlainObject(config)) {
            config = {
                id: config
            }
        }

        //默认参数
        config = $.extend({
            width: 80, //框的宽
            maxWidth: 160, //下拉最大宽
            maxHeight: 200, //下拉最大高
            event: "click", //事件
            hoverDelay: 100, //滑过延时
            defaultValue: false //默认文本, 如果 为false则为请选择, 如果为fn则call下, 如果为true则拿option的第一个当
        }, config);

        //如果没有id 或者 选择器空
        if (!config.id || !(config.id = $(config.id)).length || config.id[0].nodeName !== "SELECT") {
            return select;
        }

        $.each(config.id, function() {
            if (!this._select) {
                this._select = 1;
                new Class(this, config);
            }
        });

        return select;
    }

    function Class(ele, config) {
        this.config = config;
        this._dom = {
            ele: $(ele)
        };
        this._init();
    }


    Class.prototype = {
        _init: function() {
            this._disabled = true;
            this._append();
            this._update();
            this._bind();
        },
        empty: function() {
            this._dom.list.empty();
            return this;
        },
        disabled: function() {
            this._disabled = true;
            this._dom.wrap.addClass("ui-select-disabled");
            return this;
        },
        enabled: function() {
            this._dom.wrap.removeClass("ui-select-disabled");
            this._disabled = false;
            return this;
        },
        _update: function() {
            var dom = this._dom,
                defa = this._runCall(this.config.defaultValue),
                value = dom.ele.val(),
                selectedValue = dom.ele.find("option:selected").text(),
                str = "";



            if (selectedValue) { //如果有选中的值
                defa = selectedValue;
            }

            if (defa === true) {
                defa = dom.ele.find("option").eq(0).text();
            } else if (false === defa) {
                defa = '请选择';
            }

            defa && dom.span.html(defa);


            if (dom.ele.prop("disabled")) { //如果按钮被禁用
                return this.hide().disabled().empty();
            } else {
                this.enabled();
            }

            dom.ele.find("option").each(function() {
                if (value == this.value) {
                    str += '<div class="ui-select-li-on ui-select-item" data-value="' + this.value + '">' + this.text + '</div>';
                } else {
                    str += '<div class="ui-select-item" data-value="' + this.value + '">' + this.text + '</div>';
                }
            });


            dom.list.html(str);
        },
        _bind: function() {
            var self = this,
                config = this.config,
                dom = this._dom,
                mark = null,
                timer = null;

            dom.ele.on("change", function() {
                setTimeout($.proxy(self._update, self));
            });

            dom.ele.on("select", function() {
                self.show();
            });

            if (config.event === "click") {
                dom.title.click(function() {
                    if (self._visible) {
                        self.hide();
                    } else {
                        self.show();
                    }
                });

                //滑过高亮
                dom.wrap.mouseenter(function() {
                    if (!self._disabled) {
                        dom.wrap.addClass("ui-select-hover");
                    }
                }).mouseleave(function() {
                    if (!self._disabled) {
                        dom.wrap.removeClass("ui-select-hover");
                    }
                });

                $document.on("click", ".ui-select-tit", function() {
                    if (this !== dom.title[0]) {
                        self.hide();
                    }
                    return false;
                });

                $document.on("click", function() {
                    self.hide();
                });
            } else if (config.event === 'hover') {

                dom.wrap.on("mouseenter", function() {
                    if (!self._disabled) {
                        if (mark) {
                            clearTimeout(timer);
                            timer = null;
                        } else {
                            timer = setTimeout(function() {
                                self.show();
                                dom.wrap.addClass('ui-select-hover');
                                mark = true;
                            }, config.hoverDelay);
                        }
                    }
                }).on("mouseleave", function() {
                    if (!self._disabled) {
                        if (mark) {
                            timer = setTimeout(function() {
                                dom.wrap.removeClass('ui-select-hover');
                                self.hide();
                                mark = false;
                            }, config.hoverDelay);
                        } else {
                            clearTimeout(timer);
                            timer = null;
                        }
                    }
                });
            }



            //委托列表
            dom.list.on("click", ".ui-select-item", function() {
                dom.span.html(this.innerHTML);
                dom.ele.val(this.getAttribute("data-value")).change();
                dom.list.find(".ui-select-item").removeClass("ui-select-li-on");
                this.className += ' ui-select-li-on';
                self.hide();
                return false;
            });
        },

        scrollTo: function() {
            var dom = this._dom;
            if (dom.list.find(".ui-select-li-on").length) {
                dom.list.scrollTop(dom.list.find(".ui-select-li-on").index() * 28);
            }
        },
        show: function() {
            if (!this._disabled && !this._visible) {
                this._visible = 1;
                this._dom.wrap.addClass("ui-select-show");
                this.scrollTo();
            }
            return this;
        },
        hide: function() {
            if (!this._disabled && this._visible) {
                this._visible = 0;
                this._dom.wrap.removeClass("ui-select-show");
            }

            return this;
        },
        _runCall: function(mod) {
            if ("function" === typeof mod) {
                mod = mod.call(this._dom.ele[0]);
            }
            return mod;
        },
        _append: function() {
            var self = this,
                dom = self._dom,
                config = self.config,
                width = self._runCall(config.width),
                str = '<div class="ui-select">' +
                    '<div class="ui-select-tit">' +
                    '<a href="javascript:;">' +
                    '<span>...</span>' +
                    '<b></b><i></i>' +
                    '</a>' +
                    '</div>' +
                    '<div class="ui-select-ul ui-webkit-scrollbar"></div>' +
                    '</div>';

            dom.wrap = $(str); //整个
            dom.list = dom.wrap.find(".ui-select-ul"); //下拉
            dom.title = dom.wrap.find(".ui-select-tit"); //标题
            dom.span = dom.title.find("span"); //标题字



            if (!isIe6) {
                dom.list.css("minWidth", width - 2);
            }

            //设置宽
            dom.wrap.width(width);


            dom.list.css(isIe6 ? 'width' : "max-width", self._runCall(config.maxWidth));

            dom.list.css(isIe6 ? 'height' : "max-height", self._runCall(config.maxHeight));


            


            dom.wrap.insertAfter(dom.ele);//最后插入

            //让原select消失
            // dom.ele.css({
            //     position: 'absolute',
            //     left: '-9999em'
            // });
        }
    }

}(jQuery, msc));