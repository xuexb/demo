/**
 * ajax上传插件(单文件上传,form+iframe操作), 请配合 css 完成, 窗口resize的时候只会修改 left,top
 * @author xieliang
 * @email   xieyaowu@meishichina.com
 * @todo 将要换成 prototype 来实例,
 * @memberOf msc.tools
 * @namespace msc.tools.upload
 * @example
 *     1, msc.tools.upload({
 *         url: '',
 *         id:'#id',
 *         change: function(value){
 *             //return false则不会上传
 *         },
 *         success:function(res){
 *             //res 为后端返回值
 *         },
 *         error: function(res){
 *             //res 为后端返回值
 *         },
 *         mouseover: function(){
 *             //this = 当前的dom
 *         },
 *         mouseout: function(){
 *         }
 *     });
 *
 *     2, 移除某个实例
 *         msc.tools.upload.destory("#id");//该方法会把上传表单移除
 *     3, 后端返回值
 *         成功:
 *             {error:0, data:{src:"图片路径"}}, success:function(res){ res.error = 0; res.data.src='图片路径'}
 *         失败:
 *             {error: -1, msg:'上传失败'} , error: function(res){res.error = -1; res.msg = '上传失败'}
 */
(function($, msc) {
    var count = 0,
        tools = msc.tools;


    tools.upload = function(config) {
        config = $.extend({
            id: '', //选择器
            name: 'msc_upload', //后端php接收的name值
            mouseover: $.noop, //滑过
            mouseout: $.noop, //滑出
            url: "", //后端url
            success: $.noop, //成功回调
            error: $.noop, //错误回调
            change: $.noop //改变回调
        }, config || {});

        //选择器空
        config.id = getjQuery(config.id);
        if (!config.url || !config.id.length) {
            return tools;
        }

        $.each(config.id, function() {
            var that = this,
                id,
                $iframe,
                $form,
                $file,
                $that,
                _resize;
            if (!that._upload) {
                that._upload = id = "msc_upload_" + (count++);

                _resize = function() {
                    var offset = $that.offset();
                    $form.css({
                        left: offset.left,
                        top: offset.top
                    });
                    offset = null;
                }

                $that = $(that);



                //用iframe模拟
                $iframe = $('<iframe id="' + id + '_iframe" name="' + id + '" style="display:none;"></iframe>').appendTo(document.body);

                //表单
                $form = $('<form id="' + id + '_form" action="' + config.url + '" class="ui-upload" target="' + id + '" title="点击选择文件" method="post" enctype="multipart/form-data"><input type="file" name="' + config.name + '" /></form>').appendTo(document.body).css({
                    width: $that.outerWidth(true),
                    height: $that.outerHeight(true)
                });

                //绑定事件
                _resize();
                msc.event.resize.add(_resize);

                //模拟上传按钮
                $file = $form.find("input")
                    .mouseenter($.proxy(config.mouseover, that))
                    .mouseleave($.proxy(config.mouseout, that))
                    .change(function() {
                        if ($file.val() && config.change.call(that, $file.val()) !== false) { //如果change的事件返回false则不上传
                            $form.submit();
                            var parames,
                                timer;
                            if (!tools.browser.isMedia) { //解决ie6-8iframe上传不稳定bug， 摘自 贤心
                                timer = setInterval(function() {
                                    try {
                                        parames = $.parseJSON($iframe.contents().find('body').text());
                                    } catch (e) {}
                                    if (parames) {
                                        clearInterval(timer);
                                        timer = null;
                                        if (parames.error === 0) {
                                            config.success.call(that, parames);
                                        } else {
                                            config.error.call(that, parames);
                                        }
                                    }
                                }, 200);
                            } else {
                                $iframe[0].onload = function() {
                                    try {
                                        parames = $.parseJSON($iframe.contents().find('body').text());
                                    } catch (e) {
                                        parames = {
                                            error: -1,
                                            msg: "返回值错误"
                                        }
                                    }
                                    if (parames.error === 0) {
                                        config.success.call(that, parames);
                                    } else {
                                        config.error.call(that, parames);
                                    }

                                    $iframe[0].onload = null;
                                };
                            }

                        }
                    });
            }
        });


        return this;
    }

    /**
     * 移除上传用的表单
     */
    tools.upload.destroy = function(id) {
        if ((id = getjQuery(id)).length) {
            $.each(id, function() {
                var that = this,
                    id;
                if (that._upload) {
                    id = that._upload;
                    $("#" + id + "_iframe").remove();
                    $("#" + id + "_form").remove();
                    that._upload = undefined;//ie里给dom上用delete会报错
                }
            });
        }

        return tools;
    }


    function getjQuery(id) {
        if (id && !(id instanceof jQuery)) {
            id = $(id);
        }
        return id;
    }


}(jQuery, msc));