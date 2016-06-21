'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

var _Storage = require('./Storage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Privates
var _bufferTimeout = Symbol();
var _initBuffer = Symbol();
var _broadcast = Symbol();

var ModelAbstract = function () {
    function ModelAbstract() {
        var _this = this;

        var data = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        _classCallCheck(this, ModelAbstract);

        this.data = undefined;

        (0, _riotObservable2.default)(this);
        this.data = data;
        this[_initBuffer]();
        this.on('*', function (name, data) {
            var onTriggers = _this._onTriggerEventHandlers ? _this._onTriggerEventHandlers[name] : false;
            var promises = [];
            onTriggers && onTriggers.forEach(function (method) {
                var p = _this[method].call(_this, name, data);
                p && p.then && promises.push(p);
            });

            if (promises.length) {
                Promise.all(promises).then(function () {
                    return _this[_broadcast](name, data);
                });
            } else {
                _this[_broadcast](name, data);
            }
        });
    }

    _createClass(ModelAbstract, [{
        key: _broadcast,
        value: function value(name) {
            var data = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

            var Chambr = this.constructor.__proto__;
            while (Chambr.name !== 'ModelAbstract') {
                Chambr = Chambr.__proto__;
            }
            Chambr = Chambr.Chambr;
            Chambr.resolve('ChambrClient->' + this.constructor.name + '->Event', -1, data, name);
        }
    }, {
        key: _initBuffer,
        value: function value() {
            var _this2 = this;

            this.buffer = new Set();
            if (this.data !== undefined && this.data.on) {
                this.data.on(_Storage.ACTION_SIMPLE_DEL + ' ' + _Storage.ACTION_SIMPLE_SET + ' ' + _Storage.ACTION_COMPLEX, function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    clearTimeout(_this2[_bufferTimeout]);
                    _this2.buffer.add(args);
                    _this2[_bufferTimeout] = setTimeout(function () {
                        return _this2.buffer.clear();
                    }, 0);
                });
            }
        }
    }]);

    return ModelAbstract;
}();

exports.default = ModelAbstract;