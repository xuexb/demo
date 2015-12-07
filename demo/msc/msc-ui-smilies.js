/**
 * 表情插件包
 * @version 1.0
 * @author xieliang
 * @email xieyaowu@meishichina.com
 * @todo 将在升级 msc.ui.dialog 到v6后使用dialog的框架
 *       可大量优化
 * @memberOf msc.ui
 * @namespace msc.ui.smilies
 * @example
 *     1, 添加表情
 *         $("a").click(function(){
 *             msc.ui.smilies({
 *                 target:this,
 *                 callback:function(title, src){
 *                     //this === 当前点击的表情dom对象
 *                     //title ==== 当前点击的表情title
 *                     //src === 当前点击的表情连接
 *                 }
 *             });
 *             
 *             //或者
 *             msc.ui.smilies(this, callback);
 *         });
 *     2, 添加表情包
 *         msc.ui.smilies.addItem();//格式请看 msc.ui.smilies.data.js说明
 *         msc.ui.smilies.update();//更新
 */
;(function(window, $, msc) {
    "use strict";

    var smilies = msc.ui.smilies = function (config, callback) {
        var _dom = smilies._dom;

        //如果第一个参数不是 {}
        if(! $.isPlainObject(config)){
            config = {
                target: config,
                callback: callback
            }
        }

        //引用到对象上
        smilies.config = config;

        //转为jQuery对象
        config.target = $(config.target);



        if(!config.target.length){
            return smilies;
        };

        //如果触发目标是原目标 但必须是加载过后
        if(smilies._loaded && config.target[0] === _dom.target[0]){
            if(smilies._visible){
                smilies.hide();
                return smilies;
            }
        };

        //记录上个触发目标
        _dom.target = config.target;

        //如果没有加载过
        if(!smilies._loaded){
            smilies._loaded = 1;
            _dom.box = $('<div class="ui_smilies"></div>').appendTo(document.body);
            $.getScript("http://static.meishichina.com/v6/js/lib/msc-ui-smilies-data.js?v=20140401");
        };



		smilies._visible = 1;
		smilies._bind();//绑定事件

		msc.event.resize.trigger("smilies");

		setTimeout(function() {
			smilies.show();
		}, 100);
        return smilies;
    };

    //表情包对象
    smilies._data = {};

    //缓存触发对象
    smilies._dom = {}

    //表情包个数
    smilies._dataLength = 0;

    //隐藏表情框
    smilies.hide = function(){
        smilies._visible = 0;
        smilies._dom.box.hide();
        return smilies;
    };

    //显示表情框
    smilies.show = function(){
        smilies._visible = 1;
        smilies._dom.box.show();
        return smilies;
    };

    //定位表情框,必须可见才行
    smilies._position = function(obj){
        if (smilies._visible) {
			var _dom = smilies._dom,
                offset = _dom.target.offset(),
				left = offset.left,
				top = offset.top,
				height = _dom.target.outerHeight(true),
				width = _dom.target.outerWidth(true),
				_width = 402,
				_height = 162,
				winTop = obj.scrollTop,
				winLeft = obj.scrollLeft,
				winWidth = obj.width,
				winHeight = obj.height;
			if (left < 0) {
				left = 0;
			}
			if (left + _width >= winWidth + winLeft && left + width - winLeft >= _width) {
				left = left + width - _width;
			} else {
				if (left + _width >= winWidth + winLeft) {
					left = winLeft + winWidth - _width;
				}
			} if (top + height + _height >= winHeight + winTop) {
				top = top - _height;
			} else {
				top = top + height;
			}
			_dom.box.css({
				left: left,
				top: top
			});
			_dom = offset = left = top = height = width = _width = _height = winTop = winLeft = winWidth = winHeight = null;
		}
    };



    //对外暴露添加表情...但添加完后必须update一次才行
    smilies.addItem = function(config,data){
        if(!smilies._data[config.name]){
            smilies._dataLength++;
            smilies._data[config.name]= {};
            smilies._data[config.name].data = data;
            smilies._data[config.name].path = config.path || "";
        }
        return smilies.update(config.name);
    }

    smilies._bind = function(){
        $(document).on("click",function(){//用window在ie67里有bug
            smilies.hide();
        });
        smilies._dom.box.on("click",function(e){
            e.stopPropagation();
        });
        smilies._dom.box.on("click","img",function(e){
            if(smilies.config.callback){
                e.stopPropagation();
                smilies.config.callback.call(this,this.title,this.src);
                smilies.hide();
            }
        });
        msc.event.resize.add("smilies", smilies._position);
		smilies._bind = $.noop;
    }

    smilies.update = function( triggerName ){
        var box = smilies._dom.box,
            _data = smilies._data,
            str,
            item,
            item2;
        box[0].className = "ui-smilies";
        box.empty();//清空, 内部会卸载事件
        
        if (smilies._dataLength === 0) {//如果表情包=0
            box[0].innerHTML = '<div class="ui-smilies-no">什么? 刷新失败了, <a href="javascript:;" onclick="msc.ui.smilies.update();">刷新</a> 再试试吧!</div>';
        } else if (smilies._dataLength < 2) {// 只有一个表情包
            str = '<div class="ui-smilies-content"><ul>';
            for (item in _data) {
                for (item2 in _data[item].data) {
                    str += '<li><img src="' + _data[item].path + _data[item].data[item2] + '" title="' + item2 + '"></li>';
                }
            }
            box[0].innerHTML = str +"</ul></div";
            box[0].className += ' ui-smilies-noNav';
            // smilies.ele.html(str).addClass("ui_smilies_noNav");
        } else {

            //组合导航
            str = '<ul class="ui-smilies-nav">';
            for (item in _data) {
                str += '<li>' + item + '</li>';
            };
            str += '</ul><div class="ui-smilies-content"></div>';

            //输出到页面并绑定事件
            box.html(str).find(".ui-smilies-nav").on("click", "li", function(e){
                var _data = smilies._data[this.innerHTML],
                    str;

                e.stopPropagation();//阻止冒泡
                if(this.className === "on"){//当前高亮
                    return;
                }

                $(this).addClass("on").siblings().removeClass("on");

                
                if(!_data){
                    str = '<div class="ui-smilies-no">亲? 加载失败了, <a href="javascript:;" onclick="msc.ui.smilies.update()">重试</a></div>';
                } else {
                    str = '<ul>';
                    for(var i in _data.data){
                        str += '<li><img src="' + _data.path + _data.data[i] + '" title="' + i + '"></li>';
                    }
                    str += "</ul>";
                };

                smilies._dom.box.find(".ui-smilies-content")[0].innerHTML = str;
                str = _data = null;
            }).find("li").filter(function(index){
                return triggerName ? (this.innerHTML === triggerName) : (index === 0);
            }).click();


            //坚决不能让她在内存里存在, 你存在, 我常常的脑海里...
            box = _data = str = item = item2 = null;
        }
        return smilies;
    };
}(window, jQuery, msc));