'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _ObjectStorage2 = require('./ObjectStorage');

var _ObjectStorage3 = _interopRequireDefault(_ObjectStorage2);

var _localforage = require('localforage');

var _localforage2 = _interopRequireDefault(_localforage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LocalStorage = function (_ObjectStorage) {
	_inherits(LocalStorage, _ObjectStorage);

	function LocalStorage() {
		var _ref;

		_classCallCheck(this, LocalStorage);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var _this = _possibleConstructorReturn(this, (_ref = LocalStorage.__proto__ || Object.getPrototypeOf(LocalStorage)).call.apply(_ref, [this].concat(args)));

		_localforage2.default.getItem(_this[_ObjectStorage2.namespace]).then(function (v) {
			_this[_ObjectStorage2.cache] = JSON.parse(v);
			_this.trigger(_ObjectStorage2.EV.READY);
		});
		_this.on(_ObjectStorage2.EV.SET, function (k, v) {
			return _localforage2.default.setItem(_this[_ObjectStorage2.namespace], JSON.stringify(_this[_ObjectStorage2.cache]));
		});
		_this.on(_ObjectStorage2.EV.REMOVE, function (k, v) {
			return _localforage2.default.setItem(_this[_ObjectStorage2.namespace], JSON.stringify(_this[_ObjectStorage2.cache]));
		});
		_this.on(_ObjectStorage2.EV.CLEAR, function (k, v) {
			return _localforage2.default.clear();
		});
		return _this;
	}

	return LocalStorage;
}(_ObjectStorage3.default);

exports.default = LocalStorage;