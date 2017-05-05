'use strict';

/**
 * url处理方法
 *
 * @type {Object}
 */
var Url = window.Url = {};

/**
 * 转码
 *
 * @description 添加try是为了防止抛异常
 * @param  {string} URIComponent 内容
 * @link https://github.com/blearjs/blear.utils.uri/blob/master/src/index.js
 *
 * @return {string}
 */
Url.encode = function (URIComponent) {
    try {
        return encodeURIComponent(URIComponent).replace(/[!'()*]/g, function (c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }
    catch (err) {
        return '';
    }
};

/**
 * 解码
 *
 * @description 添加try是为了防止抛异常
 * @param  {string} URIComponent 内容
 * @link https://github.com/blearjs/blear.utils.uri/blob/master/src/index.js
 *
 * @return {string}
 */
Url.decode = function (URIComponent) {
    try {
        return decodeURIComponent(URIComponent);
    }
    catch (err) {
        return '';
    }
};

/**
 * 字符串query
 *
 * @link https://github.com/blearjs/blear.utils.querystring
 * @type {Object}
 */
Url.querystring = {};

/**
 * 分隔符
 *
 * @type {string}
 */
Url.querystring.sep = '&';

/**
 * 连接符
 *
 * @type {string}
 */
Url.querystring.eq = '=';


/**
 * 解析字符串
 *
 * @param  {string} str 链接
 * @param  {string} sep 分隔符
 * @param  {string} eq  连接符
 *
 * @return {Object}
 */
Url.querystring.parse = function (str, sep, eq) {
    var data = {};

    sep = sep || Url.querystring.sep;
    eq = eq || Url.querystring.eq;

    String(str || location.search.substr(1)).split(sep).map(function (key) {
        return key.trim();
    }).filter(function (key) {
        return !!key;
    }).forEach(function (val) {
        val = val.split(eq);
        var key = Url.decode(val[0]);
        var value = Url.decode(val[1]);

        if (!data[key]) {
            data[key] = value;
        }
        else {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }

            data[key].push(value);
        }
    });

    return data;
};

/**
 * 对象转字符
 *
 * @param  {Object} data 数据对象
 * @param  {string} sep 分隔符
 * @param  {string} eq  连接符
 *
 * @return {string}
 */
Url.querystring.stringify = function (data, sep, eq) {
    var result = [];

    var push = function (key, value) {
        key = Url.encode(key);

        if (key) {
            result.push(key + eq + Url.encode(value));
        }
    };

    sep = sep || Url.querystring.sep;
    eq = eq || Url.querystring.eq;

    // 如果是对象
    if ($.isPlainObject(data)) {
        $.each(data, function (key, value) {
            if (Array.isArray(value)) {
                $.each(value, function (index, value2) {
                    push(key, value2);
                });
            }
            else {
                push(key, value);
            }
        });
    }

    return result.join(sep);
};