'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports._buffer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

var _Storage = require('./Storage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Privates
var _buffer = exports._buffer = Symbol();
var _bufferTimeout = Symbol();
var _initBuffer = Symbol();
var _broadcast = Symbol();

/**
 * Abstract class for Models
 */

var ModelAbstract = function () {

    /**
     *
     * @param {*} data Default model data
     * @constructor
     */
    function ModelAbstract(data) {
        var _this = this;

        _classCallCheck(this, ModelAbstract);

        this.data = undefined;


        // Make it observable
        (0, _riotObservable2.default)(this);

        // Save
        this.data = data || this.__proto__.DefaultData || [];

        // Initialize action buffer
        this[_initBuffer]();

        // Subscribe to every model event
        this.on('*', function (name, data) {

            // Handle @Trigger decorator
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

    /**
     * Triggers/broadcasts events to GUI
     *
     * @param name
     * @param data
     * @private
     */


    /**
     * The model data itself.
     * @type {*}
     */


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

        /**
         * Initializes action buffer
         * We will collect different actions
         * to not execute them one-by-one.
         *
         * @private
         */

    }, {
        key: _initBuffer,
        value: function value() {
            var _this2 = this;

            var buffer = this[_buffer] = new Set();
            if (this.data !== undefined && this.data.on) {
                this.data.on('*', function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    clearTimeout(_this2[_bufferTimeout]);
                    buffer.add(args);
                    _this2[_bufferTimeout] = setTimeout(buffer.clear, 0);
                });
            }
        }
    }]);

    return ModelAbstract;
}();

exports.default = ModelAbstract;