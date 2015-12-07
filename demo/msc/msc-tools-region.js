(function(window, $, msc) {
    /**
     * 区域级联select, 必须使用new, 此文件包含数据, 库里存的数据为值,而不是key, 请引用自己需要的数据, 如: msc-tools-region-data.js, data2.js
     * @param  {object} config 配置
     * @param {(string|HTMLElement|$(selector))}    config.province                省的选择器
     * @param {(string|HTMLElement|$(selector))}    config.city                    市的选择器
     * @param {(string|HTMLElement|$(selector))}    config.area                    县的选择器
     * @param {boolean}                             [config.auto=false]     是否获取select的值填充
     * @return {object}                                                     实例
     * @author xieliang
     * @email   xieyaowu@meishichina.com
     *
     * @function
     * @memberOf msc.tools
     * @namespace msc.tools.region
     *
     * @example
     *     1, 自动填入数据, 只要数据正确就没问题, 如果数据错误就不显示, 比如 你非要写河北省里的天津市
     *         html:    <select name="" id="J_jiaxiang_sheng">
     *                     <option value="河北省">河北省</option>
     *                  </select>
     *                  <select name="" id="J_jiaxiang_shi">
     *                      <option value="邯郸市">邯郸市</option>
     *                  </select>
     *                  <select name="" id="J_jiaxiang_xian">
     *                      <option value="邯山区">邯山区</option>
     *                  </select>
     *          js: 
     *              new msc.tools.region({
     *                  province:$("#J_jiaxiang_sheng"),
     *                  city:$("#J_jiaxiang_shi"),
     *                  area:$("#J_jiaxiang_xian"),
     *                  auto:true
     *              });
     *      2, 外部设置数据
     *          html同1
     *          js:
     *              new msc.tools.region({
     *                  province:$("#J_xian_sheng"),
     *                  city:$("#J_xian_shi")
     *              }).val({
     *                  province:"河北省",
     *                  city:"邯郸市"
     *              });
     *              
     *              或
     *              var a = new msc.tools.region({
     *                  province:$("#J_xian_sheng"),
     *                  city:$("#J_xian_shi")
     *              });
     *              a.val("河北省", "邯郸市");
     *              
     *              你也可以只设置某个元素, 当然如果不存在则不生效
     *              a.val({
     *                  city: "邯郸市"
     *              });
     *       3, 外部使用jQuery选中, $("#id").val("北京市").change();//触发下change事件就ok
     *
     */
    var region = msc.tools.region = function(config) {
        return this._init(config);
    }

    region.prototype = {
        //初始化
        _init: function(config) {
            this.config = $.extend({}, region.defaults, config);
            this._bindDom();
            this.config.auto && this._initAuto();
            this._bind();
            this.config.auto && this._trigger();
            return this;
        },

        //绑定 dom 对象
        _bindDom: function() {
            var config = this.config;
            this._dom = {};
            this._dom.province = config.province ? $(config.province) : null;
            this._dom.city = config.city ? $(config.city) : null;
            this._dom.area = config.area ? $(config.area) : null;

        },
        
        //内部触发默认设置的
        _trigger: function() {
            var defaultValue = this.config.defaultValue,
                self = this;
            setTimeout(function() {
                self.val(defaultValue.province, defaultValue.city, defaultValue.area);
            });
        },
        //内部设置省
        _setProvince: function(value) {
            var dom = this._dom,
                data = region.data;
            if (value && dom.province && data[value]) {
                dom.province.val(value).triggerHandler("change", ["val"]);
            }
        },

        //内部设置市
        _setCity: function(value) {
            var dom = this._dom,
                province,
                data = region.data;
            if (value && dom.city) {
                province = dom.province.val();
                if (province && data[province][value]) {
                    dom.city.val(value).triggerHandler("change", ["val"]);
                }
            }
        },

        // 内部设置县
        _setArea: function(value) {
            var dom = this._dom,
                province,
                data = region.data,
                city;
            if (value && dom.area) {
                province = dom.province.val();
                city = dom.city.val();

                if (province && $.inArray(value, data[province][city] || []) > -1) {
                    dom.area.val(value).change();
                }
            }
        },

        // 对外接口, 设置值
        val: function(province, city, area) {
            var self = this,
                dom = self._dom,
                data = region.data;


            if ($.isPlainObject(province)) {
                city = province.city;
                area = province.area;
                province = province.province;
            }



            province && self._setProvince(province);

            if (city) {
                setTimeout(function() {
                    self._setCity(city);
                }, 100);
            }
            if (area) {
                setTimeout(function() {
                    self._setArea(area);
                }, 200);
            }


            return self;
        },

        // 初始化自动获取select的值
        _initAuto: function() {
            var config = this.config,
                dom = this._dom;
            config.defaultValue = {};
            dom.province && (config.defaultValue.province = dom.province.val());
            dom.city && (config.defaultValue.city = dom.city.val());
            dom.area && (config.defaultValue.area = dom.area.val());

        },

        // 绑定事件
        _bind: function() {
            var self = this,
                dom = self._dom,
                str,
                data = region.data,
                item;

            dom.province.change(function(e, a) {
                 setTimeout(function(){
                    self._changeProvince(a);
                });
            });



            if (dom.city) {
                dom.city.html('<option value="">请选择市</option>').change(function(e, a) {
                    setTimeout(function(){
                        self._changeCity(a);
                    });
                });
            }

            if (dom.area) {
                dom.area.html('<option value="">请选择县</option>');
            }


            //处理省
            str = '<option value="">请选择省</option>';
            for (item in data) {
                str += '<option value="' + item + '"">' + item + '</option>';
            }
            dom.province.empty().html(str);
            setTimeout(function(){
                dom.province.change();
            });
        },

        //改变市的回调
        _changeCity: function(a) {
            var dom = this._dom,
                str,
                item,
                data,
                value1,
                value2;

            if (dom.area) {
                value1 = dom.province.val();
                value2 = dom.city.val();
                data = region.data;
                str = '<option>请选择县</option>';



                //如果第一个为默认或者第二个为默认 则让第三个不可用
                if (!value1 || !value2 || !data[value1][value2] || !data[value1][value2].length) {
                    dom.area.html(str).prop("disabled", true);
                } else {
                    $.each(data[value1][value2], function(i, val) {
                        str += '<option value=' + val + '>' + val + '</option>';
                    });
                    dom.area.prop("disabled", false).html(str);
                }
                setTimeout(function(){
                    dom.area.change();
                });
            }
        },

        //改变省的回调
        _changeProvince: function( a ) {
            var dom = this._dom,
                str,
                item,
                data,
                value;
            if (dom.city) {
                value = dom.province.val();
                data = region.data;
                str = '<option>请选择市</option>';

                dom.city.empty();

                if (!value || !$.isPlainObject(data[value])) {
                    dom.city.html(str).prop("disabled", true);
                } else {
                    for (item in data[value]) {
                        str += '<option value=' + item + '>' + item + '</option>';
                    }
                    dom.city.prop("disabled", false).html(str);
                }

                setTimeout(function(){
                    dom.city.change();
                });
            }
        }
    }




    region.defaults = {
        province: "",
        city: "",
        area: "",
        auto: false //是否根据select的value获得值?
    }

}(window, jQuery, msc));