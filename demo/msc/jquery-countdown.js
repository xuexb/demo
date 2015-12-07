/**
 * @name 简易倒计时jQuery插件,
 * @description 目前只能计时到天,时,分,秒;支持设置HTML格式,支持到时后回调;扩展的jQuery方法,请先引用jQuery.js,直接用选择器选择,每个容器只能使用一次,再次使用无效;
 * @return {object}                             当前选择器jQuery对象
 * @author xieliang
 * @email   xieyaowu@meishichina.com
 * @demo
 *     1, 加载列表
 *         $("#id .div").countdown({
 *             attr:function(){
 *                 return $(this).attr("data-time");//返回13位时间戳
 *             },
 *             callback:function(){
 *                 alert("倒计时结束了!");
 *             }
 *         });
 *      2, 一般加载
 *          $("#id").countdown({
 *              attr:"123123123",//13位时间戳
 *              format:"<b>{h}</b>时<b>{i}</b>分{s}秒"
 *          });
 */

;(function(a){
    /**
     * 循环时间器方法,对外暴露两个方法,该方法只是简单的做了下,有优化空间,利用队列解决页面多次使用setInterval
     * @return {object} 添加和删除方法
     * @description     add(function(){});在定时器里添加方法,add回调fn里返回false则直接取消当前方法
     * @description     remove();移除全部的定时器
     */
    var timer = (function(){
        var TIME = null;//定时器
        var LIST = [];//定时器要执行的队列
        var isLoad = false;//默认没有绑定过定时器

        /**
         * 添加回调到队列
         * @param {function} fn 回调方法，如果不是function则退出
         */
        var add = function(fn){
            if("function"!==typeof(fn)){
                return;
            }
            LIST.push(fn);//追加
            if(!isLoad&&LIST.length){//如果没有绑定过并且队列里有回调
                isLoad = true;//设置绑定过
                TIME = setInterval(function(){//绑定定时器
                    run();//运行队列
                },1000);
            }
        };

        /**
         * 运行队列方法
         */
        var run = function(){
            for(var i=0,len=LIST.length;i<len;i++){//循环所有队列里的回调
                if("function" === typeof (LIST[i]) && LIST[i]()===false){//如果回调fn返回false,则清除掉这个回调，但不影响其他回调，但如果所有回调都被清除了，则会取消整个事件
                    LIST.splice(i,1);//如果返回false则删除当前的回调
                }
                // console.log(+new Date);//test
            }
            if(LIST.length<1){//如果队列小于一个回调则删除，表示没有队列都让定时器不工作
                remove();//运行清除
            }
            i=len=null;//销毁
        }

        /**
         * 清除定时器
         */
        var remove = function(){
            LIST = [];//添加队列
            isLoad=false;//设置没有绑定
            clearInterval(TIME);//清除定时器
            TIME = null;//销毁定时器
        }
        return {//返回到timer上
            add: add,
            remove:remove
        }
    }());

    /**
     * jQuery简单倒计时插件
     * @param  {object} config                      插件配置
     * @param  {string || function}  config.attr    终止时间戳,可直接为数字,也可为function,如果为function则取的返回值,functon里的this指向当前选择器dom对象
     * @param  {string}   config.format             要显示的格式,如: <b>{d}天</b>, 其中里面 {d}天,{h}时,{i}分,{s}秒, 可使用HTML标签
     * @param  {function}  config.callback          倒计时完成后的回调,this指向的当前选择器的dom对象
     * @return {object}                             当前选择器jQuery对象
     */
    a.fn.countdown = function (config) {
        config = a.extend({},a.fn.countdown.defaults,config ||{});//合并参数
        if(!config.format || !config.attr){//如果没有时间戳或者没有时间显示格式则直接返回当前选择器
            return this;
        }
        return this.each(function(){//遍历所有的选择器,但要判断是否加载过该倒计时
            var attr = config.attr,//时间戳
                ele = this,//当前操作dom对象
                format = config.format,//时间格式
                callback = config.callback;//回调
            if(ele["countdown"]){//如果已使用过倒计时
                return;
            }
            ele["countdown"] = true;//设置已使用过
            if("function" === typeof attr){//如果时间戳为function，则里面this指向当前操作dom对象
                attr = attr.call(ele);
            };

            if(!attr){//如果没有时间戳
                return;
            };
            var time = attr - (+new Date);//得到剩余时间戳， 拿到期时间-当前时间

            /**
             * 设置当前对象的HTML
             */
            var setHtml = function(){
                var times  = getTime(time);//拿当前剩余时间戳获取到 天，时，分，秒
                ele.innerHTML = format.replace(/{(\w+)}/g,function($0,$1){//用正则把{}相关替换掉
                    return times[$1]
                });
                times = null;//销毁
            }

            /**
             * 内部循环执行
             */
            var fn = function(){
                time-=1000;//每1秒自减
                if(time<1){//如果小于1则说明到时间了
                    callback && callback.call(ele);//如果有回调则运行回调方法，this指向当前操作的dom对象
                    return false;//返回false让timer定时器删除当前队列
                } else {//如果正常没到时间
                    setHtml()//设置html到页面
                }
            }
            if(fn() !== false) {
                timer.add(fn);//给定时器里添加这个fn，让其循环执行
            }//默认运行一次，为了解决定时器在1s后才执行的等待时间
        });
    }



    //默认配置参数
    a.fn.countdown.defaults = {
        attr:null,//剩余时间戳
        format:"{d}天{h}时{i}分{s}秒",//格式化时间格式
        callback:null//倒计时完成后回调
    }

    /**
     * 获取时间的天,时,分,秒
     * @param  {number} time 要获取时间的时间戳,一般为终止时间-当前时间后的时间
     * @return {object}      天时分秒的对象
     */
    function getTime(time){
        var now = new Date();
        var diff = -480 - now.getTimezoneOffset();//是北京时间和当地时间的时间差   
        var leave = time + diff*60000;//减去偏移值,但测试中发现减不减都一样 
        var day = Math.floor(leave / (1000 * 60 * 60 * 24));
        var hour = Math.floor(leave / (1000*3600)) - (day * 24);
        var minute = Math.floor(leave / (1000*60)) - (day * 24 *60) - (hour * 60);
        var second = Math.floor(leave / (1000)) - (day * 24 *60*60) - (hour * 60 * 60) - (minute*60);
        return {
            d: day,//天
            h: hour,//时
            i: minute,//分
            s: second//秒
        }
    }
}(jQuery));