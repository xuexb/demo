/**
 * 上传插件(单文件上传,form+iframe操作), 兼容H5上传
 *     
 * @author xieliang
 * @namespace upload
 * @example
 *     1, upload({
 *         url: '',
 *         id:'#id',
 *         change: function(value){
 *             //return false则不会上传
 *         },
 *         success:function(res){//后端返回 res.error = 0 才算成功
 *             //res 为后端返回值
 *         },
 *         error: function(res){// 后端返回 res.error != 0 算失败
 *             //res 为后端返回值
 *         },
 *         mouseover: function(){//滑入
 *             //this = 当前的dom
 *         },
 *         mouseout: function(){//滑出
 *         },
 *         complete: function(){//请求完成时执行, 不管成功还是失败
 *         }
 *     });
 *
 *     3, 修改后端接收 name 值
 *         new upload({
 *             name: 'easy_upload_name'
 *         });
 *
 *     4, 移除某个实例
 *         var a = upload({id:"#xl"});
 *         a.destroy();//该方法会把上传表单+iframe移除
 *     5, 后端返回值
 *         成功:
 *             {error:0, data:{src:"图片路径"}} => success:function(res){ res.error = 0; res.data.src='图片路径'}
 *         失败:
 *             {error: -1, msg:'上传失败'} => error: function(res){res.error = -1; res.msg = '上传失败'}
 */

define(function(require) {
    'use strict';

    var $ = require('./jquery'),
        // Tools = require('./tools'),
        count = 0,
        namespace = 'xuexb_upload',
        isHtml5 = window.FormData,
        $body = $(document.body),
        prototype;


    /**
     * 构造函数
     * @param {object} config 配置参数
     */
    function Upload(config){
        var self = this;

        self.config = config = $.extend({}, Upload.defaults, config || {});

        self.__dom = {
            elem: $(config.elem)
        }



        if (!self.__dom.elem.length) {
            return self;
        }


        
        self.init();
    }



    /**
     * 原型链
     * @type {object}
     */
    prototype = Upload.prototype;

    /**
     * 初始化
     * @return {object} 当前实例
     */
    prototype.init = function(){
        var self = this;
        self.__dom.elem.each(function() {
            self.__create(this);
        });
        return self;
    }


    /**
     * 重置大小
     * @return {object} self
     */
    prototype.reset = function(){
        var self = this;

        self.__dom.elem.each(function(){
            var $that = $(this),
                key = $that.data(namespace);

            if(key){
                $('#'+ namespace + '_form').css({
                    width: $that.outerWidth(),
                    height: $that.outerHeight()
                });
            }

            $that = null;
        });

        return self;
    }



    /**
     * 移除上传用的表单
     */
    prototype.destroy = function() {
        var self = this,
            key;



        self.__dom.elem.each(function(){
            var $that = $(this),
                key = $that.data(namespace);

            if(key){
                if(!isHtml5){
                    $('#'+ key +'_iframe').remove();
                }
                $('#'+ key +'_form').remove();
                $that.off('.'+ namespace);
            }

            $that = null;
        });


        for(key in self){
            delete self[key];
        }


        self.destroyed = true;

        return self;
    }


    /**
     * 设置post数据
     * @param {string} key 数据键key
     * @param {string} value 数据键value
     */
    prototype.data = function(key, value){
        var self = this,
            data = self.config.data;

        if(value === void 0){
            return data[key];
        }

        if(value === false || value === null){
            delete data[key];
        } else {
            data[key] = value;
        }


        return self;
    }



    /**
     * 创建上传按钮
     * @param  {HtmlElement} that   目标元素
     * @param  {object} config 配置
     */
    prototype.__create = function(that){
        var self = this,
            config = self.config,
            $that = $(that),
            $iframe, key, $form, position_key, delay;

        // 如果已经绑定过
        if ($that.data(namespace)) {
            return;
        }


        //生成key并写入缓存
        key = namespace + (count += 1);
        $that.data(namespace, key);

        // 生成iframe并插入到页面
        if(!isHtml5){
            $iframe = $('<iframe id="'+ key +'_iframe" name="'+ key +'" class="ui-upload-iframe"></iframe>')
                .appendTo($body);
            // $iframe = $('<iframe />').attr({
            //     id: key +'_iframe',
            //     name: key,
            //     'class': 'ui-upload-iframe'
            // }).appendTo($body);
        }

        // 生成form表单并插入到页面
        $form = $('<form />').attr({
            id: key +'_form',
            action: config.url,
            'class': 'ui-upload-form',
            target: key,
            title: '点击选择文件',
            method: 'post',
            enctype: 'multipart/form-data'
        }).css({
            width: $that.outerWidth(),
            height: $that.outerHeight()
        }).html('<input type="file" name="' + config.name + '" />').appendTo($body);


        // 判断定位
        if($that.css('position') === 'fixed'){
            $form.css('position', 'fixed');
            position_key = 'position';
        } else {
            position_key = 'offset';
        }


        // 绑定事件
        delay = null;
        $that.on('mouseenter.' + namespace, function() {
            var offset;
            if(this.className.indexOf('loading') === -1 && this.className.indexOf('disabled') === -1){
                offset = $that[position_key]();
                $form.css({
                    left: offset.left,
                    top: offset.top
                }).show();
                clearTimeout(delay);
            }
        }).on('mouseleave.'+ namespace, function(){
            delay = setTimeout(function(){
                $form.hide();
            }, 300);
        });

        $form.hover(function(){
            clearTimeout(delay);
        }, function(){
            delay = setTimeout(function(){
                $form.hide();
            }, 300);
        });



        //模拟上传按钮
        $form.find('input')
            .mouseenter($.proxy(config.mouseover, that))
            .mouseleave($.proxy(config.mouseout, that))
            .change(function() {
                self.__ajax(this, that, $iframe, $form);
            });
    }


    /**
     * 用iframe+form模拟ajax
     * @param  {HtmlElement} file file元素
     * @param {HtmlElement} that 触发元素
     */
    prototype.__ajax = function(file, that, $iframe, $form){
        var self = this,
            config = self.config,
            parames, reg, data_str, xhr;

        //如果change的事件返回false则不上传
        if (file.value && config.change.call(that, file.value) !== false) {

            reg = new RegExp('\\.(' + config.ext.replace(/,/g, '|') + ')$', 'i');

            //验证扩展名
            if (config.ext && config.ext !== '*' && !reg.test(file.value)) {
                self.__success(that, {
                    errcode: 4,
                    errmsg: '请选择 ' + config.ext + ' 类型的文件'
                });
                self.__complete(that);

                //fix select no file
                file.value = '';
                return;
            }


            data_str = '';
            $.each(config.data, function(key, value){
                data_str += 
                    '<input value="'+ value +'" type="hidden" name="'+ key +'" class="ui-upload-form-data" />';
            });
            $form.find('.ui-upload-form-data').remove();
            $form.append(data_str);


            if(isHtml5){
                xhr = new XMLHttpRequest();

                if (xhr.upload) {
                    // 上传中
                    xhr.upload.addEventListener('progress', function(event) {
                        config.progress.call(that, event);
                    }, false);

                    // 文件上传成功或是失败
                    xhr.onreadystatechange = function() {
                        // fix destroy Upload
                        if (!self.destroyed) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    self.__success(that, Upload.__parseJSON(xhr.responseText));
                                } else {
                                    self.__error(that);
                                }

                                self.__complete(that);
                                file.value = '';
                            }
                        }
                    }


                    // 开始上传
                    xhr.open('POST', config.url, true);
                    xhr.send(new FormData($form[0]));
                }
            } else {
                $form.submit();
                // if (!Tools.browser.isMedia) { //解决ie6-8iframe上传不稳定bug， 摘自 贤心
                //     timer = setInterval(function() {
                //         parames = Upload.__parseJSON($iframe.contents().find('body').text());
                //         if (parames) {
                //             clearInterval(timer);
                //             timer = null;

                //             self.__success(that, parames);
                //             self.__complete(that);
                //             file.value = '';
                //         }
                //     }, 200);
                // } else {
                    $iframe[0].onload = function() {
                        $iframe[0].onload = null;

                        try{
                            parames = Upload.__parseJSON($iframe.contents().find('body').text());
                            self.__success(that, parames);
                        }catch(e){
                            self.__error(that);
                        }

                        
                        self.__complete(that);
                        file.value = '';
                    }
                // }
            }
        }
    }



    /**
     * 内部执行成功回调
     * @param  {HtmlElement} that    触发元素
     * @param  {object} parames 返回值
     */
    prototype.__success = function(that, parames){
        this.config.success.call(that, parames);
    }


    /**
     * 内部执行成功回调
     * @param  {HtmlElement} that    触发元素
     * @param  {object} parames 返回值
     */
    prototype.__error = function(that){
        this.config.error.call(that);
    }




    /**
     * 内部执行完成回调
     * @param  {HtmlElement} that    触发元素
     */
    prototype.__complete = function(that){
        this.config.complete.call(that);
    }


    Upload.__parseJSON = function(str) {
        var parames = null;

        if(str){
            try {
                //如果不符合json则报错
                parames = $.parseJSON(str);
            } catch (e) {
                parames = {
                    error: 4,
                    msg: '返回值错误'
                }
            }
        }

        return parames;
    }


    /**
     * 默认参数
     * @type {Object}
     */
    Upload.defaults = {
        elem: '', //选择器
        data: {},//附带后端的数据对象
        name: 'image', //后端php接收的name值
        mouseover: $.noop, //滑过
        mouseout: $.noop, //滑出
        url: '', //后端url
        complete: $.noop, //完成回调, 不管成功或者失败都会执行
        success: $.noop, //成功回调
        error: $.noop, //错误回调
        change: $.noop, //改变回调, 如果reutnr false则不上传
        progress: $.noop,//上传过程，只有HTML5才执行
        ext: 'jpg,jpeg,gif,png' //文件扩展名,用,分隔
    }


    return Upload;
});