(function () {
    'use strict';

    /**
     * 数据
     * @type {Object}
     */
    var data = {};

    var ajaxUrl = '/api/search/delegate';

    var $wirte = $('#J-write');

    /**
     * 负责发送请求
     */
    var send = function () {
        $.ajax({
            url: ajaxUrl,
            data: data,
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                $wirte.text(JSON.stringify(res));
            },
            error: function () {
                $wirte.text('出错');
            }

        });
    };

    $('#J-demo').on('click', 'li', function () {
        var id = $(this).data('id');
        var type = $(this).data('type');

        $(this).addClass('current').siblings().removeClass('current');

        if (!id) {
            delete data[type]
            ;
        }
        else {
            data[type] = id;
        }

        send();
    });

})();
