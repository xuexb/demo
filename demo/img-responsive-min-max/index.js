

(function () {
    'use strict';

    var params;

    var initParams = function () {
        params = Url.querystring.parse();
        ['width', 'height', 'min', 'max', 'threshold'].forEach(function (key) {
            params[key] = Math.abs(params[key]) || 0;
        });

        if (!params.threshold) {
            params.threshold = .8;
        }
        if (params.min > params.max) {
            params.min = params.max;
        }
    };

    initParams();

    if (!params.width || !params.height || !params.min || !params.max) {
        $('.loading').text('加载出错');
        return;
    }

    if (!params.threshold) {
        params.threshold = .8;
    }

    var getWH = function(data, target) {
        if (!target) {
            target = {};
        }
        if (target.width) {
            data = {
                width: target.width,
                height: target.width / data.width * data.height
            }
        }
        else if (target.height) {
            data = {
                height: target.height,
                width: target.height / data.height * data.width
            }
        }

        return data;
    };

    var getOffset = function() {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var minHeight = params.min;
        var maxHeight = params.max;
        var width = params.width;
        var height = params.height;
        var type = width / height >= vw / maxHeight ? 'width' : 'height';
        var data;
        var threshold = params.threshold;

        // 宽为长边
        if (type === 'width') {
            // 宽小于阀值
            if (width < vw * threshold) {
                data = {
                    width: width,
                    height: height
                };
            }

            else {
                // 先优先考虑横向铺满
                data = getWH({
                    width: width,
                    height: height
                }, {
                    width: vw
                });
            }
        }

        else {
            if (height <= minHeight) {
                // 高小于最小高阀值, 认为是小图
                if (height < minHeight * threshold) {
                    data = {
                        width: width,
                        height: height
                    };
                }
                else {
                    // 拉伸最小高
                    data = getWH({
                        width: width,
                        height: height
                    }, {
                        height: minHeight
                    });

                }
            }

            else if (height > minHeight && height <= maxHeight) {
                // 宽小于屏幕宽的阀值
                if (width < vw * threshold) {
                    data = {
                        width: width,
                        height: height
                    };
                }
                else {
                    // 拉满屏幕
                    var target = getWH({
                        width: width,
                        height: height
                    }, {
                        width: vw
                    });


                    // 如果拉满屏幕后高超了, 则用原图
                    if (target.height > maxHeight) {
                        data = {
                            width: width,
                            height: height
                        };
                    }
                    else {
                        data = target;
                    }
                }
            }

            else {
                data = getWH({
                    width: width,
                    height: height
                }, {
                    height: maxHeight
                });

            }
        }

        if (data.height < minHeight) {
            data.maskHeight = minHeight;
        }
        else if (data.height > maxHeight) {
            data.maskHeight = maxHeight;
        }
        else {
            data.maskHeight = data.height;
        }

        data.maskWidth = vw;
        data.left = (data.maskWidth - data.width) / 2;
        data.top = (data.maskHeight - data.height) / 2;
        return data;
    };

    var setPosition = function () {
        var pos = getOffset();
        console.log(pos, params)
        $('#inner').css({
            width: pos.width,
            height: pos.height
        });
        $('#mask').css({
            width: pos.maskWidth,
            height: pos.maskHeight
        });
    };

    setPosition();
    $(window).on('resize', setPosition);
    $('#img').attr('src', 'https://dummyimage.com/' + params.width + 'x' + params.height);
    $('.loading').remove();
    $('.imgbox').show();

    $('.imgbox').on('click', function () {
        if (!$('.imgbox').hasClass('isFull')) {
            params.min = window.innerHeight;
            params.max = window.innerHeight;
        }
        else {
            initParams();
        }

        setPosition();

        $('.imgbox').toggleClass('isFull');
    });
})();