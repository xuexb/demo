/**
 * 分享
 * @author xieliang
 */

define(function(require) {
    'use strict';

    var $ = require('../jquery'),
        Tools = require('../tools'),
        Dialog = require('../dialog');


    function Share(config) {
        var self = this;

        //合并
        self.config = config = $.extend(true, {}, Share.defaults, config || {});

        //如果没有元素
        if (!config.elem) {
            throw new Error('元素为空!');
        }

        //如果是 elem: {sina: '#xl'} 这种
        if ($.isPlainObject(config.elem)) {
            $.each(config.elem, function(key, value) {
                $(value).on('click', function() {
                    self.__trigger(key);
                    return false;
                });
            });
        } else if ($(config.elem).length) {
            $(config.elem).on('click', 'a[data-type]', function() {
                self.__trigger(this.getAttribute('data-type'));
                return false;
            });
        }

    }

    var proto = Share.prototype;

    /**
     * 内部触发事件
     * @param {string} key 要触发的键名
     */
    proto.__trigger = function(key) {
        var self = this,
            data = Share.data,
            config = self.config,
            url,
            obj;

        if (!key || !data[key]) {
            return self;
        }


        data = data[key];

        if ('function' === typeof data) {
            return data.call(self);
        }


        obj = $.extend({}, config);
        obj.appkey = config.appkey[key] || '';
        obj.searchPic = !config.pic;


        //解析url
        url = data.replace(/{([^}]+?)}/g, function($0, $1) {
            return obj.hasOwnProperty($1) ? obj[$1] : '';
        });


        //弹出来
        Tools.open(url, {});
    }


    //配置数据包
    //变量:
    //  title,url,appkey,site,pic,searchPic,h5_url
    Share.tpl = {
        tqq: 'http://share.v.t.qq.com/index.php?\
                c=share&a=index&title={title}&url={url}&appkey={appkey}&site={site}&pic={pic}',
        sina: 'http://service.weibo.com/share/share.php?\
                url={url}&type=icon&language=zh_cn&appkey={appkey}&\
                title={title}&searchPic={searchPic}&style=simple&pic={pic}',
        douban: 'http://www.douban.com/share/service?\
                bm=1&image={pic}&href={url}&updated=&name={title}',
        renren: 'http://widget.renren.com/dialog/share?\
                resourceUrl={url}&srcUrl={url}&title={title}&pic={pic}&description=',
        qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?\
                url={url}&showcount=0&desc=&summary=&title={title}&\
                site={site}&pics={pic}&style=203&otype=share',
        weixin: function() {
            new Dialog();
            /*new Dialog({
                title: '扫描二维码',
                content: '<div class="clx" style="height: 140px;padding: 30px;width: 350px;">\
                            <div style="float:left;width: 140px;height: 140px;">\
                                <img src="http://s.jiathis.com/qrcode.php?url=' + this.config.h5_url + '" \
                                    height="140" width="140" class="imgLoad" alt="二维码">\
                            </div>\
                            <div style="float:right;width: 174px;height: 130px;border-left: 1px solid #ccc;\
                                font-size: 16px;padding-left: 20px;padding-top: 10px;">\
                                打开微信，点击底部的“发现”，使用 “扫一扫” 即可将网页分享到我的朋友圈。 <br>\
                                <a href="#" style="color:#09f;font-size:12px;">如何使用？</a>\
                            </div>\
                        </div>',
                lock: 1,
                fixed: 1
            });*/
        }
    }



    //默认参数
    Share.defaults = {
        title: document.title,
        url: document.URL,
        h5_url: document.URL,
        site: 'easywed.cn',
        appkey: {
            sina: 1262546948
        },
        elem: '',
        pic: '' //为空则为自动取图, 但只有sina支持
    }


    return Share;
});