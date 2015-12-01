/**
 * @file es6-babel5
 * @author xx
 */

'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Es6 = (function () {
    _createClass(Es6, null, [{
        key: 'options',
        value: {
            test: 1
        },
        enumerable: true
    }]);

    function Es6() {
        _classCallCheck(this, Es6);

        console.log(this.options, Es6.options);
    }

    return Es6;
})();

var app = new Es6();