/**
 * 浏览器检测
 * @author xieliang
 * @email admin@xuexb.com
 */

define(function() {
    'use strict';

    var u = navigator.userAgent.toLowerCase();

    var browser = (function() {
        return {
            // webkit: u.indexOf('applewebkit') > -1, //苹果、谷歌内核
            mobile: !!u.match(/applewebkit.*mobile.*/), //是否为移动终端
            // ios: !!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/i), //ios终端
            android: u.indexOf('android') > -1 || u.indexOf('linux') > -1, //android终端或者uc浏览器
            iphone: u.indexOf('iphone') > -1, //只有iphone
            ipad: u.indexOf('ipad') > -1, //是否iPad
        };
    })();

    browser.weixin = u.indexOf('micromessenger') > -1;

    return browser;
});