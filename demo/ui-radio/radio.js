(function() {
    //fix 在ie78里直接使用js的prop,attr等没有改变UI
    if (!window.addEventListener) {
        $.each([
            'prop',
            'removeProp'
        ], function(index, value) {
            var _val = $.fn[value];
            $.fn[value] = function() {
                _val.apply(this, [].slice.call(arguments));
                return this.trigger('change.radio');
            }
        });
    }

    $.fn.radioMM = function() {
        var self = this;

        //如果支持:checked伪类
        if (window.addEventListener) {
            return self;
        }

        //这里不做判断了,因为可能有选择器数组出现,用的时候选择器必须写对
        //如果不是绑定的单选
        // if(!self.length || self[0].nodeName.toUpperCase() !== 'INPUT' || self[0].type !== 'radio'){
        //     return self;
        // }


        //延迟处理下,fix ie78默认值问题
        setTimeout(function() {
            self.filter(':checked').trigger('change.radio');
        });

        return self.on('change.radio', function() {
            self.parent().removeClass('checked');
            this.parentNode.className += ' checked';
        });
    }
}());