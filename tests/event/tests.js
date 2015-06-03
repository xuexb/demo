/**
 * 美化单选测试用例
 * @author xieliang
 * @email admin@xuexb.com
 */

(function() {
    'use strict';


    asyncTest("事件触发", 3, function() {
        var demo = new Event();
        var res = false;
        demo.on('test', function() {
            res = true;
        });
        demo.trigger('test');
        strictEqual(res, true, '单次触发');

        //触发多次
        var demo2 = new Event();
        var num = 0;
        demo2.on('test', function() {
            num += 1;
        });
        demo2.trigger('test');
        demo2.trigger('test');
        demo2.trigger('test');
        strictEqual(num, 3, '多次触发');


        var demo5 = new Event();
        var str5 = '';
        demo5.on('test', function(a, b) {
            str5 = a + '+' + b;
        });
        demo5.trigger('test', ['a', 'b']);
        strictEqual(str5, 'a+b', '触发时带数据');


        start();
    });



    asyncTest("绑定事件", function(assert) {
        assert.expect(4);

        var demo2 = new Event();
        var a = 0;
        demo2.on('test', function() {
            a += 1;
        });
        demo2.trigger('test');
        demo2.trigger('test');
        strictEqual(a, 2, '绑定成功');



        var demo = new Event();
        var num = 0;
        demo.one('test', function() {
            num += 1;
        });
        demo.trigger('test');
        demo.trigger('test');
        demo.trigger('test');
        strictEqual(num, 1, '绑定一次成功');


        //绑定多次事件
        var demo3 = new Event();
        var length = 0;
        demo3.on('test', function() {
            length += 1;
        });
        demo3.on('test', function() {
            length += 1;
        });
        demo3.on('test', function() {
            length += 1;
        });
        demo3.trigger('test');
        strictEqual(length, 3, '触发多个事件');

        //顺序
        var done4 = assert.async();
        var demo4 = new Event();
        var num4 = null;
        setTimeout(function() {
            demo4.on('test', function() {
                num4 = 1;
            });
        });
        demo4.on('test', function() {
            num4 = 2;
        });
        setTimeout(function() {
            demo4.trigger('test');
            strictEqual(num4, 1, '绑定顺序成功');
            done4();
        }, 1000);


        start();
    });


    asyncTest("移除事件", 2, function() {
        var demo = new Event();
        var num = 0;
        demo.on('test', function() {
            num += 1;
        });
        demo.on('test', function() {
            num += 1;
        });
        demo.on('test', function() {
            num += 1;
        });
        demo.off('test');
        demo.trigger('test');
        demo.trigger('test');
        strictEqual(num, 0, '移除全部事件成功');


        var demo2 = new Event();
        var str = '';
        var del = function() {
            str += 'b';
        }
        demo2.on('test', function() {
            str += 'a';
        });
        demo2.on('test', del);
        demo2.on('test', function() {
            str += 'c';
        });
        demo2.off('test', del);

        demo2.trigger('test');
        strictEqual(str, 'ac', '移除单个成功');
        start();

    });


    asyncTest("回调", 2, function(assert) {
        var demo2 = new Event();
        var str = '';
        demo2.on('test', function(a, b) {
            this.trigger('ok', ['data']);
        });
        demo2.on('ok', function(data) {
            str = data;
        });
        demo2.trigger('test');
        strictEqual(str, 'data', '回调的this');


        var done3 = assert.async();
        var demo3 = new Event();
        var str3 = '';
        demo3.on('test', function(a, b) {
            str3 = this.data;
        });
        demo3.trigger({
            data: '{}.data'
        }, 'test');
        setTimeout(function(){
            strictEqual(str3, '{}.data', '改变回调的this');
            done3();
        }, 100);



        start();
    });

})();