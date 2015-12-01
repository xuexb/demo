'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        (0, _classCallCheck3.default)(this, _class);
    }

    (0, _createClass3.default)(_class, [{
        key: 'init',

        /**
         * 初始化
         *
         * @param  {Object} http http
         */
        value: function init(http) {
            (0, _get3.default)((0, _getPrototypeOf2.default)(_class.prototype), 'init', this).call(this, http); //调用父类的init方法
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

        /**
         * 前置方法
         */

    }, {
        key: '__before',
        value: (function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(http) {
                var auto;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _get3.default)((0, _getPrototypeOf2.default)(_class.prototype), '__before', this).call(this, http);

                            case 2:

                                // 布局
                                auto = this.get('auto');

                                if (auto) {
                                    this.cookie('auto', auto);
                                }
                                this.assign('auto', auto || this.cookie('auto'));

                                this.set_nav_type('home');

                                // 列表数据
                                _context.t0 = this;
                                _context.next = 9;
                                return this.model('list').getCacheList();

                            case 9:
                                _context.t1 = _context.sent;

                                _context.t0.config.call(_context.t0, 'list_data', _context.t1);

                                // 默认的title
                                this.assign('title', '前端小武--前端开发小武专注计算机基础和WEB前端开发知识');

                                // 列表数据设置到模板中
                                this.assign('list_data', this.config('list_data'));

                                // 随机标签
                                _context.t2 = this;
                                _context.next = 16;
                                return this.model('tags').getCacheRandList();

                            case 16:
                                _context.t3 = _context.sent;

                                _context.t2.assign.call(_context.t2, 'rand_tags_data', _context.t3);

                                _context.t4 = this;
                                _context.next = 21;
                                return this.model('search').getCacheHitTopList();

                            case 21:
                                _context.t5 = _context.sent;

                                _context.t4.assign.call(_context.t4, 'search_hit_data', _context.t5);

                            case 23:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
            return function __before(_x2) {
                return ref.apply(this, arguments);
            };
        })()
    }]);
    return _class;
})();

exports.default = _class;