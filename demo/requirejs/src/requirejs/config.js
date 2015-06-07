/**
 * requirejs配置
 * @author xieliang
 *
 * @description baseUrl是基于html所在的path定的，如果有配置data-main则是基于这个
 */

requirejs.config({
    paths: {
        'jquery': '../lib/jquery'
    }
    // baseUrl: '../src/'
});