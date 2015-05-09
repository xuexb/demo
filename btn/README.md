# 按钮样式的研究

## UI展示

[demo](ui.html)

## 如果js处理?

为了友好体验,我要加`loading`,`disabled`状态,比如:

``` js
$('.ui-btn').on('click', function(){
    var that = this,
        $that = $(that),
        is_success;

    //如果正在请求
    //这里主要兼容a标签
    if($that.hasClass('loading') || $that.hasClass('disabled')){
        return false;
    }

    //这里是逻辑判断处理
    
    //判断通过后开始请求接口,并让按钮loading
    $that.addClass('loading');

    $.ajax({
        url: 'http://tcc.taobao.com/cc/json/mobile_tel_segment.htm',//异步接口url
        data: {
            tel: $.trim($('#J-tel').val())
        },//数据
        type: 'POST',//数据发送的方式
        dataType: 'jsonp',//返回数据的类型
        success: function(res){//成功回调,为什么要写在这呢,因为写在这可以很好的兼容zepto核心库
            //处理返回值
            //比如判断是否登录(有权限操作)
            //比如判断返回值是否理想
            if(res){//zepto有这个bug,可能空也是success
                if(res.errcode === 1004){//没登录...test

                } else if(res.errcode) {

                } else {
                    //成功
                    is_success = true;

                    console && console.log(res);
                }
            } else {
                //test
            }
        },
        error: function(){//错误回调,因为有is_success+complete回调处理,基本可以不用这个
        },
        complete: function(){//完成请求回调

            $that.removeClass('loading');
            
            if(is_success === true){//成功
                alert('请求成功');
            } else {//错误,并让按钮可用
                alert('请求失败');
            }

            //test
            var hit = parseInt($that.data('__hit'), 10) || 0;
            if(hit >= 2){
                $that.addClass('disabled');
            } else {
                $that.data('__hit', hit + 1);
            }
        }
    });
});
```

[demo](js.html)


## 封装js方法

todo...

## 注意

* 建议使用`button`标签,但一定要设置其`type`,比如要提交表单就是`submit`,普通的按钮就是`button`了
* 按钮要嵌套`span`标签,因为这样才可以很好的处理只操作类达到`loading`效果
* 操作按钮显示的内容应该操作`span`标签的显示内容,而不是使用`val`