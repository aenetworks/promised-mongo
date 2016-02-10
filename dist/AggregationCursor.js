'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CursorJs = require('./Cursor.js');

var _CursorJs2 = _interopRequireDefault(_CursorJs);

var AggregationCursor = (function (_Cursor) {
  _inherits(AggregationCursor, _Cursor);

  function AggregationCursor(collection, config) {
    _classCallCheck(this, AggregationCursor);

    _get(Object.getPrototypeOf(AggregationCursor.prototype), 'constructor', this).call(this, collection, config);
  }

  _createClass(AggregationCursor, [{
    key: 'connect',
    value: function connect() {
      return _regeneratorRuntime.async(function connect$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return AggregationCursor;
})(_CursorJs2['default']);

exports['default'] = AggregationCursor;
;
module.exports = exports['default'];
