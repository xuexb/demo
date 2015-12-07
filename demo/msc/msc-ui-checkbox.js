/**
 * 美化复选框
 * @description ie9+直接使用css解决,必须符合结构 input.ui-checkbox[id=J_test]+label.ui-checkbox-for.icon1[for=J_test], 依赖ui.css,要把input隐藏掉, 但不能是display:none;
 * @memberOf msc.ui
 * @author xieliang
 * @email xieyaowu@meishichina.com
 * @param  {(string|HTMLElement|jQuery)} id 选择器
 *
 * @namespace msc.ui.checkbox
 * @example
 *     1, msc.ui.checkbox("#id .checkbox");
 *     2, msc.ui.checkbox($("#test"));
 *     3, msc.ui.checkbox(document.getElementById("id"));
 *     4, 选择:
 *         $("#test").prop("checked", true).change();//直接用原jQuery方法即可, 但最后要触发下 嫦娥 (change)
 */
(function($, msc) {

    /**
     * 美化复选框主入口
     */
    msc.ui.checkbox = function(id) {

        //如果不是jQuery对象则套上
        if (!(id instanceof jQuery)) {
            id = $(id);
        }


        //如果支持 css3:checked 则只操作初始化
        if (msc.tools.browser.isMedia) {
            id.filter(function() {
                return this.checked;
            }).change();
        } else {

            $.each(id, function() {
                var $this;

                if (!this._checkbox) {
                    this._checkbox = 1;
                    $this = $(this);

                    //给input绑定change事件
                    $this.on("change", function() {
                        $(this).next()[this.checked ? 'addClass' : 'removeClass']('ui-checkbox-for-on');
                    });

                    //模拟初始化
                    if (this.checked) {
                        $this.change();
                    }

                }
            });
        }

    }
}(jQuery, msc));