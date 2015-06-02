/**
 * 美化单选测试用例
 * @author xieliang
 * @email admin@xuexb.com
 */

(function() {
    'use strict';


    asyncTest("简单的触发", 1, function() {
        var demo = new Event();
        var res = false;

        demo.on('test', function() {
            res = true;
        });
        demo.trigger('test');
        setTimeout(function() {
            strictEqual(res, true, '事件被触发');
            start();
        }, 500);
    });

    asyncTest("多次触发", 1, function() {
        var demo2 = new Event();
        var num = 0;

        demo2.on('test', function() {
            num += 1;
        });
        demo2.trigger('test');
        demo2.trigger('test');
        demo2.trigger('test');
        setTimeout(function() {
            strictEqual(num, 3, '触发多次成功');
            start();
        }, 500);
    });


    asyncTest("触发多个事件", 1, function() {
        var demo = new Event();
        var length = 0;

        demo.on('test', function() {
            length += 1;
        });
        demo.on('test', function() {
            length += 1;
        });
        demo.on('test', function() {
            length += 1;
        });
        demo.trigger('test');
        setTimeout(function() {
            strictEqual(length, 3, '触发事件数量正确');
            start();
        }, 500);
    });

    asyncTest("触发事件的顺序", 1, function() {
        var demo = new Event();
        var num = null;

        setTimeout(function() {
            demo.on('test', function() {
                num = 1;
            });
        });

        demo.on('test', function() {
            num = 2;
        });

        setTimeout(function(){
            demo.trigger('test');
        }, 1);
        setTimeout(function() {
            strictEqual(num, 1, '顺序成功');
            start();
        }, 500);
    });

    asyncTest("绑定一次事件", 1, function() {
        var demo = new Event();
        var num = 0;

        demo.one('test', function() {
            num += 1;
        });


        demo.trigger('test');
        demo.trigger('test');
        setTimeout(function() {
            strictEqual(num, 1, '一次成功');
            start();
        }, 500);
    });


    asyncTest("移除事件", 1, function() {
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
        setTimeout(function() {
            strictEqual(num, 0, '移除全部事件成功');
            start();
        }, 500);

    });

    asyncTest("移除事件", 1, function() {
        var demo2 = new Event();
        var str = '';
        var del = function(){
            str += 'b';
        }

        demo2.on('test', function() {
            str += 'a';
        });
        demo2.on('test', del);
        demo2.on('test', function() {
            str += 'a';
        });

        demo2.off('test', del);

        setTimeout(function(){
            demo2.trigger('test');
        }, 100);

        setTimeout(function() {
            strictEqual(str, 'ac', '移除单个成功');
            start();
        }, 500);
    });
})();