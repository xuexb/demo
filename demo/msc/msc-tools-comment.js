/**
 * 前端评论
 * @description 依赖 comment.css, msc-tools-date.js, msc-user.js, msc.event, 自动分页, 自动验证是否登录
 * @author xieliang
 * @version 1.0
 *
 * @namespace msc.tools.comment
 * @memberOf msc.tools
 *
 * 
 * 
 * @example
 *     1, 默认加载
 *         msc.tools.comment.init(config);//config为配置参数
 *     2, 按滚动到评论框时加载
 *         msc.tools.comment.init({
 *             isScroll: true
 *         });
 *     3, 外部按需加载
 *         msc.tools.comment.init({
 *             isScroll: false,
 *             run: false
 *         });
 *
 *         在需要加载的时候:
 *         msc.tools.comment.run();
 *
 *      4, 配置相关参数:
 *          msc.tools.comment.init({
 *              url: {
 *                  list:'/demo.php?aaa'
 *              }
 *          });
 *      5, 配置坐标TOP偏移, 由于页面可能有fixed定位到头部的元素
 *          msc.tools.comment.init({
 *              offsetTop: 40//-40
 *          });
 *      6, 配置后端参数
 *          msc.tools.comment.init({
 *              data: {
 *                  idtype: 'goods',
 *                  id: 123,
 *                  author: 'xieliang'
 *              }
 *          });
 *       7, 外部接口:
 *           msc.tools.comment.init(config) 跟 msc.tools.comment(config) 相同用法, 负责初始化评论, 惰性方法
 *           msc.tools.comment.reload(); 刷新评论, 会加载到第一页
 *           msc.tools.comment.run(); 加载评论, 一般用于按需加载, 惰性方法
 *       8, demo
 *           http://home.meishichina.com/test/demo/comment.html
 */


/**
 * @name msc.tools.comment.init
 * @description 初始化评论, 惰性方法
 * @function
 * @memberOf msc.tools.comment
 * 
 * @param {object} config 配置参数
 * @param {boolean} [config.run=true] 是否直接加载
 * @param {number} config.offsetTop 坐标偏移top,支持正负
 * @param {selector} config.element 评论框容器, 支持 HtmlElement,jQuery,string
 * @param {object} config.order 排序对象, key,text方式 [{key:'1',text:'一'}]
 * @param {object} config.data 后端配置参数, pageSize,page,orderBy为必须参数,默认有配置
 * 
 * @param {object} config.url 后端url配置
 * @param {string} [config.url.list = /ajax/comment.php?ac=clist] 列表
 * @param {string} [config.url.add = /ajax/comment.php?ac=add] 发表
 * @param {string} [config.url.del = /ajax/comment.php?ac=cdel] 删除
 * @param {string} [config.url.reply = /ajax/comment.php?ac=creply] 回复
 * @param {string} [config.url.getInfo = /ajax/comment.php?ac=cedit] 编辑前获取要编辑的内容
 * @param {string} [config.url.save = /ajax/comment.php?ac=csave] 保存编辑的
 *
 * @param {string} [config.str=还没有人评论，抢占第一条吧~] 没有评论时的提示文字
 * @param {boolean} [config.isAdd=true] 是否出现发表评论
 * @param {boolean} [config.isScroll=true] 是否开启滚动加载(滚动到评论可见时才加载)
 * @param {boolean} [config.isPage] 是否显示分页导航
 * @param {boolean} [config.isOrder] 是否显示排序
 */

/**
 * @name msc.tools.comment.reload
 * @description 刷新评论, 会把评论加载到第一页
 * @function
 * @memberOf msc.tools.comment
 */
/**
 * @name msc.tools.comment.run
 * @description 加载评论, 一般用于按需加载
 * @function
 * @memberOf msc.tools.comment
 */

(function($, msc){
    var USER = msc.user,//引用用户
        DIALOG= msc.ui.dialog,//引用弹出层
        MSCEVENT = msc.event,//事件延迟引用
        ELAPSED = msc.tools.date.elapsed,//美化时间
        LOADINGCLASS = 'loading',//text加载loading的class名
        cache = {},//缓存
        Event,//委托事件包
        tools,//工具包
        _$,//查找元素
        getTemplate;//获取编译模板

    var comment = msc.tools.comment = function(config){
        return comment.init(config);
    }


    comment.init = function(config){
        config = comment.config = $.extend(true, {}, {
            run: 1, //运行
            offsetTop: 0, //定位坐标偏移top, 支持正负
            element: null, //评论框总容器
            order: [ //排序 key,value
                {
                    'key': 'desc',
                    'text': '最新'
                },
                {
                    'key': 'asc',
                    'text': '最早'
                }
            ],
            data: {
                pageSize: 15,
                page: 1,
                orderBy: 'desc'//当前什么排序
            }, //后端参数
            url: {
                list: "#",
                add: "#",
                del: "#",
                reply: "#",
                getInfo: "#",
                save: "#"
            },
            str: '还没有人评论，抢占第一条吧~',

            isAdd: 1, //是否让其发表新评论
            isScroll: 1, //是否按需加载,设置他将让你的run变无浮云
            isPage: 1, //是否显示分页导航
            isOrder: 0 //是否显示排序
        }, config || {});

        if((config.element = $(config.element)).length < 1){
            return comment;
        }


        //特殊处理url中有cid(要求查看某回复的时候)
        if(msc.tools.queryUrl("cid")){
            config.data.cid = msc.tools.queryUrl("cid");
        }
        

        //在用户初始化后再调用, 保证能够得到用户信息
        USER.ready(function() {
            if (config.isScroll) { //如果按需加载
                if (MSCEVENT) { //如果有event事件则按需
                    MSCEVENT.scroll.add("comment", function(win) {
                        if (win.scrollTop + win.height >= config.element.offset().top) {
                            comment.run();
                            MSCEVENT.resize.remove("comment");
                            return false;
                        }
                    });
                    MSCEVENT.resize.add("comment", function() {
                        MSCEVENT.scroll.trigger("comment");
                    });
                    setTimeout(function() {
                        MSCEVENT.scroll.trigger("comment");
                    }, 100);
                } else { //否则直接加载
                    comment.run();
                }
            } else {
                config.run && comment.run(); //如果运行
            }
        });

        comment.init = noop;
    }

    comment.run = function(){
        //输出HTML
        appendHtml();

        //绑定数据
        bindEvent();

        //如果有配置排序
        if (comment.config.isOrder) {
            _$("order").find("a[data-type='" + comment.config.data.orderBy + "']").click();
        } else {
            getListJson();
        }

        comment.run = noop;
    }

    comment.reload = function(){
        comment.config.data.page = 1;
        getListJson();
        return comment;
    }



    /**
     * 请求列表数据
     */
    function getListJson() {
        if (!cache.GETING) {
            //打标识
            cache.GETING = 1;
            _$("loading").show();
            _$("error").hide();


            $.get(getUrl("list"), function(res) {
                if (res.error === 0) { //如果为0算成功
                    renderData(res);
                } else {
                    _$("error").html('数据加载失败, <a href="javascript:;" onclick="msc.tools.comment.reload();">重试</a>!').show();
                }

                _$("loading").hide();
                delete cache.GETING;
            }, "json");

        }
    }


    /**
     * 渲染数据
     * @param {object} res 后端整个返回值
     */
    function renderData(res) {
        var config = comment.config,
            str;

        //清空列表数据
        //为什么要用empty呢? 而不是innerHTML=''?
        //因为列表里有的元素上有绑定数据, 直接innerHTML不能销毁对jQuery数据缓存, 而empty可以
        _$("list").empty();

        if(res.data && res.data.length){//有数据
            config.recordCount = res.recordCount | 0; //得到后端返回的记录数
            config.pageCount = Math.ceil(config.recordCount / config.data.pageSize); //计算出多少页
            str = getTemplate("list")({
                list: res.data || [],
                renderBefrom: renderBefrom,
                elapsed: ELAPSED
            });

            //如果是ie6则没有效果
            if(msc.tools.browser.isIe6){
                _$("list")[0].innerHTML = str;
            } else {
                $(str).hide().appendTo(_$("list")).fadeIn();
            }


            //如果有cid
            //且前端的cid跟后端的cid一致才算真爱
            if(config.data.cid && config.data.cid == res.data[0].cid){
                _$("lookReply").show().find("a").click(function(){
                    delete config.data.cid;
                    _$("lookReply").hide();
                    comment.reload();
                    return false;
                });
                config.pageCount = 0;//把分页临时修改让分页方法不输出
            }
            
        } else {
            config.pageCount = config.recordCount = 0;
            _$("error").html(config.str).show();
        }


        
        //设置记录数
        setRecordcount();

        //设置分页
        setPage();
        
    }


    /**
     * 设置记录数
     * @param {string} str 如果为-则为减少一条, 为+则为添加一条
     */
    function setRecordcount(str){
        if (str === "-") {
            --comment.config.recordCount;
        } else if (str === "+") {
            ++comment.config.recordCount;
        };
        _$("recordCount")[0].innerHTML = (comment.config.recordCount | 0) + "条";
    }

    /**
     * 获取最新的url
     * @param  {string} type 类型，如： list,add,reply,del,save
     * @return {string}      最新配置的url
     */
    function getUrl(type) {
        var config = comment.config,
            url = config.url[type];
        if(url.indexOf("?") > -1){
            url += '&';
        } else {
            url += '?';
        }
        return url + $.param(config.data) +"&r="+ (+new Date);
    }


    /**
     * 输出HTML代码到页面
     */
    function appendHtml(){
        var config = comment.config,
            html = '';

        //处理发表框框
        if(config.isAdd){
            html += getTemplate('text')({
                type: 'add',
                typeValue: '发表评论'
            });
        }

        //处理导航
        html += '<div class="comment-nav mt20" data-dom="nav">'+
                    '<div class="left">最新评论 <strong>（<span data-dom="recordCount">0</span>）</strong></div>';

        //是否显示排序
        if (config.isOrder) {
            html += '<div class="right" data-dom="order">';
            $.each(config.order, function(index, value) {
                html += '<a href="#" data-type="' + value.key + '" title="点击切换到 [' + value.text + '] 排序">' + value.text + '</a>'
            });
            html += '</div>';
        }
        html += '</div>';


        //处理是查看回复的时候
        html += '<div class="comment-cid mt10" data-dom="lookReply">'+
                    '<a href="#">您正在查看回复评论, 点击查看全部评论</a>'+
                '</div>';

        //列表
        html += '<div class="comment-list mt10">'+
                    '<div class="data-error" data-dom="error"></div>'+//处理错误的时候
                    '<div class="comment-loading" data-dom="loading">正在请求数据</div>'+
                    '<div data-dom="list"></div>'+
                '</div>';

        //处理分页
        if(config.isPage){
            html += '<div class="ui-page mt20" data-dom="page"><div class="ui-page-inner" data-dom="pageInner"></div></div>';
        }



        //输出到页面上
        config.element[0].innerHTML = '<div data-dom="wrap" class="comment-wrap">'+ html +'</div>';
    }




    //事件委托集合
    Event = {

        //取消编辑
        edit_cancel: function(){
            $(this).closest("li").data("status", 2).find(".content").show().next().hide();
        },

        //编辑提交 
        edit_submit: function(){
            var $li = $(this).closest("li"),
                $edit,
                $content;

            if ($li.data("status") !== 4) { //如果不是正在请求
                $edit = $li.find(".comment-edit");
                $content = $li.find(".content");

                textVerification($edit.find(".text")[0].value, $edit.find(".text"), function(value, $text) {
                    $li.data("status", 4);
                    $edit.addClass(LOADINGCLASS);//添加loading标
                    
                    //post保存
                    $.post(getUrl("save") + "&cid=" + $li.attr("data-id"), {
                        message: value
                    }, function(res) {
                        $edit.removeClass(LOADINGCLASS);//移除loading标
                        if (res.error === 0 && res.data && res.data.message) {
                            $content.html(res.data.message).show();
                            $edit.hide();
                            $li.data("status", 2);
                        } else {
                            $li.data("status", 3);
                            DIALOG.error(res.msg || "待会再试吧");
                        }
                    }, "json");
                });
            }
        },

        //编辑
        edit: function(){
            var that = this,
                $li = $(that).closest("li"),
                $edit,//编辑容器
                status = $li.data("status") | 0;//状态值, 0没有加载过框框, 1正在请求, 2已请求完,但框框已经隐藏, 3已请求完,正在显示框框, 4正在修改中

            if(status === 0){

                //设置状态
                $li.data("status", 1);

                //隐藏内容
                $li.find(".content").hide();

                //编译模板并设置为loading状态
                $edit = $(getTemplate("text")({
                    type: 'edit',
                    typeValue: '保存',
                    className: LOADINGCLASS
                })).appendTo($li.find(".detail"));


                //请求ajax
                //因为这是ubb代码, 前端不能把标签改成text里显示的, 所有得向后端请求返回html实体符代码
                $.get(getUrl("getInfo"), {
                    cid: $li.attr("data-id")
                }, function(res) {
                    if(res.error === 0 && res.data && res.data.message){//成功
                        $li.data("status", 3);//设置状态
                        $edit.removeClass(LOADINGCLASS).find(".text").val(res.data.message).focus();//聚焦
                    } else {
                        DIALOG.error(res.msg || '请求失败');
                        $edit.remove();
                        $li.data("status", 0).find(".content").show();
                    }
                },"json");
            } else if(status === 2){
                $li.data("status", 3).find(".content").hide();
                $li.find(".comment-edit").show().find(".text").focus();
            } else if(status === 3){
                $li.data("status", 2).find(".content").show();
                $li.find(".comment-edit").hide();
            }
        },

        //删除
        del: function(){
            var that = this,
                $li;

            if (that.innerHTML !== '删除中') {
                $li = $(that).closest("li");
                DIALOG.alert({
                    content: (($li.data("status") | 0) === 3 ? ["您正在编辑该评论，确定删除吗？", "删除后您当前编辑的内容也将删除"] : "确定删除这条评论吗？"),
                    okValue: "删除",
                    ok: function() {
                        that.innerHTML = '删除中';
                        $.get(getUrl("del"), {
                            cid: $li.attr("data-id")
                        }, function(res) {
                            if (res.error === 0) {
                                DIALOG.success("删除成功");
                                if(_$("list").find("li").length < 2){
                                    comment.reload();
                                } else {
                                    $li.slideUp(300, function() {
                                        $(this).remove();
                                    });
                                    setRecordcount("-"); //成功删除一条则把评论数-1
                                }
                                
                            } else {
                                DIALOG.error(res.msg || "亲，休息会再试吧");
                                that.innerHTML = '删除';
                            }

                            $li = null;
                        }, "json");
                    },
                    cancel: 1
                });
            }
        },
        
        //取消回复
        reply_cancel: function(){
            $(this).closest("li").data("status", 3).find(".comment-reply").hide();
        },

        //回复
        reply: function(){
            var that = this,
                $li = $(that).closest("li"),
                status =  $li.data("status") | 0;//0==没有加载过回复框， 1==已显示框， 2==正在回复， 3==已加载过但没有显示

            if(status === 0){
                $li.data("status", 1);
                $(getTemplate("text")({
                    type:'reply',
                    typeValue: '回复'
                })).appendTo($li.find(".detail")).find(".text").focus();
            } else if(status === 1){
                $li.data("status", 3).find(".comment-reply").hide();
            } else if(status === 3){
                $li.data("status", 1).find(".comment-reply").show().find(".text").focus();
            }
        },

        //回复提交
        reply_submit: function(){
            var that = this,
                $li = $(that).closest("li"),
                $reply;

            if($li.data("status") !== 2){
                $reply = $li.find(".comment-reply");

                textVerification($reply.find(".text")[0].value, $reply.find(".text"), function(value, $text){
                    $reply.addClass(LOADINGCLASS);
                    $li.data("status", 2);

                    $.post(getUrl("reply") +"&cid=" + $li.attr("data-id"), {
                        message: value
                    }, function(res){
                        $reply.removeClass(LOADINGCLASS);

                        if(res.error === 0 && res.data && res.data.message){//回复成功
                            _$("list").find("ul").prepend(getTemplate("item")({
                                cid: res.data.cid,
                                userName: USER.data.userName,
                                userId: USER.data.userId,
                                avatarPic: USER.data.avatarPic,
                                message: res.data.message
                            }));
                            setRecordcount("+"); //设置评论数
                            scrollTo("#J_comment_item_" + res.data.cid); //滚动到新的评论这
                            $text.val("");
                            $reply.hide();
                            return $li.data("status", 3);
                        } else if(res.error === 10001){
                            USER.exit().login();
                        } else if (res.state === "error") { //垃圾过滤
                            DIALOG.error("亲，请修改您的内容");
                            $text.focus();
                        } else {
                            DIALOG.error(res.msg || "亲，休息会再试吧");
                        }

                        $li.data("status", 1);
                    }, "json");
                });
            }
        },

        //插入表情
        smilies: function(){
            var that = this;
            msc.ui.smilies(that, function(title){
                tools.add($(that).closest(".comment-post").find(".text")[0], title);
            });
        },

        //发表评论
        add_submit: function(){
            var that = this;

            if(that !== '发表中'){
                textVerification(_$("add").find(".text")[0].value, _$("add").find(".text"), function(message, $text) {
                    that.innerHTML = '发表中';
                    _$("add").addClass(LOADINGCLASS);

                    $.post(getUrl("add"), {
                        message: message
                    }, function(e) {
                        _$("add").removeClass(LOADINGCLASS);
                        that.innerHTML = '发表评论';

                        if (e.error === 0 && e.data) {
                            if (_$("list").find("li").length < 1) { //如果没有数据则请求数据，有才静态追加
                                getListJson();
                            } else {
                                _$("list").find("ul").eq(0).prepend(getTemplate("item")({
                                    cid: e.data.cid,
                                    userName: USER.data.userName,
                                    userId: USER.data.userId,
                                    avatarPic: USER.data.avatarPic,
                                    message: e.data.message
                                }));
                                scrollTo("#J_comment_item_" + e.data.cid);
                                setRecordcount("+"); //设置评论数
                            }
                            $text[0].value = ""; //清空评论
                            DIALOG.success("评论成功");
                        } else if (e.state === "error") { //垃圾过滤
                            DIALOG.error("亲，请修改您的内容");
                            $text[0].focus();
                        } else {
                            DIALOG.error(e.msg || "亲，休息会再试吧");
                            $text[0].focus();
                        }
                    },"json");
                });
            }
        },

        //登录
        login: $.noop
    }


    /**
     * 绑定事件
     */
    function bindEvent(){
        var config = comment.config;

        //处理导航
        if (config.isOrder) {
            _$("order").on("click", "a", function(event) {
                if(!cache.GETING){//没有在请求中才算真爱
                    $(this).addClass("on").siblings().removeClass("on");
                    config.data.orderBy = $(this).attr("data-type");
                    config.data.page = 1;
                    getListJson();
                }
                event.preventDefault();
            });
        }

        //分页
        if (config.isPage) {
            _$("page").on("click", "a", function(event) {
                if(!cache.GETING){//没有在请求中才算真爱
                    config.data.page = this.getAttribute("data-page");
                    getListJson();
                    scrollTo(_$("nav").offset().top);
                }
                event.preventDefault();
            });
        }


        //委托包
        _$("wrap").on("click", "a.J_event", function(event){
            var that = this,
                type = that.getAttribute("data-type");
            if(type && Event[type]){//如果有事件
                if(type === 'smilies' || type.indexOf("cancel") > -1){//判断几个特殊的
                    Event[type].call(that);
                } else {
                    USER.login(function(){
                        Event[type].call(that);
                    });
                }
            }
            event.stopPropagation();
            event.preventDefault();
        });


        if(USER.check()){//如果已登录

            //委托ctrl+enter提交
            _$("wrap").on("keydown", ".text", function(e) {
                if (e.ctrlKey && e.keyCode === 13) {
                    $(this).closest(".comment-post").find("a.comment-btn").click();
                }
            });

           
            //委托css3的聚焦阴影
            if(msc.tools.browser.isMedia){
                _$("wrap").on("focus", ".text", function(){
                    $(this).closest(".comment-post-text").addClass("comment-post-focus");
                }).on("blur", ".text", function(){
                    $(this).closest(".comment-post-text").removeClass("comment-post-focus");
                });
            }

            //添加已登录的类
            _$("add").addClass("islogin");
        }

        
        //每隔1分钟美化时间
        setInterval(function(){
            _$("list").find("span.subtime").each(function(){
                this.innerHTML = ELAPSED(this.getAttribute("data-time") * 1000);
            });
        }, 6e4);
    }


    /**
     * 模拟惰性函数
     */
    function noop(){
        return comment;
    }


    /**
     * 渲染来路
     */
    function renderBefrom(str) {
        str = (str + "").toLowerCase();
        var url = 'http://www.meishichina.com/Mobile/',
            befrom = { //来路
                wap: {
                    name: "手机版",
                    url: url + "WAP/"
                },
                iphone: {
                    name: "iPhone客户端",
                    url: url + "iPhone/"
                },
                ipad: {
                    name: "iPad客户端",
                    url: url + "iPad/"
                },
                android: {
                    name: "Android客户端",
                    url: url + "Android/"
                },
                symbian: {
                    name: "Symbian客户端",
                    url: url + "Symbian/"
                },
                kjava: {
                    name: "Kjava客户端",
                    url: url + "Kjava/"
                }
            },
            key;
        for (key in befrom) {
            if (str.indexOf(key) > -1) { //只要包含就算他是 啦啦啦
                befrom = '<div class="comment-befrom">来自: <a href="' + befrom[key].url + '" target="_blank">' + befrom[key].name + '</a></div>';
                break;
            }
        }
        return "string" === typeof(befrom) ? befrom : "";
    }


    /**
     * 滚动页面的滚动条, 啦啦啦, 有妹子有激情...
     */
    function scrollTo(top){
        if("number" !== typeof(top)){
            top = $(top).offset().top;
        }
        window.scrollTo(0, top + (comment.config.offsetTop|0));
    }


    /**
     * 设置分页
     */
    function setPage() {
        var str = "",
            conf = comment.config,
            page = conf.data.page | 0,
            pageSize = conf.pageSize | 0,
            i = 1,
            pageCount = conf.pageCount | 0;


        if (pageCount > 1) {
            
            if (page > 1) {
                str += '<a href="#" data-page="' + (page - 1) + '">上一页</a>';
            }

            if (pageCount < 7) {
                for (i; i <= pageCount; i++) {
                    if (page === i) {
                        str += '<span class="on">' + i + '</span>';
                    } else {
                        str += '<a href="#"" data-page="' + i + '">' + i + '</a>';
                    }
                }
            } else {
                var start, end;
                if (page === 1) {
                    str += '<span class="on">1</span>';
                } else {
                    str += '<a href="#" data-page="1">1</a>';
                };
                if (page > 4) {
                    str += '<span class="dot">...</span>';
                };
                if (page < 5) {
                    start = 1;
                } else {
                    start = page - 2;
                };

                if (page > (pageCount - 4)) {
                    end = pageCount;
                } else {
                    end = page + 3;
                };
                for (var i2 = start; i2 < end; i2++) {
                    if (i2 !== 1 && i2 !== pageCount) { //避免重复输出1和最后一页
                        if (i2 === page) {
                            str += '<span class="on">' + i2 + '</span>';
                        } else {
                            str += '<a href="#" data-page="' + i2 + '">' + i2 + '</a>';
                        };
                    };
                };
                if (page < (pageCount - 4)) {
                    str += '<span class="dot">...</span>';
                };
                if (page === pageCount) {
                    str += '<span class="on">' + pageCount + '</span>';
                } else {
                    str += '<a href="#" data-page="' + pageCount + '">' + pageCount + '</a>';
                };
                start = end = null;
            };

            if (page < pageCount) {
                str += '<a href="#" data-page="' + (page + 1) + '">下一页</a>';
            };
            page = pageCount = pageSize = i = null;
        }
        if (str) { //如果有分页才显示分页dom，否则不显示，为了解决底部有空白问题
            _$("page").show()[0].children[0].innerHTML = str;
            str = null;
        } else {
            _$("page").hide();
        }
    }


    /**
     * 获取缓存的jQuery对象
     */
    _$ = function(){
        var cache = {};
        return function(name){
            return cache[name] || (cache[name] = comment.config.element.find("[data-dom='"+ name +"']"));
        }
    }();


    /**
     * 获取编译模板
     * @param {string} type 要获取的类型, list为列表模板, item为当前的块, text为通用文本框
     * @return {function} 编译后的方法, 需要拿数据渲染
     */
    getTemplate = function (){
        var cache =  {
            _text:   '<div class="comment-post comment-<%=type%> <%=className%>" data-dom="<%=type%>">'+
                        '<%if (type==="add"){ %>'+
                            '<div class="comment-login" title="请先登录"></div>'+
                            '<div class="comment-login-text" title="请先登录"><a href="javascript:;" class="J_event" data-type="login">登陆</a>后参与讨论，发表评论</div>'+
                        '<% } %>'+
                        '<div class="comment-post-loading"></div>'+
                        '<i class="arrow"></i>'+
                        '<div class="comment-post-text">'+
                            '<div class="comment-post-text-inner">'+
                                '<textarea class="text ui-webkit-scrollbar" title="Ctrl+Enter 也可提交哦"></textarea>'+
                            '</div>'+
                        '</div>'+
                        '<div class="comment-post-tools clear">'+
                            '<div class="left">'+
                                '<a href="#" class="J_event comment-smilies-a" data-type="smilies" title="插入表情"></a>'+
                                '<span class="tips">Ctrl+Enter 也可提交哦</span>'+
                            '</div>'+
                            '<div class="right">'+
                                '<% if(type !== "add"){ %>'+
                                    '<a href="#" class="tips J_event" data-type="<%=type%>_cancel">取消</a>'+
                                '<% } %>'+
                                '<a href="#" class="comment-btn J_event" data-type="<%=type%>_submit"><%=typeValue%></a>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
            _list:  '<ul>'+
                        '<%for(var i = 0,len=list.length;i<len;i++){ %>'+
                            '<li id="J_comment_item_<%=list[i].cid%>" data-id="<%=list[i].cid%>">'+
                                '<div class="pic">'+
                                    '<a href="http://home.meishichina.com/space-<%=list[i].authorid%>.html" target="_blank" title="点击进入 <%=list[i].author%> 的主页">'+
                                        '<img src="<%=list[i].avatarpic%>" width="48" height="48">'+
                                    '</a>'+
                                '</div>'+
                                '<div class="detail">'+
                                    '<div class="tools">'+
                                        '<div class="left">'+
                                            '<a title="点击进入 <%=list[i].author%> 的主页" href="http://home.meishichina.com/space-<%=list[i].authorid%>.html" target="_blank"><%=list[i].author%></a><span class="subtime" data-time="<%=list[i].dateline%>"><%=elapsed(list[i].dateline * 1000)%></span>'+
                                        '</div>'+
                                        '<div class="right">'+
                                            '<%if(list[i].isEdit){ %>'+
                                                '<a href="#" class="J_event" data-type="edit">编辑</a>'+
                                            '<% } %>'+
                                            '<%if(list[i].isDelete){ %>'+
                                                '<a href="#" class="J_event" data-type="del">删除</a>'+
                                            '<% } %>'+
                                            '<%if(list[i].isReply){ %>'+
                                                '<a href="#" class="J_event" data-type="reply">回复</a>'+
                                            '<% } %>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="content"><%==list[i].message%></div>'+
                                    '<% if(list[i].befrom){ %>'+
                                        '<%==renderBefrom(list[i].befrom)%>'+
                                    '<% } %>'+
                                '</div>'+
                            '</li>'+
                        '<% } %>'+
                    '</ul>',
            _item:  '<li id="J_comment_item_<%=cid%>" data-id="<%=cid%>">'+
                        '<div class="pic">'+
                            '<a href="#">'+
                                '<img src="<%=avatarPic%>" width="48" height="48">'+
                            '</a>'+
                        '</div>'+
                        '<div class="detail">'+
                            '<div class="tools">'+
                                '<div class="left">'+
                                    '<a title="点击进入 <%=userName%> 的主页" href="http://home.meishichina.com/space-<%=userId%>.html" target="_blank"><%=userName%></a><span>刚刚</span>'+
                                '</div>'+
                                '<div class="right">'+
                                    '<a href="#" class="J_event" data-type="edit">编辑</a><a href="#" class="J_event" data-type="del">删除</a>'+
                                '</div>'+
                            '</div>'+
                            '<div class="content"><%==message%></div>'+
                        '</div>'+
                    '</li>'
        }

        return function(type){
            // console.log("加载："+ type);
            if (cache[type]) {
                // console.log("存在缓存，直接拿缓存")
                return cache[type];
            } else {
                // console.log("没有缓存，开始编译 "+ type)
                cache[type] = msc.template.compile(cache["_" + type]);
                // console.log("编译完成： "+ type)
                delete cache["_" + type];
                // console.log("删除模板并写入缓存： "+ type)
                return cache[type];
            }
        }
    }();



    /**
     * 验证文本框的值
     * @param  {string} value 要验证的值
     * @param {object} $text 文本框元素
     * @param {function} fn 回调, 参数1为要验证的值,参数2为文本框元素
     */
    function textVerification(value, $text, fn) {
        if (!value || (value = $.trim(value)) === "") {
            DIALOG.error("请填写内容!");
            $text.focus();
        } else if (value.length < 6) {
            DIALOG.error("再填写点内容吧!")
            $text.focus();
        } else {
            fn(value, $text);
        }
    }



    tools = {
        

        /**
         * 获取光标位置
         * @param  {element} ele dom对象
         * @return {number}     光标位置索引
         */
        getCursorPosition: function(ele) {
            if (document.selection) {
                ele.focus();
                var ds = document.selection;
                var range = ds.createRange();
                var stored_range = range.duplicate();
                stored_range.moveToElementText(ele);
                stored_range.setEndPoint("EndToEnd", range);
                ele.selectionStart = stored_range.text.length - range.text.length;
                ele.selectionEnd = ele.selectionStart + range.text.length;
                return ele.selectionStart;
            } else {
                return ele.selectionStart;
            }
        },

        /*
         * 设置光标位置
         * @Method setCursorPosition
         * @param p number
         */
        setCursorPosition: function(ele, p) {
            this.sel(ele, p, p);
        },

        /*
         * 插入到光标后面
         * @Method add
         * @param t element
         * @param txt String
         * @return
         */
        add: function(ele, txt) {
            var val = ele.value;
            if (document.selection) {
                ele.focus()
                document.selection.createRange().text = txt;
            } else {
                var cp = ele.selectionStart;
                var ubbLength = ele.value.length;
                var s = ele.scrollTop;
                ele.value = ele.value.slice(0, ele.selectionStart) + txt + ele.value.slice(ele.selectionStart, ubbLength);
                this.setCursorPosition(ele, cp + txt.length);
                msc.tools.browser.mozilla && setTimeout(function() {
                    if (ele.scrollTop != s) ele.scrollTop = s;
                }, 0);
            };
        },


        /*
         * 删除光标 前面或者后面的 n 个字符
         * @Method del
         * @param ele element
         * @param n number  n>0 后面 n<0 前面
         * @return
         * 重新设置 value 的时候 scrollTop 的值会被清0
         */
        del: function(ele, n) {
            var p = this.getCursorPosition(ele);
            var s = ele.scrollTop;
            var val = ele.value;
            ele.value = n > 0 ? val.slice(0, p - n) + val.slice(p) :
                val.slice(0, p) + val.slice(p - n);
            this.setCursorPosition(ele, p - (n < 0 ? 0 : n));
            msc.browser.mozilla && setTimeout(function() {
                if (ele.scrollTop != s) ele.scrollTop = s;
            }, 10);
        },

        /*
         * 选中 s 到 z 位置的文字
         * @Method sel
         * @param ele element
         * @param s number
         * @param z number
         * @return
         */
        sel: function(ele, start, end) {
            if (document.selection) {
                var range = ele.createTextRange();
                range.moveEnd('character', -ele.value.length);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            } else {
                ele.setSelectionRange(start, end);
                ele.focus();
            }
        },


        /*
         * 选中一个字符串
         * @Method sel
         * @param ele element
         * @param str String
         * @return
         */
        selString: function(ele, str) {
            var index = ele.value.indexOf(str);
            index != -1 ? this.sel(ele, index, index + str.length) : false;
        }
    };
}(jQuery, msc));