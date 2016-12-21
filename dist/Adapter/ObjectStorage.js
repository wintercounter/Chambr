'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = exports.namespace = exports.cache = exports.EV = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EV = exports.EV = {
	SET: 'storage.set',
	REMOVE: 'storage.remove',
	CLEAR: 'storage.clear',
	READY: 'storage.ready'
};

var DELIMITER = '/';
var parse = Symbol('parse');
var cache = exports.cache = Symbol('cache');
var domain = Symbol('domain');
var makeDomain = Symbol('makeDomain');
var host = Symbol('host');
var store = Symbol('store');
var namespace = exports.namespace = Symbol('namespace');

var ObjectStorage = function () {
	function ObjectStorage() {
		var hs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
		var ns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DELIMITER;

		_classCallCheck(this, ObjectStorage);

		(0, _riotObservable2.default)(this);
		this[namespace] = ns;
		this[store] = undefined;
		this[cache] = {};
		this[host] = hs;
		this[domain] = this[parse](ns);
	}

	_createClass(ObjectStorage, [{
		key: 'get',
		value: function get() {
			var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			var s = this[cache];
			keys = this[parse](keys);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var k = _step.value;

					if (s[k]) {
						s = s[k];
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			if (s != this[cache]) {
				return s;
			}
			return null;
		}
	}, {
		key: 'set',
		value: function set() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
			var value = arguments[1];

			var s = this[cache];
			var keys = this[parse](key);
			var l = keys.length;
			var i = 0;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var k = _step2.value;

					if (++i === l) {
						s[k] = value;
						this.trigger(EV.SET, key, value);
						this[host] && this[host].trigger && this[host].trigger(EV.SET, key, value);
					} else if (s[k]) {
						s = s[k];
					} else {
						s = s[k] = {};
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	}, {
		key: 'remove',
		value: function remove(key) {
			var s = this[cache];
			var keys = this[parse](key);
			var l = keys.length;
			var i = 0;
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var k = _step3.value;

					if (++i === l && s.hasOwnProperty(k)) {
						delete s[k];
						this.trigger(EV.REMOVE, key, value);
						this[host] && this[host].trigger && this[host].trigger(EV.REMOVE, key, value);
						return;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}
	}, {
		key: 'clear',
		value: function clear() {
			this[cache] = {};
			this.trigger(EV.CLEAR);
			this[host] && this[host].trigger && this[host].trigger(EV.CLEAR);
		}
	}, {
		key: parse,
		value: function value(url) {
			return url.split(DELIMITER).filter(function (e) {
				return e;
			});
		}
	}, {
		key: makeDomain,
		value: function value() {
			var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			return '' + DELIMITER + this[domain].concat(keys).join(DELIMITER) + DELIMITER;
		}
	}]);

	return ObjectStorage;
}();

exports.default = ObjectStorage;