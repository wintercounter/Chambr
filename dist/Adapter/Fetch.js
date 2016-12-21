'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.inProgress = exports.handleError = exports.parseData = exports.parseResponse = exports.buildUrl = exports.config = exports.DEFAULTS = exports.STATE = exports.EV = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EV = exports.EV = {
	SUCCESS: 'fetch-success',
	ERROR: 'fetch-error',
	LOADING: 'fetch-loading',
	STATE: 'fetch-state'
};

var STATE = exports.STATE = {
	CALM: 'state-calm',
	LOADING: 'state-loading'
};

var DEFAULTS = exports.DEFAULTS = {
	base: location.origin,
	cache: false,
	responseFormat: JSON,
	headers: {},

	// TODO
	single: true
};

var config = exports.config = Symbol();
var buildUrl = exports.buildUrl = Symbol();
var parseResponse = exports.parseResponse = Symbol();
var parseData = exports.parseData = Symbol();
var handleError = exports.handleError = Symbol();
var inProgress = exports.inProgress = Symbol();

var bind = Symbol();
var state = Symbol();

var Fetch = function () {
	_createClass(Fetch, [{
		key: 'state',
		get: function get() {
			return this[state] || STATE.CALM;
		}
	}]);

	function Fetch() {
		var cnf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULTS;

		_classCallCheck(this, Fetch);

		(0, _riotObservable2.default)(this);
		this[config] = _extends(this[config], cnf);
		this[inProgress] = {
			_id: 0,
			promises: {}
		};
		this[bind]();
	}

	_createClass(Fetch, [{
		key: 'request',
		value: function request(r) {
			var _this = this;

			return function (routing) {
				var id = _this[inProgress]._id++;
				var promise = Promise(function (resolve, reject) {
					var url = _this[buildUrl](routing);
					_this.trigger(EV.LOADING, { id: id, url: url, routing: routing });
					fetch(url).then(_this[parseResponse].bind(_this)).then(_this[parseData].bind(_this)).then(function (data) {
						return resolve(data);
					}).catch(function (err) {
						return reject(_this.handleError(err));
					});
				});
				_this[inProgress].promises[id] = promise;
				promise.then(function (data) {
					_this.trigger(EV.SUCCESS, data, id);
					return data;
				});
				promise.catch(function (err) {
					_this.trigger(EV.ERROR, err, id);
					throw err;
				});
				return promise;
			}(r);
		}
	}, {
		key: buildUrl,
		value: function value(routing) {
			return this[config].base + '/' + routing;
		}
	}, {
		key: parseResponse,
		value: function value(response) {
			return response;
		}
	}, {
		key: parseData,
		value: function value(response) {
			return response;
		}
	}, {
		key: bind,
		value: function value() {
			var _this2 = this;

			this.on(EV.LOADING, function () {
				_this2[state] !== STATE.LOADING && _this2.trigger(EV.STATE, STATE.LOADING);
				_this2[state] = STATE.LOADING;
			});

			this.on(EV.SUCCESS, function (data, id) {
				delete _this2[inProgress].promises[id];
				if (Object.keys(_this2[inProgress].promises).length) return;
				_this2[state] !== STATE.CALM && _this2.trigger(EV.STATE, STATE.CALM);
				_this2[state] = STATE.CALM;
			});

			this.on(EV.ERROR, function (data, id) {
				delete _this2[inProgress].promises[id];
				if (Object.keys(_this2[inProgress].promises).length) return;
				_this2[state] !== STATE.CALM && _this2.trigger(EV.STATE, STATE.CALM);
				_this2[state] = STATE.CALM;
			});
		}
	}]);

	return Fetch;
}();

exports.default = Fetch;