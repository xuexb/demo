(function () {
    var baseUrl;

    // 如果是github-pages
    if (location.host === 'github.xuexb.com') {
        baseUrl = '/zui/src/';
    }

    // 如果是本地file文件则引用线上github-pages
    else if (location.protocol === 'file:') {
        baseUrl = 'https://github.xuexb.com/zui/src/';
    }

    // 如果不包含zui
    else if (location.href.indexOf('/zui/') === -1) {
        baseUrl = '/src/';
    }

    else {
        baseUrl = location.href.substr(0, location.href.indexOf('/zui/') + 5) + 'src/';
    }

    requirejs.config({
        baseUrl: baseUrl,
        paths: {
            text: '../lib/requirejs/plugins/text',
            tpl: '../lib/requirejs/plugins/text',
            css: '../lib/requirejs/plugins/css',
            zepto: '../lib/zepto',
            Class: 'base/Class',
            zui: 'base/zui',
            test: '../test'
        },
        shim: {
            zepto: {
                exports: 'Zepto'
            }
        },
        urlArgs: function (uri, url) {
            var args = '';

            // if (url.indexOf('.css') > -1) {
                args = 'v=' + Date.now();
            // }

            return (url.indexOf('?') === -1 ? '?' : '&') + args;;
        }
    });
})();
