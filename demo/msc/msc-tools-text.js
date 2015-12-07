(function(window, $, msc) {
    /**
     * 文本框相关操作
     * @namespace msc.tools.text
     * @memberOf msc.tools
     * @author xieliang
     * @email xieyaowu@meishichina.com
     */
    var text = msc.register("msc.tools.text"),
        isCss3 = msc.tools.browser.isCss3;


    /**
     * 获取字符串的长度
     * @param  {string}  str    要获取的字符
     * @param  {Boolean} isByte 是否计算字节,如果为true则把中文算成2个字节
     * @return {number}         字符长度
     *
     * @memberOf msc.tools.text
     * @function
     */
    text.getStrLength = function(str, isByte) {
        str += "";
        if (isByte) {
            str = str.replace(/(?:[^\x00-\xff])/g, "**"); //思路来自田想兵
        }
        // console.log(str.length)
        return str.length;
    }

    /**
     * 根据length获取字符串
     * @param  {sgring}  str    目标字符串
     * @param  {number}  length 要获取的位数
     * @param  {Boolean} isByte 是否转换中文为2字符
     * @return {string}         最终字符串
     *
     * @function
     * @memberOf msc.tools.text
     */
    text.getStr = function(str, length, isByte) {
        var i,
            len,
            num,
            temp;
        str += "";
        if (isByte) {
            num = i = 0;
            len = str.length;
            for (; i < len; i++) {
                // if(/(?:[^\x00-\xff])/.test(result[i])){
                // 不用正则判断是否中文
                temp = str.charCodeAt(i);
                num += temp > 0 && temp < 255 ? 1 : 2;

                if (num > length) {
                    break;
                }
            }
            // console.log(i)
            length = i;
        }
        return str.substr(0, length);
    }



    /**
     * 时实监听计算文本框内的字符
     * @param  {(object|string)}            config                  对象配置或者id
     * @param  {number}                     maxLength               如果为数字则是最大数
     * @param  {Function}                   callback                回调
     *
     * config采用{}方式,更利于以后的扩展
     * @param  {(string|element)}           config.id               要绑定的id
     * @param  {number}                     config.maxLength        如果为数字则为最大数,如果为fn,则拿call(ele)执行,如果为false则不强行设置他的输入只触发回调
     * @param  {function}                   config.callback         触发后的回调
     * @param  {boolean}                    [config.isByte=true]    是否把中文计算为2个字符
     *
     * @return {object}                     msc.tools.text
     *
     * @function
     * @memberOf msc.tools.text
     *
     * @example
     *     1, 不限制输入
     *             msc.tools.text.computeNumber("#J_wordme", false, function(e, len){
     *                 J_wordme_hit[0].innerHTML = len;//计算输入了多少个
     *             });
     *             上面代码相当于:
     *             msc.tools.text.computeNumber({
     *                 id:"#J_wordme",
     *                 maxLength:false,//只要不是数字或者小于0, 都视为不计算
     *                 callback: fn
     *             });
     *      2, 限制输入100个字符
     *              msc.tools.text.computeNumber("#id", 100, function(e, len){
     *                  console.log(100 - len);
     *              });
     *      3, 不计算中文
     *              msc.tools.text.computeNumber({
     *                  id:$("#id"),//我支持DOM和$哦
     *                  isByte:false,//不管中文
     *                  callback: fn,
     *                  maxLength: 100
     *              });
     */
    text.computeNumber = function(config, maxLength, callback) {
        if (!$.isPlainObject(config)) { //如果第一个参数不是{}
            config = {
                id: config,
                maxLength: maxLength,
                callback: callback
            }
        }

        

        //如果没有id 或者 选择器空
        if (!config.id || !(config.id = $(config.id)).length) {
            return text;
        }

        //默认参数
        config = $.extend({
            // id: null, //id
            maxLength: 280, //最大数
            callback: $.noop, //回调
            isByte: true //是否把中文计算为2字节
        }, config);


        //遍历所有id
        $.each(config.id, function() {
            var $this = $(this),
                maxLength = ("function" === typeof(config.maxLength) ?
                    config.maxLength.call(this) :
                    config.maxLength) | 0; //call的时候总是拿dom而不是jQuery


            //监听事件
            //失去焦点
            //获得焦点
            //粘贴?
            //按下
            //blur.msc是为了不给别的事件冲突, 害怕该元素在别的地方绑定有blur
            $this.on("blur.msc focus paste keyup", function(e) {
                var value;

                //如果要求输入最大数时才计算
                if (maxLength > 0 && text.getStrLength((value = this.value), !! config.isByte) > maxLength) {
                    this.value = text.getStr(value, maxLength, !! config.isByte);
                }

                //执行回调
                config.callback.call(this, e, text.getStrLength(this.value, !! config.isByte));

            })

            //默认触发下,相当与初始化, 不能写在each外,因为 triggerHandler 只触发第一个元素
            .triggerHandler("blur.msc");

        }); 


        return text;
    }

    /**
     * 兼容占位     
     * @param {(object|selector)} config 配置参数或者选择器
     * @param {(selector|jQuery)} config.id 选择器
     * @param {boolean} config.label 是否用创建label模式
     *
     * @memberOf msc.tools.text
     * @function
     */
    text.placeholder = function(config){
        if(!$.isPlainObject(config)){
            config = {
                id: config
            }
        }

        //如果没有id 或者 选择器空
        //如果支持css3则...
        if (isCss3 || !config.id || !(config.id = $(config.id)).length) {
            return text;
        }


        //默认参数
        config = $.extend({
            // id: null, //id
            label: true//是否创建label来模拟, 关闭她常用于移动/定位中的input, 但要记住她用的是value, 密码框你懂的...
        }, config);

        $.each(config.id, function(){
            var that = this,
                $this = $(that),
                value = $this.attr("placeholder");

            if(that._placeholder || !value){//去重操作 或者没有 占位符
                return;                
            }

            that._placeholder = text.placeholder._count++;

            if(config.label){//如果为创建label模式
                text.placeholder._create($this, value);
            } else {
                $this.on({
                    'focus.placeholder': function () {
                        if (this.value === value) {
                            this.value = '';
                            this.style.color = '#333';
                        }
                    },
                    "blur.placeholder": function () {//配合trigger来做触发
                        if (this.value === "") {
                            this.value = value;
                            this.style.color = '#999';
                        }
                    }
                }).trigger("blur.placeholder"); //这里用自定义事件,因可能给元素上的blur事件绑定的别的事件,要在这里触发可能会触发那些事件
            }

        });

        return text;
    }

    /**
     * 唯一数
     */
    text.placeholder._count = 1;


    /**
     * 移除兼容占位
     */
    text.placeholder.destory = function(id){
        if(!isCss3 && id){
            $(id).each(function(){
                if(this._placeholder){
                    $("#msc_placeholder_"+ this._placeholder).remove();
                    $(this).off("focus.placeholder keyup.placeholder blur.placeholder");
                }
            });
        }
        return text;
    }

    /**
     * 内部使用创建label模式
     * @param  {jQuery} $this 当前元素
     * @param {string} text 占位值
     */
    text.placeholder._create = function($this, value){
        var that = $this[0],
            $span = $('<span />'),
            visible = false,
            css = {},
            offset = $this.offset();

        $span[0].innerHTML = value;

        $span[0].id = "msc_placeholder_"+ that._placeholder;

        $span[0].className = 'ui-placeholder';

        // 设置css
        css['left'] = offset.left + 2;
        css['top'] = offset.top;
        css['padding-left'] = $this.css("padding-left");
        // css['height'] = $this.outerHeight();
        if(that.nodeName === 'TEXTAREA'){
            css['line-height'] = $this.css('line-height');
            css['padding-top'] = $this.css('padding-top');
        } else {
            css['line-height'] = $this.outerHeight() + 'px';
        }
        $span.css(css);


        $span.click(function () {//点击这个span则
            $this.focus();
        }); 

        $this.on({
            'focus.placeholder': function () {
                $span.addClass("ui-placeholder-focus");
            },
            'blur.placeholder': function () {
                $span.removeClass("ui-placeholder-focus");
            },
            'keyup.placeholder': function () {
                if($this.val()){
                    if(visible){
                        $span.hide();
                        visible = false;
                    }
                } else {
                    if(!visible){
                        $span.show();
                        visible = true;
                    }
                }
            }
        });

        //注册改变事件
        msc.event.resize.add(function () {
            $span.css({
                "left": $this.offset().left + 2,
                "top": $this.offset().top
            });
        });

        $(document.body).append($span);

        setTimeout(function () { 
            if(!$this.val()){//解决文本框就有value值的问题
                $span.show(); 
                visible = true; 
            }
        },100);
    }

}(window, jQuery, msc));