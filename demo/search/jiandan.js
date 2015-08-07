(function(){
    'use strict';

    // 定义3个参数变量
    var paramName = null;
    var paramOrder = null;
    var paramView = null;

    var ajaxUrl = '/api/search/jiandan';

    var $wirte = $('#J-write');

    /**
     * 负责发送请求
     */
    var send = function(){
        $.ajax({
            url: ajaxUrl,
            data: {
                name: paramName,
                order: paramOrder,
                view: paramView
            },
            type: 'GET',
            dataType: 'json',
            success: function(res){
                $wirte.text(JSON.stringify(res));
            },
            error: function(){
                $wirte.text('出错');
            }
        });
    }

    $('#J-param-name li').on('click', function(){
        $(this).addClass('current').siblings().removeClass('current');
        paramName = $(this).data('id');
        send();
    });

    $('#J-param-order li').on('click', function(){
        $(this).addClass('current').siblings().removeClass('current');
        paramOrder = $(this).data('id');
        send();
    });

    $('#J-param-view li').on('click', function(){
        $(this).addClass('current').siblings().removeClass('current');
        paramView = $(this).data('id');
        send();
    });
})();