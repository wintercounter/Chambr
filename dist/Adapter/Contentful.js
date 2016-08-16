'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

var _contentful = require('contentful');

var _contentful2 = _interopRequireDefault(_contentful);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientInstances = {};
var _request = Symbol();

var ContentfulAdapter = function () {
	_createClass(ContentfulAdapter, null, [{
		key: 'getClientInstance',
		value: function getClientInstance(config) {
			var k = config.accessToken + config.space;
			var instance = ClientInstances[k] = ClientInstances[k] || _contentful2.default.createClient(config);
			return instance;
		}
	}]);

	function ContentfulAdapter() {
		var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, ContentfulAdapter);

		this.requestCount = 0;

		(0, _riotObservable2.default)(this);
		this.client = ContentfulAdapter.getClientInstance(config);
	}

	_createClass(ContentfulAdapter, [{
		key: 'getSpace',
		value: function getSpace() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return this[_request]('getSpace', args);
		}
	}, {
		key: 'getContentType',
		value: function getContentType() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			return this[_request]('getContentType', args);
		}
	}, {
		key: 'getContentTypes',
		value: function getContentTypes() {
			for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				args[_key3] = arguments[_key3];
			}

			return this[_request]('getContentTypes', args);
		}
	}, {
		key: 'getEntry',
		value: function getEntry() {
			for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				args[_key4] = arguments[_key4];
			}

			return this[_request]('getEntry', args);
		}
	}, {
		key: 'getEntries',
		value: function getEntries() {
			for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				args[_key5] = arguments[_key5];
			}

			return this[_request]('getEntries', args);
		}
	}, {
		key: 'getAsset',
		value: function getAsset() {
			for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
				args[_key6] = arguments[_key6];
			}

			return this[_request]('getAsset', args);
		}
	}, {
		key: 'getAssets',
		value: function getAssets() {
			for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
				args[_key7] = arguments[_key7];
			}

			return this[_request]('getAssets', args);
		}
	}, {
		key: 'sync',
		value: function sync() {
			for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
				args[_key8] = arguments[_key8];
			}

			return this[_request]('sync', args);
		}
	}, {
		key: _request,
		value: function value(method, args) {
			var _client,
			    _this = this;

			// Trigger loading only once
			!(++this.requestCount - 1) && this.trigger(ContentfulAdapter.EV.LOADING);

			return (_client = this.client)[method].apply(_client, _toConsumableArray(args)).then(function (result) {
				! --_this.requestCount && _this.trigger(ContentfulAdapter.EV.DONE);
				return result;
			});
		}
	}]);

	return ContentfulAdapter;
}();

ContentfulAdapter.EV = {
	LOADING: 'loading',
	DONE: 'done'
};
exports.default = ContentfulAdapter;