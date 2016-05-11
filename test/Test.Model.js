'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _desc, _value, _class;

var _Worker = require('../dist/Worker');

var _Worker2 = _interopRequireDefault(_Worker);

var _Decorator = require('../dist/Decorator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

//import LocalStorage from '../dist/Adapter/LocalStorage'

/**
 * @extends ModelAbstract
 */
var Test = (_dec = (0, _Decorator.Default)(-1), _dec2 = (0, _Decorator.Peel)('item->value'), _dec3 = (0, _Decorator.Trigger)('customEvent'), _dec4 = (0, _Decorator.On)('remoteUpdated'), (_class = function (_Chambr$Model) {
	_inherits(Test, _Chambr$Model);

	_createClass(Test, [{
		key: 'total',
		get: function get() {
			return this.modelData.length;
		}
	}]);

	function Test() {
		_classCallCheck(this, Test);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Test).call(this));

		_this.modelData = ['one', 'two'];
		return _this;
	}

	_createClass(Test, [{
		key: 'create',
		value: function create(value) {
			this.modelData.push(value);
			return this.resolve(this.modelData.length - 1);
		}
	}, {
		key: 'read',
		value: function read(index) {
			return this.modelData[index];
		}
	}, {
		key: 'update',
		value: function update(index, value) {
			this.modelData[index] = value;
			return this.resolve(value);
		}
	}, {
		key: 'delete',
		value: function _delete(index) {
			return this.resolve(this.modelData.splice(index, 1));
		}
	}, {
		key: 'triggerOnTest',
		value: function triggerOnTest() {
			this.trigger('remoteUpdated');
		}
	}, {
		key: 'onRemoteUpdated',
		value: function onRemoteUpdated() {
			return this.resolve();
		}
	}, {
		key: '_calcPrivate',
		value: function _calcPrivate() {}
	}]);

	return Test;
}(_Worker2.default.Model), (_applyDecoratedDescriptor(_class.prototype, 'total', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'total'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'create', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'create'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'delete', [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, 'delete'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onRemoteUpdated', [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, 'onRemoteUpdated'), _class.prototype)), _class));

var TestExtended = function (_Test) {
	_inherits(TestExtended, _Test);

	function TestExtended() {
		_classCallCheck(this, TestExtended);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(TestExtended).apply(this, arguments));
	}

	_createClass(TestExtended, [{
		key: 'extended',
		value: function extended() {}
	}]);

	return TestExtended;
}(Test);

_Worker2.default.Model = Test;
_Worker2.default.Model = TestExtended;