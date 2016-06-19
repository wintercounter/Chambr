'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE = exports.ACTION_COMPLEX = exports.ACTION_SIMPLE_DEL = exports.ACTION_SIMPLE_SET = undefined;
exports.Arr = Arr;
exports.Obj = Obj;
exports.Map = Map;
exports.Set = Set;

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_SIMPLE_SET = exports.ACTION_SIMPLE_SET = 'action-simple-set';
var ACTION_SIMPLE_DEL = exports.ACTION_SIMPLE_DEL = 'action-simple-delete';
var ACTION_COMPLEX = exports.ACTION_COMPLEX = 'action-complex';
var UPDATE = exports.UPDATE = 'update';

var M = Map;
var S = Set;

function Arr() {
	var input = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	return Simple(input);
}

function Obj() {
	var input = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	return Simple(input);
}

function Map() {
	var input = arguments.length <= 0 || arguments[0] === undefined ? new M() : arguments[0];

	return Complex(input);
}

function Set() {
	var input = arguments.length <= 0 || arguments[0] === undefined ? new S() : arguments[0];

	return Complex(input);
}

function Simple(type) {
	(0, _riotObservable2.default)(type);
	// TODO Compact callbacks
	type = new Proxy(type, {
		set: function set(target, name, value) {
			var r = target[name] = value;
			// No need to trigger array length change
			if (name !== 'length') {
				type.trigger(ACTION_SIMPLE_SET, name, value);
				type.trigger(UPDATE);
			}
			return r;
		},
		deleteProperty: function deleteProperty(target, name, value) {
			delete target[name];
			type.trigger(ACTION_SIMPLE_DEL, name, value);
			type.trigger(UPDATE);
			return true;
		}
	});
	return type;
}

function Complex(type) {
	(0, _riotObservable2.default)(type)[('clear', 'delete', 'set')].forEach(function (method) {
		var m = type['_' + method] = type[method];
		type[method] = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			m.call(this, args);
			type.trigger.apply(type, [ACTION_COMPLEX, method].concat(args));
			type.trigger(method);
			type.trigger(UPDATE);
		};
	});
	return type;
}