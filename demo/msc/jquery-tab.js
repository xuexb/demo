/**
 * @name 幻灯插件
 * @description jQuery幻灯构架方法，只是普通的框架，如果想要效果请引用plugins插件，用法请联系 qq463004799
 * @version 1.0
 * @author xieliang
 * @email xieyaowu@meishichina.com
 */
;(function(a, nameSpace) {
    "use strict";

    a[nameSpace] = function(ele, config, fn) {
        if (!ele) {
            return a;
        }
        var $this = a(ele),
            api;

        if (!ele['_'+ nameSpace]) { //如果没有加载过该插件才加载
            ele['_'+ nameSpace] = 1; //设置加载过该插件
            if ("function" === typeof config) {
                config = [fn, fn = config][0];
            };

            api = ele.api = a.extend({}, a[nameSpace].defaults, config || {});//给dom上绑定下


            api.fn = {};//fn对象是放方法的
            api.fn.list = [];//回调列表,为了扩展插件
            api.fn.callback = api.callback && "function" === typeof api.callback ? api.callback : fn && "function" === typeof fn ? fn : 0;
            if(api.fn.callback){
                api.fn.list.push({
                    name: "callback",
                    callback:api.fn.callback
                });
            }
            delete api.fn.callback;

           

            /**
             * 获取最新的内容ele
             */
            api.fn.findContent = function(){
                var ele;
                if (!api.content) { //如果没有设置,则使用tag方式查找
                    ele = $this.find(api.contentTag + "[" + api.key + "=" + api.contentVal + "]");
                } else { //如果设置有内容选择器
                    if ("function" === typeof api.content) { //如果为function
                        ele = api.content.call($this); //this指向当前选择器
                    } else if ("string" === typeof api.content) { //如果为string,则查找ele下面的
                        ele = $this.find(api.content);
                    };
                };
                return ele;
            }

            /**
             * 更新重置,可更新一切API， api 在 dom 对象上
             */
            api.fn.reset = function (options){
                api.fn.clear();
                api.ele = {};//清空
                api.mark = 0;
                if(a.isPlainObject(options)){
                    a.extend(api,options);
                }

                api.ele.content = api.fn.findContent();
                api.length = api.ele.content.length; //记录内容数

                if (!api.length) { //如果没有内容则退出
                    return false;
                };


                //处理导航选择器
                var nav;
                if (api.nav) { //如果有导航选择器
                    if ("function" === typeof api.nav) { //如果为function
                        nav = api.nav.call($this, api.length); //this指向当前选择器,参数为内容的个数
                    } else if ("string" === typeof api.nav) { //如果为字符串则查找ele下面的
                        nav = $this.find(api.nav);
                    } else if (true === api.nav || api.nav === 1) { //如果为1或者true则查找ele下的标签元素
                        nav = $this.find(api.navTag + "[" + api.key + "=" + api.navVal + "]");
                    };
                };
                api.ele.nav = nav;
                nav = null;



                if (api.ele.nav && api.ele.nav.length !== api.length) { //如果有导航但导航的个数不等于内容的个数
                    return false;
                };

                /**
                 * 如果有导航遍历导航并绑定事件
                 */
                if (api.ele.nav) {
                    api.ele.nav.each(function(i) {
                        (function($nav,i){
                            $nav.unbind(api.event).bind(api.event, function() {
                                if ($nav.hasClass(api.className) || !api.mark) { //如果操作的为当前类则,或者停止状态
                                    return;
                                };
                                api.fn.set(i,api.delay);
                            });
                        }(a(this),i));
                    });
                };

                //处理插件
                if (api.plugins) {//如果有设置插件
                    var plug = api.plugins.split(","),
                        i = 0,
                        len = plug.length;
                    for(;i<len;i++){
                        api.fn.initPlug(plug[i]);
                    };
                    plug = null;
                };

                if (api.run) { //如果有运行
                    api.fn.run();
                };
            }

            
            api.fn.initPlug = function(name){
                var plug = a[nameSpace].plugins[name];
                if(plug){//如果该插件存在
                    if(a.isPlainObject(plug.options)){//如果插件有配置参数
                        for(var i in plug.options){//那么好吧, 遍历他们
                            if(api[i] === undefined){//如果API里没有配置才使用插件配置参数
                                if("function" === typeof plug.options[i]){//如果FN则执行
                                    api[i] = plug.options[i].call($this,api);//让API的值等于返回值
                                } else {
                                    api[i] = plug.options[i];//直接使用
                                }
                            }
                        }
                        // $this.api = api; //重新引用对象,不用extend合并就不用引用了,因为是一个对象,一合并就是新对象,必须重新引用
                    };
                    plug.callback.call($this, api);//执行该插件
                }
                plug = null;
            };
            



            /**
             * 清除延迟
             */
            api.fn.clear = function() {
                clearTimeout(api.subTimer);
                clearInterval(api.mainTimer);
                api.subTimer = api.mainTimer = null;
            };

            /**
             * 计算index
             * 如果为-则+length
             */
            api.fn.initIndex = function(index) {
                index = index | 0;
                if (index < 0) {//处理负数
                    index = index + api.length;
                }
                if (index < 0) {
                    index = 0;
                }
                if (index >= api.length) {
                    index = 0;//处理下一个的时候
                }
                api.index = index;
            };

            api.fn.show = function() {
                if (api.show) { //如果显示
                    api.ele.content.stop().hide().eq(api.index).show();
                };
                if (api.length < 2) { //如果只有一个则停止播放
                    api.fn.stop();
                };
            };

            api.fn.initNav = function() {
                api.ele.nav && (api.ele.nav.removeClass(api.className).eq(api.index).addClass(api.className)); //移除导航的类
            };

            api.fn.runCallback = function(name) {
                a.each(this.list,function(){
                    if(!name || name === this.name){
                        this.callback.call($this, api.ele.content.eq(api.index), api.index);   
                    }
                });
                // api.fn.callback && "function" === typeof(api.fn.callback) &&  //返回值 { 内容当前对象, 索引},this指针为当前选择器
            };


            /**
             * 设置显示
             */
            api.fn.set = function(index, delay) {
                api.fn.clear();
                api.subTimer = setTimeout(function() {
                        api.fn.initIndex(index);
                        api.fn.initNav();
                        api.fn.show();
                        api.fn.runCallback();
                        api.auto && api.fn.auto(); //如果自动
                    },
                    delay|0);
            };


            /**
             * 自动
             */
            api.fn.auto = function() {
                if (!api.mark) {
                    return
                };
                api.fn.clear();
                api.mainTimer = setInterval(function() {
                        api.fn.next();
                        // api.fn.set(api.index+1);
                    },
                    api.speed);
            };

            /**
             * 停止
             */
            api.fn.stop = function() {
                if (!api.mark) {
                    return;
                };
                api.mark = false;
                api.fn.clear();
            };

            /**
             * 运行
             */
            api.fn.run = function() {
                if (api.mark) {
                    return
                };
                api.mark = true;

                if (!api.index) {
                    api.index = api.ele.nav ? function() {
                        var i = api.ele.nav.filter(function() {
                            return a(this).hasClass(api.className)
                        }).eq(0).index(); //找到第一个包含class的索引,如果不存在则为0
                        if (i < 0) {
                            i = 0;
                        };
                        return i;
                    }() : 0; //初始化索引
                };
                api.fn.set(api.index);//设置index
            };

            

            api.fn.next = function(mark) {
                if(mark || api.mark) {
                    api.fn.set(api.index + 1);
                }
            };
            api.fn.prev = function(mark) {
                if(mark || api.mark) {
                    api.fn.set(api.index - 1);
                }
            };


            //加载
            api.fn.reset();
            


        };
    }

    //给$.fn上绑定方法
    a.fn[nameSpace] = function(config, fn) {
        return this.each(function() {
            new a[nameSpace](this, config, fn);
        });
    }

    //给$.fn上绑定 nameSpaceModel 的扩展方法
    a.each(["next", "prev", "run", "stop", "reset", "set"], function(index, model) {
        a.fn[nameSpace + model.charAt(0).toUpperCase() + model.substr(1)] = function(mark) {
            return this.each(function() {
                this['_'+ nameSpace] && this.api.fn[model](mark);
            });
        };
    });

    a[nameSpace].defaults = { //默认配置
        auto            :   false, //是否自动切换
        event           :   "mouseenter", //事件 mouseover
        className       :   "on", //添加类
        key             :   "data-tab", //容器标签 属性名
        navVal          :   "nav", //导航标签属性值
        contentVal      :   "content", //内容标签属性值
        speed           :   3000, //延迟时间自动执行
        delay           :   100, //延迟
        index           :   0, //当前索引
        navTag          :   "span", //导航标签,优化于jd.com
        contentTag      :   "div", //内容标签
        show            :   true, //显示内容
        content         :   null, //内容选择器,可为function,this指向的当前选择器,返回值则当做内容选择器用
        nav             :   null, //是否有导航,如果为true则会查找导航ele,如果导航ele跟内容ele的length不一样则停止,可为function,this指针为当前选择器,参数len为内容length
        run             :   true, //是否运行
        callback        :   null, //回调
        plugins         :   null//插件名称，可以用 , 分隔多个插件
    };
    a[nameSpace].plugins = {}; //插件包
    a[nameSpace].add = function(name, options, fn){
        if("function" === typeof (options)){
            options = [fn,fn=options][0];
        }
        if("function" === typeof(fn)){
            this.plugins[name] = {
                callback    :   fn,
                options     :   options
            };
        }
    }
}(jQuery, "tab"));