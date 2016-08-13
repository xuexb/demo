/**
 * @file class类
 * @author rauschma
 * @link https://github.com/rauschma/class-js
 * @module Class
 */

define(function () {
    var Class = {

        /**
         * 扩展class
         *
         * @class
         * @name Class
         * @param {Object} properties 扩展对象，必须包含constructor方法
         * @return {Function} 构造函数
         */
        extend: function (properties) {
            var superProto = this.prototype || Class;
            var proto = Object.create(superProto);
            // This method will be attached to many constructor functions
            // => must refer to "Class" via its global name (and not via "this")
            Class.copyOwnTo(properties, proto);

            var constr = proto.constructor;
            // if (!(constr instanceof Function)) {
            //     throw new Error('You must define a method \'constructor\'');
            // }

            // Set up the constructor
            constr.prototype = proto;
            constr.super = superProto;

            // inherit class method
            constr.extend = this.extend;
            return constr;
        },

        /**
         * 拷贝属性
         *
         * @private
         * @param {Object} source 源
         * @param {Object} target 目标
         * @return {Object} 复制体
         */
        copyOwnTo: function (source, target) {
            Object.getOwnPropertyNames(source).forEach(function (propName) {
                Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
            });
            return target;
        }
    };
    return Class;
});
