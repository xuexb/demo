(function ($) {
    // 暴露方法
    $.fn.xxoo = function (options) {
        if (typeof options === 'string') {
            options = $.extend({}, $.fn.xxoo.defaults, {
                message: options,
            });
        } else {
            options = $.extend({}, $.fn.xxoo.defaults, options);
        }

        alert(`我的心情是：${options.status}`);
        alert(`提示消息是：${options.message}`);
    };

    /**
     * 默认配置
     * 
     * @type {Object}
     *
     * @param {string} [type=xxoo] 类型
     * @param {string} [status=sad] 当前心情
     * @param {string} message 提示消息
     */
    $.fn.xxoo.defaults = {
        type: 'xxoo',
        status: 'sad',
        message: '',
    };
})(window.jQuery);