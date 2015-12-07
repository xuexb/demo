/**
 * 事件延迟器
 * @author xieliang
 * @email   xieyaowu@meishichina.com
 */
;(function(a,msc) {
    "use strict";
    var $window = a(window),
        count = 0,
        get = function () {
            return {
                scrollTop: $window.scrollTop(),
                scrollLeft: $window.scrollLeft(),
                width: $window.width(),
                height: $window.height()
            }
        }
    
    function Class(name, time) {
        this.name = name || "scroll";
        this.id = this.name + ".event_" + (count++);
        this.time = time | 0;
        return this.reset();
    }

    /**
     * 触发事件
     * @param  {(string|undefined)} name 事件别名或者触发全部事件
     * @return {object}      当前实例对象
     *
     * @example
     *     1,   var xx = msc.event("scroll", 1);
     *          xx.trigger();//触发所有这个空间下的事件
     *     2,   msc.event.scroll.trigger("home");触发总空间下的监听home的事件
     */
    Class.prototype.trigger = function(name) {
        var self = this;
        return name ? self._run(function(data){
                if(data.name === name){
                    return false;
                }
            }) : self._run();
        // if(name){
        //     self._run(function(data){
        //         if(data.name === name){
        //             return false;
        //         }
        //     });
        // } else {
        //     self._run();
        // }
        // if (self.length > 0) {
        //     if (name) {
        //         a.each(self.list, function(i, n) {
        //             if (n.name === name) {
        //                 n.callback && n.callback.call(self, get());
        //                 return false;
        //             };
        //         });
        //     } else {
        //         a.each(self.list, function(i, n) {
        //             n.callback && n.callback.call(self, get());
        //         });
        //     };
        // };
        // return self;
    }

    Class.prototype._run = function (fn){
        var self = this;
        a.each(self.list, function(i,n){
            if (n.callback && n.callback.call(self, get()) === !1) { //执行缓存fn,且如果fn里返回false则直接移除该事件
                self.remove(n.name);
            };
            if(fn && fn.call(self, n) === !1){
                return !1;
            };
        });
        return self;
    }

    Class.prototype.reset = function() {
        var self = this;
        self.length = 0;
        self.timer = null;
        self.list = [];
        if (self.isLoad) {
            $window.unbind(self.id);
        }
        self.isLoad = 0;
        return self;
    }

    Class.prototype.addEvent = function() {
        var self = this;
        if (!self.isLoad) { //判断标致查看是否加载过
            self.isLoad = 1; //设置已经加载过
            $window.bind(self.id, function(e) { //给window绑定总事件
                if (self.length > 0) { //如果事件个数大于0
                    if(self.time===0){
                        self._run();
                        // a.each(self.list, function(i, n) { //遍历所有的缓存
                        //     if (n.callback && n.callback.call(self, get()) === !1) { //执行缓存fn,且如果fn里返回false则直接移除该事件
                        //         self.remove(n.name);
                        //     };
                        // });
                    } else {
                        clearTimeout(self.timer); //清除延迟器
                        self.timer = setTimeout(function() { //设置延迟器
                            self._run();
                        }, self.time); //延迟时间
                    }
                };
            });
        };
        return self;
    }

    /**
     * 添加事件监听
     * @param {function} callback 监听事件的回调
     * @param {string} name 监听事件的别名
     * @return {object} 当前实例对象
     * @example
     *     1,  var a = msc.event("scroll",0);
     *         a.add(function(){},"xieliang");
     *     2,  msc.event.scroll.add("test", function(){});
     */
    Class.prototype.add = function(callback, name) {
        var self = this;
        if ("string" === typeof(callback)) {
            callback = [name, name = callback][0];
        };
        if (!callback) { //直接运行 .add()则
            return self;
        };
        if ("object" === typeof(callback)) { //如果为多个 -> {key:fn,key2:fn2}
            for (var i in callback) {
                self.add(i, callback[i]);
            };
            return self;
        };
        // name = name || self.name + (+new Date());
        self.list.push({
            name: name || self.name + (+new Date()),
            callback: callback
        }); //追加缓存
        self.length++; //追加事件个数
        return self.addEvent(); //注册事件并返回
    }


    /**
     * 移除事件监听
     * @param {(string|array)} name 要删除的事件别名, 可以是字符或者数组, 如果为空则删除所有别名事件
     * @return {object} 当前实例对象
     * @example
     *     1, msc.event.scroll.remove("home");
     *     2, msc.event.scroll.remove(['home-1', 'home-2']);
     */
    Class.prototype.remove = function(name) {
        var self = this;
        if (name) {
            if (self.length > 0) { //如果有事件才移除
                var temp, cacheTemp = self.list; //定义临时的
                if (!a.isArray(name)) { //如果不是数组,这里没有判断为object的事
                    name = [name]; //如果不是数组带个套,你懂的
                };
                a.each(name, function(i, n) { //遍历所有的name
                    temp = []; //每次循环初始化
                    a.each(cacheTemp, function(i2, n2) { //遍历缓存,这里会随着每次遍历给出最新的
                        if (n2.name !== n) { //筛选不是的
                            temp.push(n2); //把当前不是name里的object放变量里
                        };
                    });
                    cacheTemp = temp; //重新幅值
                });
                if (cacheTemp.length === 0) { //如果全部删除了
                    self.reset(); //重置
                } else {
                    self.list = cacheTemp;
                    self.length = cacheTemp.length;
                };
                temp = cacheTemp = null;
            };
        } else {
            self.reset(); //重置
        };
        return self;
    }

    /**
     * 延迟事件架构函数
     * @param  {string} name 事件名称
     * @param  {number} time 延迟的时间
     * @return {object}      实例化后的对象
     *
     * @memberOf msc
     * @namespace msc.event
     *
     * @example
     *     1, 私有方法:
     *     var xl = msc.event(name,time);//事件名称(如:scroll,resize),延迟时间(单位ms);
     *     xl.time = 10;//外部设置私有的延迟
     *     xl.add(function(){});//设置私有的fn,通过e.scroll.remove();是移除不了的...
     *     xl.remove();
     *     xl.trigger();
     *     xl.add(name, callback);
     *     
     *     2, 一个0延迟的例子:
     *     var a = msc.event("scroll", 0);
     *     a.add(function(o){
     *         console.log(o.scrollTop, o.width, o.height, o.scrollLeft);
     *     });
     */
    msc.event = function(name, time) {
        return new Class(name, time);
    }

    /**
     * 滚动延迟对象
     * @function
     * @memberOf msc.event
     * @example
     *      1, msc.event.scroll("home", function(){});添加一个默认的滚动监听事件
     *      2, msc.event.scroll.trigger("home");触发这个事件
     *      3, msc.event.scroll.trigger();//触发这个空间下的所有事件
     *      4, msc.event.scroll.add(fn);直接添加scroll的fn,他不能通过name删除,但全部删除的时间可删除;
     *      5, msc.event.scroll.add(name,fn); 对scroll事件添加命名空间为name的fn, 也可以是 (fn,name);
     *      6, msc.event.scroll.add({key:fn,key2:fn2});添加多个scroll事件;
     *      7, msc.event.scroll.remove();移除全部的scroll事件;
     *      8, msc.event.scroll.remove("xl");移除命名空间为xl的scroll事件;
     */
    msc.event.scroll = new Class("scroll",50);

    /**
     * 改变窗口延迟对象
     * @function
     * @memberOf msc.event
     * @example
     *      1, msc.event.resize("home", function(){});添加一个默认的滚动监听事件
     *      2, msc.event.resize.trigger("home");触发home事件
     *      3, msc.event.resize.trigger();//触发这个空间下的所有事件
     *      4, msc.event.resize.add(fn);直接添加 resize 的fn,他不能通过name删除,但全部删除的时间可删除;
     *      5, msc.event.resize.add(name,fn); 对 resize 事件添加命名空间为name的fn, 也可以是 (fn,name);
     *      6, msc.event.resize.add({key:fn,key2:fn2});添加多个 resize 事件;
     *      7, msc.event.resize.remove();移除全部的 resize 事件;
     *      8, msc.event.resize.remove("xl");移除命名空间为xl的 resize 事件;
     */
    msc.event.resize = new Class("resize",50);
}(jQuery,window.msc));