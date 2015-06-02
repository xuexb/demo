/**
 * 事件对象
 * @author xieliang
 * @email admin@xuexb.com
 *
 *
 * @example
 *     1, var a = new Event();
 *         a.on('login', function(data){});
 *         a.trigger('login').trigger('login', {});
 *         a.off('login');
 *     2, var b = new Event(),c = function(){}
 *         a.on('test', c); 
 *         a.off('test', c);
 */

(function(){
    'use strict';


    var prototype;

    /**
     * 构造函数
     */
    function Event(){
        this.__listener = {};//事件空间
    }

    /**
     * 原型链
     */
    prototype = Event.prototype;


    /**
     * 触发事件
     * @param {string|object} type 事件名或者this指针
     * @param {array} data 触发时附带的数据
     * @return {boolean} 回调里是否有return false
     */
    prototype.trigger = function(type, data){
        var self = this,
            obj = self,
            listeners,
            i = 0;

        //如果不是str则说明要改变this指针
        if('string' !== typeof(type)){
            obj = type;
            type = data;
            data = arguments[2];
        }

        listeners = self.__getListener(type);

        for (;i < listeners.length; i++) {
            if(listeners[i].callback.apply(self, data) === false){
                return false;
            }
            if(listeners[i].one){
                listeners.splice(i--, 1);
            }
        }

        return true;
    }


    /**
     * 添加事件
     * @param   {String}    事件类型
     * @param   {Function}  监听函数
     * @return {object} self
     */
    prototype.on = function(type, callback){
        var self = this;
        self.__getListener(type).push({
            one: false,
            callback: callback
        });
        return self;
    }


    /**
     * 绑定一次事件
     * @param  {string}   type     事件类型
     * @param  {Function} callback 监听函数
     * @return {object}            self
     */
    prototype.one = function(type, callback){
        var self = this;
        self.__getListener(type).push({
            callback: callback,
            one: true
        });
        return self;
    }


    /**
     * 获取事件队列
     * @param  {string} type 事件名
     * @return {array}      事件队列
     */
    prototype.__getListener = function(type) {
        var listener = this.__listener;
        if (!listener[type]) {
            listener[type] = [];
        }
        return listener[type];
    }



    /**
     * 删除事件
     * @param   {String}    事件类型
     * @param   {Function|undefined}  监听函数，如果为空则卸载全部type的事件
     * @return {object} self
     */
    prototype.off = function(type, callback) {
        var self = this,
            listeners = self.__getListener(type),
            i;

        if ('function' === typeof callback) {
            for (i = 0; i < listeners.length; i++) {
                if (callback === listeners[i]) {
                    listeners.splice(i--, 1);
                }
            }
        } else {
            listeners.length = 0;
        }

        return self;
    }


    window.Event = Event;
})();