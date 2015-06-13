/**
 * 美化复选框
 * @author xieliang
 * @description 尽量不破坏jquery，使用代码完全兼容jquery操作
 *
 * @坑1：在使用prop操作时没有触发change事件，导致ui显示不同
 * @坑2：禁用的时候还能使用prop操作选中
 * 
 */

(function() {
    //fix使用prop操作时没有触发change事件
    $.each([
        'prop',
        'removeProp'
    ], function(index, value) {
        var _val = $.fn[value];
        $.fn[value] = function(name, target) {
            var self = this;

            //如果为获取值
            if (target === void 0) {
                return _val.call(self, name);
            }

            // 执行老的
            _val.apply(self, [].slice.call(arguments));

            //对选中操作特殊处理
            //因为使用prop操作时没有触发change
            if (name === 'checked') {
                self.trigger('change', [target]);
            }

            if (window.addEventListener) {
                return self;
            }

            //对禁用操作特殊处理
            if (name === 'disabled') {
                self.trigger(name, [target]);
            }

            return self;
        }
    });

    // 扩展插件
    $.fn.checkboxMM = function() {
        var self = this;

        //如果支持:checked伪类
        if (window.addEventListener) {
            return self;
        }

        // 绑定事件
        self.on('change checked', function(event, flag) {
            //如果没有值则说明是用户点击页面触发
            if (flag === void 0) {
                $(this).parent().toggleClass('checked');
            } else { //否则为动态设置触发
                $(this).parent()[flag === true ? 'addClass' : 'removeClass']('checked');
            }
        });

        //绑定禁用事件
        self.on('disabled', function(event, flag) {
            return $(this).parent()[flag === true ? 'addClass' : 'removeClass']('disabled');
        });

        // 触发默认的选中ui
        self.filter(':checked').trigger('checked', [true]);

        //触发默认的禁用ui
        self.filter(':disabled').trigger('disabled', [true]);

        return self;
    }
}());