'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var a = undefined;

a = 3;

console.log(a);

var c = function c(x) {
    console.log(x);
};

c('1');

var d = function d() {
    var _console;

    (_console = console).log.apply(_console, arguments);
};
d('1', 2, 3);

var str = '\naaa\n\nbbb\n\n\ncccc\n\n\nddd\n';

d(str);

var _class = (function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'init',

        /**
         * 初始化
         *
         * @param  {Object} http http
         */
        value: function init(http) {
            _get(Object.getPrototypeOf(_class.prototype), 'init', this).call(this, http); //调用父类的init方法
        }

        /**
         * 设置当前位置
         *
         * @param {Object} data 数据 {url, name}
         */

    }, {
        key: 'set_location',
        value: function set_location() {
            var _arr;

            var arr = [{
                url: '/',
                name: '主页'
            }];

            (_arr = arr).push.apply(_arr, arguments);

            arr = arr.map(function (val) {
                return val.url ? '<a href="' + val.url + '">' + val.name + '</a>' : val.name;
            });

            this.assign('location_data', arr.join(' > '));
        }

        /**
         * 设置导航类型
         *
         * @param {string} type 大类型
         * @param {number} id   小类id
         */

    }, {
        key: 'set_nav_type',
        value: function set_nav_type(type) {
            var id = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            this.assign('nav_type', type);

            if (id) {
                this.assign('nav_type_id', id);
            }
        }
    }]);

    return _class;
})();

exports.default = _class;