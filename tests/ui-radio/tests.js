/**
 * 美化单选测试用例
 * @author xieliang
 * @email admin@xuexb.com
 */

(function() {
    'use strict';

    var is_ie_78 = !window.addEventListener,//针对ie78测试一些ui的显示问题，通过判断是否有相关的类来表示是否ok
        $iframe = $('iframe').contents();

    //测试使用prop操作input元素
    describe('使用prop操作', function() {
        var $input = $iframe.find('#J-demo1').find('input[type="radio"]').eq(0),
            $input2 = $iframe.find('#J-demo1').find('input[type="radio"]').eq(0);

        it('选中', function() {
            $input.prop('checked', true);

            //test
            expect($input.prop('checked')).toBe(true);
        });

        it('取消', function() {
            $input.prop('checked', false);

            //test
            expect($input.prop('checked')).toBe(false);
        });


        if (is_ie_78) {
            it('ie8-里选中的ui', function() {
                $input.prop('checked', true);

                //test
                expect($input.parent().hasClass('checked')).toBe(true);
            });
            it('ie8-里取消选中的ui', function() {
                $input.prop('checked', false);

                //test
                expect($input.parent().hasClass('checked')).toBe(false);
            });
        }

        it('removeProp移除', function(){
            $input2.prop('checked', true);//先选中
            expect($input2.removeProp('checked').prop('checked')).toBe(undefined);
        });

        if(is_ie_78){
            it('ie8-里removeProp移除后的ui', function(){
                $input2.prop('checked', true);//先选中
                expect($input2.removeProp('checked').parent().hasClass('checked')).toBe(undefined);
            });
        }
    });


    //测试默认值的状态和ie78里ui的显示
    describe('初始化时默认值', function() {
        var $input = $iframe.find('#J-demo2').find('input[type="radio"]').eq(0),
            $input_no = $iframe.find('#J-demo2').find('input[type="radio"]').eq(1);

        it('选中状态', function() {
            //test
            expect($input.prop('checked')).toBe(true);
        });

        it('未选中状态', function() {
            //test
            expect($input_no.prop('checked')).toBe(false);
        });


        if (is_ie_78) {
            it('ie8-选中状态的ui', function() {
                //test
                expect($input.parent().hasClass('checked')).toBe(true);
            });
            it('ie8-未选中状态的ui', function() {
                //test
                expect($input_no.parent().hasClass('checked')).toBe(false);
            });
        }
    });


    //测试获取值是否跟ui显示的一样，这里主要是ie78
    describe('获取值', function() {
        var $input = $iframe.find('#J-demo2').find('input[type="radio"]'),//2个按钮
            old_value1 = $input.eq(0).val(),
            old_value2 = $input.eq(1).val();

        it('选中1', function(){
            $input.eq(0).prop('checked', true);
            expect($input.filter(':checked').val()).toBe(old_value1);
        });
        if(is_ie_78){
            it('ie8-里选中1时的ui', function(){
                $input.eq(0).prop('checked', true);
                expect($input.eq(0).parent().hasClass('checked')).toBe(true);
                expect($input.eq(1).parent().hasClass('checked')).toBe(false);
            });
        }

        it('选中2', function(){
            $input.eq(1).prop('checked', true);
            expect($input.filter(':checked').val()).toBe(old_value2);
        });
        if(is_ie_78){
            it('ie8-里选中2时的ui', function(){
                $input.eq(1).prop('checked', true);
                expect($input.eq(0).parent().hasClass('checked')).toBe(false);
                expect($input.eq(1).parent().hasClass('checked')).toBe(true);
            });
        }
    });
})();