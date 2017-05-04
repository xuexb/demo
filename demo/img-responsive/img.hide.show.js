/**
 * @file 设置图片显示隐藏
 * @author xuexb <fe.xiaowu@gmail.com>
 */

(function () {
    var isShowImg = true;

    $('img').each(function () {
        $(this).data('src-hide', this.src);
    });

    $('<div />')
    .css({
        position: 'fixed',
        left: 0,
        bottom: 0,
        height: 50,
        lineHeight: '50px',
        width: '100%',
        zIndex: 1000,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, .3)',
        fontSize: 12
    })
    .text('点击设置页面图片显示状态(可以查看图片占位)~')
    .on('click', function () {
        $('img').attr('src', isShowImg ? '' : function () {
            return $(this).data('src-hide');
        });

        isShowImg = !isShowImg;
    })
    .appendTo('body');

    $('body').css('padding-bottom', 50);
})();