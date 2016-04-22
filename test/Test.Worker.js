(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Highway = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Delimiter to split event routes
 * @type {string}
 */
var DELIMITER = '->';

/**
 * Default bucket prototype
 * @type {{*: {handlers: Array}}}
 */
var DEFAULT_BUCKET = {
	'*': {
		handlers: []
	}
};

/**
 * 'exe' method event name
 * @type {String}
 */
var EV_EXECUTE = 'HWEXECUTE';

/**
 * Main Highway JS class
 */

var Highway = function () {

	/**
  * Host object
  * @static
  */


	/**
  * Bucket to store handlers
  * @type {{*: {handlers: Array}}}
  */


	/**
  * @constructor
  * @param Host {Window || Worker}
  */

	function Highway() {
		var Host = arguments.length <= 0 || arguments[0] === undefined ? self : arguments[0];

		_classCallCheck(this, Highway);

		this.Host = Host;
		this.reset();
		this._bind();
	}

	/**
  * Publish an event
  * @param name  {String} The event's name
  * @param data  [Mixed]  Custom event data
  * @param state [String] Optional state identifier
  * @returns {Highway}
  */


	_createClass(Highway, [{
		key: 'pub',
		value: function pub(name) {
			var data = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
			var state = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

			this.Host.postMessage({ name: name, data: data, state: state }, this.Host === self.window ? self.location.origin : undefined);
			return this;
		}

		/**
   * Subscribe to an event
   * @param name    {String}   The event's name
   * @param handler {Function} Callback function
   * @param one     {Boolean}  Run once, then off?
   * @returns {Highway}
   */

	}, {
		key: 'sub',
		value: function sub(name, handler) {
			var one = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

			// Apply one prop
			handler.one = one;

			// Apply segments and prototype
			var temp = this.Bucket;
			name.split(DELIMITER).forEach(function (k, i, a) {
				if (!temp.hasOwnProperty(k)) {
					temp[k] = {
						handlers: []
					};
				}
				temp = temp[k];
				++i === a.length && temp.handlers.push(handler);
			});

			// Make it chainable
			return this;
		}

		/**
   * Shorthand to subscribe once
   * @param   ...a = this.sub args
   * @returns {Highway}
   */

	}, {
		key: 'one',
		value: function one() {
			for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
				a[_key] = arguments[_key];
			}

			this.sub.apply(this, a.concat([true]));
			return this;
		}

		/**
   * Unsubscribe from an event
   * @param   name      {String} Name of the event
   * @param   handler   {Function|undefined|Boolean} Handler to remove | Remove all for this event name | true: Deep remove
   * @returns {Highway}
   */

	}, {
		key: 'off',
		value: function off(name) {
			var handler = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

			var temp = this.Bucket;

			name.split(DELIMITER).forEach(function (k, i, a) {
				if (temp.hasOwnProperty(k)) {
					if (handler === true && k === a[a.length - 1]) {
						delete temp[k];
					} else {
						temp = temp[k];
						temp.handlers = temp.handlers.filter(function (fn) {
							return !(fn === handler || handler === undefined);
						});
					}
				}
			});
			return this;
		}

		/**
   * Execute a function on the other side.
   * @param fn {Function} The function to execute.
   */

	}, {
		key: 'exe',
		value: function exe(fn) {
			this.pub(EV_EXECUTE, fn.toString().match(/function[^{]+\{([\s\S]*)}$/)[1]);
		}

		/**
   * Destroy the full Highway instance
   */

	}, {
		key: 'destroy',
		value: function destroy() {
			this.Host.removeEventListener('message', this._handler.bind(this));
			delete this.Bucket;
		}

		/**
   * Resets Bucket to default
   */

	}, {
		key: 'reset',
		value: function reset() {
			DEFAULT_BUCKET['*'].handlers = [];
			this.Bucket = Object.assign({}, DEFAULT_BUCKET);
		}

		/**
   * Add message listener to the host
   * @private
   */

	}, {
		key: '_bind',
		value: function _bind() {
			this.Host.addEventListener('message', this._handler.bind(this));
			this.sub(EV_EXECUTE, function (ev) {
				new Function(ev.data).call(self);
			});
		}

		/**
   * onMessage callback handler
   * @param ev {WorkerEvent}
   * @private
   */

	}, {
		key: '_handler',
		value: function _handler(ev) {
			var parsed = this.Bucket;
			var nope = false;

			parsed['*'].handlers.forEach(function (fn) {
				return fn.call(null, ev.data);
			});
			ev.data.name.split(DELIMITER).forEach(function (segment) {
				if (!nope && parsed.hasOwnProperty(segment)) {
					parsed = parsed[segment];

					parsed.handlers.length && parsed.handlers.forEach(function (fn, i, arr) {
						fn.call(null, ev.data);
						fn.one && arr.splice(i, 1);
					});
				} else {
					nope = true;
				}
			});
		}
	}]);

	return Highway;
}();

exports.default = Highway;

},{}]},{},[1])(1)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
;(function(window, undefined) {var observable = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {}

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice

  /**
   * Private Methods
   */

  /**
   * Helper function needed to get and loop all the events in a string
   * @param   { String }   e - event string
   * @param   {Function}   fn - callback
   */
  function onEachEvent(e, fn) {
    var es = e.split(' '), l = es.length, i = 0, name, indx
    for (; i < l; i++) {
      name = es[i]
      indx = name.indexOf('.')
      if (name) fn( ~indx ? name.substring(0, indx) : name, i, ~indx ? name.slice(indx + 1) : null)
    }
  }

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(events, fn) {
        if (typeof fn != 'function')  return el

        onEachEvent(events, function(name, pos, ns) {
          (callbacks[name] = callbacks[name] || []).push(fn)
          fn.typed = pos > 0
          fn.ns = ns
        })

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given space separated list of `events` listeners
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(events, fn) {
        if (events == '*' && !fn) callbacks = {}
        else {
          onEachEvent(events, function(name, pos, ns) {
            if (fn || ns) {
              var arr = callbacks[name]
              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                if (cb == fn || ns && cb.ns == ns) arr.splice(i--, 1)
              }
            } else delete callbacks[name]
          })
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` at most once
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(events, fn) {
        function on() {
          el.off(events, on)
          fn.apply(el, arguments)
        }
        return el.on(events, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given space separated list of `events`
     * @param   { String } events - events ids
     * @returns { Object } el
     */
    trigger: {
      value: function(events) {

        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns

        for (var i = 0; i < arglen; i++) {
          args[i] = arguments[i + 1] // skip first argument
        }

        onEachEvent(events, function(name, pos, ns) {

          fns = slice.call(callbacks[name] || [], 0)

          for (var i = 0, fn; fn = fns[i]; ++i) {
            if (fn.busy) continue
            fn.busy = 1
            if (!ns || fn.ns == ns) fn.apply(el, fn.typed ? [name].concat(args) : args)
            if (fns[i] !== fn) { i-- }
            fn.busy = 0
          }

          if (callbacks['*'] && name != '*')
            el.trigger.apply(el, ['*', name].concat(args))

        })

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  })

  return el

}
  /* istanbul ignore next */
  // support CommonJS, AMD & browser
  if (typeof exports === 'object')
    module.exports = observable
  else if (typeof define === 'function' && define.amd)
    define(function() { return observable })
  else
    window.observable = observable

})(typeof window != 'undefined' ? window : undefined);
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.Default = Default;
exports.Trigger = Trigger;
exports.On = On;
exports.Peel = Peel;
var TYPE_VAR = 'var';
var TYPE_FN = 'fn';

function Default(v) {
    return function (target, name, descriptor) {
        decorate(descriptor, {
            'default': v
        }, TYPE_VAR);
    };
}

function Trigger() {
    var ev = arguments.length <= 0 || arguments[0] === undefined ? 'updated' : arguments[0];

    return function (target, name, descriptor) {
        var old = descriptor.value;
        descriptor.value = function () {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var r = old.call.apply(old, [this].concat(args));
            if (r && r.then) {
                r.then(function () {
                    return _this.trigger(ev);
                });
            } else {
                this.trigger(ev);
            }
            return r;
        };
    };
}

function On(event) {
    return function (target, name, descriptor) {
        var c = target._onTriggerEventHandlers = target._onTriggerEventHandlers || {};
        var o = c[event] = c[event] || [];
        o.push(name);
    };
}

function Peel() {
    for (var _len2 = arguments.length, peelList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        peelList[_key2] = arguments[_key2];
    }

    return function (target, name, descriptor) {
        var old = descriptor.value;
        descriptor.value = function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            args.forEach(function (arg, i) {
                if (peelList[i] === null) {
                    args[i] = null;
                } else if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && peelList[i]) {
                    try {
                        (function () {
                            var r = arg;
                            var str = peelList[i].split('->');
                            str.forEach(function (x) {
                                return r = r[x];
                            });
                            if (r === undefined) throw 'e';
                            args[i] = r;
                        })();
                    } catch (e) {}
                }
            });
            return old.call.apply(old, [this].concat(args));
        };

        decorate(descriptor, {
            peel: {
                list: peelList,
                fn: descriptor.value.toString()
            }
        }, TYPE_FN);
    };
}

function decorate(descriptor, value) {
    var type = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (descriptor.set) {
        throw 'You tried to apply a decorator to a setter which is not allowed.';
    } else if (type === TYPE_FN && descriptor.get) {
        throw 'Tried to use a decorator on a getter which is only allowed on function types.';
    } else if (type === TYPE_VAR && descriptor.value) {
        throw 'Tried to use a decorator on a function which is only allowed on getters.';
    }

    var decorators = void 0;

    if (descriptor.get) {
        decorators = descriptor.get.decorators = descriptor.get.decorators || {};
    } else {
        decorators = descriptor.value.decorators = descriptor.value.decorators || {};
    }
    _extends(decorators, value);
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Worker = require('./Worker.es6');

var _Worker2 = _interopRequireDefault(_Worker);

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelAbstract = function () {
    _createClass(ModelAbstract, [{
        key: 'modelData',
        set: function set(o) {
            this._data = o;
        },
        get: function get() {
            return this._data || {};
        }
    }]);

    function ModelAbstract() {
        var _this = this;

        _classCallCheck(this, ModelAbstract);

        (0, _riotObservable2.default)(this);
        this.on('*', function (name, data) {
            var onTriggers = _this._onTriggerEventHandlers ? _this._onTriggerEventHandlers[name] : false;
            var promises = [];
            onTriggers && onTriggers.forEach(function (method) {
                var p = _this[method].call(_this, name, data);
                p.then && promises.push(p);
            });

            if (promises.length) {
                Promise.all(promises).then(function () {
                    _this.broadcast(name, data, false);
                });
            } else {
                _this.broadcast(name, data);
            }
        });
    }

    _createClass(ModelAbstract, [{
        key: 'broadcast',
        value: function broadcast(name) {
            var data = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
            var soft = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            _Worker2.default.Resolve('ChambrClient->' + this.constructor.name + '->Event', -1, this.modelData, _Worker2.default.Export(this), data, soft, name);
        }
    }, {
        key: 'resolve',
        value: function resolve() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
            var soft = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var state = arguments.length <= 2 || arguments[2] === undefined ? 'resolve' : arguments[2];

            return Promise.resolve({ data: data, soft: soft, state: state });
        }
    }, {
        key: 'reject',
        value: function reject() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
            var soft = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
            var state = arguments.length <= 2 || arguments[2] === undefined ? 'reject' : arguments[2];

            return Promise.reject({ data: data, soft: soft, state: state });
        }
    }]);

    return ModelAbstract;
}();

exports.default = ModelAbstract;

},{"./Worker.es6":5,"riot-observable":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ModelAbstract = require('./ModelAbstract.es6');

var _ModelAbstract2 = _interopRequireDefault(_ModelAbstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MODEL_LIBRARY = {};
var MODEL_INSTANCES = {};

/** @type {Highway} */
var HW = undefined;

var Chambr = function () {

    /**
     * 
        * @param HighwayInstance {Highway}
        */

    function Chambr(HighwayInstance) {
        _classCallCheck(this, Chambr);

        HW = HighwayInstance;
        HW.sub('ChambrWorker', function (ChambrEvent) {
            var ev = ChambrEvent.data;
            var route = ChambrEvent.name.split('->');
            var argList = Object.values(ev.argList);
            var isConstructor = route[2] === 'constructor';
            var model = Chambr.getModel(route[1], isConstructor ? argList : undefined);
            var method = model ? model[route[2]] : false;
            var responseEventName = ChambrEvent.name.replace('ChambrWorker', 'ChambrClient');
            if (method) {
                if (isConstructor) {
                    Chambr.Resolve(responseEventName, ev.requestId, model.modelData, {}, {}, true);
                    return;
                }
                var r = method.apply(model, argList);
                try {
                    r.then(function (o) {
                        return Chambr.Resolve(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state);
                    }).catch(function (o) {
                        return Chambr.Reject(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state);
                    });
                } catch (e) {
                    Chambr.Resolve(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), r, true);
                }
            }
        });
    }

    /** @returns {ModelAbstract} */


    _createClass(Chambr, null, [{
        key: 'getModel',
        value: function getModel(modelName) {
            var argList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            var model = MODEL_INSTANCES[modelName];
            if (!model) {
                model = MODEL_INSTANCES[modelName] = new (Function.prototype.bind.apply(MODEL_LIBRARY[modelName], [null].concat(_toConsumableArray(argList))))();
            }
            return model;
        }
    }, {
        key: 'Resolve',
        value: function Resolve(eventName, responseId, modelData, modelExport, responseData, responseSoft) {
            var responseState = arguments.length <= 6 || arguments[6] === undefined ? 'resolve' : arguments[6];

            HW.pub(eventName, {
                responseId: responseId,
                responseData: responseData,
                responseSoft: responseSoft,
                responseState: responseState,
                modelData: modelData,
                modelExport: modelExport
            }, 'resolve');
        }
    }, {
        key: 'Reject',
        value: function Reject(eventName, responseId, modelData, modelExport, responseData, responseSoft) {
            var responseState = arguments.length <= 6 || arguments[6] === undefined ? 'reject' : arguments[6];

            HW.pub(eventName, {
                responseId: responseId,
                responseData: responseData,
                responseSoft: responseSoft,
                responseState: responseState,
                modelData: modelData,
                modelExport: modelExport
            }, 'reject');
        }
    }, {
        key: 'Export',
        value: function Export(model) {
            var results = {};
            model._exposedApi.forEach(function (apiData) {
                apiData.type === 'var' && (results[apiData.name] = model[apiData.name]);
            });
            return results;
        }
    }, {
        key: 'Model',
        get: function get() {
            return _ModelAbstract2.default;
        }

        /**
         * @param model {ModelAbstract}
         */
        ,
        set: function set(model) {
            var api = [];
            var tmpModel = model.prototype;
            var modelName = extractFunctionName(model);
            MODEL_LIBRARY[modelName] = model;

            do {
                Object.getOwnPropertyNames(tmpModel).forEach(function (prop) {
                    if (api.findIndex(function (v) {
                        return v.name === prop;
                    }) === -1 && prop !== 'constructor' && prop.charAt(0) !== '_') {
                        var descriptor = Object.getOwnPropertyDescriptor(tmpModel, prop);

                        api.push({
                            name: prop,
                            type: descriptor.get ? 'var' : 'fn',
                            decorators: descriptor.get ? descriptor.get.decorators : descriptor.value.decorators
                        });
                    }
                });

                tmpModel = tmpModel.__proto__;

                if (tmpModel && tmpModel.constructor && extractFunctionName(tmpModel.constructor) !== 'ModelAbstract' && extractFunctionName(tmpModel.constructor) !== 'Object') {} else {
                    tmpModel = false;
                }
            } while (tmpModel);

            model.prototype._exposedApi = api;

            HW.pub('ChambrClient->Expose', {
                modelName: modelName,
                modelApi: api
            });
        }
    }]);

    return Chambr;
}();

exports.default = Chambr;


function extractFunctionName(fn) {
    return fn.toString().match(/function\W+([\w$_]+?)\(/)[1];
}

},{"./ModelAbstract.es6":4}],6:[function(require,module,exports){
'use strict';

var _Highway = require('Highway');

var _Highway2 = _interopRequireDefault(_Highway);

var _Worker = require('../src/Worker.es6');

var _Worker2 = _interopRequireDefault(_Worker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

self.HW = self.HW || new _Highway2.default(self);
self.CH = new _Worker2.default(self.HW);

},{"../src/Worker.es6":5,"Highway":1}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _desc, _value, _class;

var _Worker = require('../src/Worker.es6');

var _Worker2 = _interopRequireDefault(_Worker);

var _Decorators = require('../src/Decorators.es6');

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

//import LocalStorage from '../src/Adapter/LocalStorage.es6'

/**
 * @extends ModelAbstract
 */
var Test = (_dec = (0, _Decorators.Default)(-1), _dec2 = (0, _Decorators.Peel)('item->value'), _dec3 = (0, _Decorators.Trigger)('customEvent'), _dec4 = (0, _Decorators.On)('remoteUpdated'), (_class = function (_Chambr$Model) {
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

		//let x = new LocalStorage(this, 'main/hula')
		//x.set('kula/hula/suna/hajjaj', 'cunci')
		//x.set('kula/hula/suna/cullon', 'callop')
		//console.log(x.get('kula/hula'))
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

},{"../src/Decorators.es6":3,"../src/Worker.es6":5}],8:[function(require,module,exports){
'use strict';

require('./InitChambrWorker.es6');

require('./Test.Model.es6');

//import 'babel-polyfill'


console.info('Worker engine started.');

self.HW.pub('Worker->Ready');

},{"./InitChambrWorker.es6":6,"./Test.Model.es6":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXNcXEhpZ2h3YXlcXGRpc3RcXG5vZGVfbW9kdWxlc1xcSGlnaHdheVxcZGlzdFxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXNcXEhpZ2h3YXlcXGRpc3RcXG5vZGVfbW9kdWxlc1xcSGlnaHdheVxcZGlzdFxcc3JjXFxIaWdod2F5LmVzNiIsIm5vZGVfbW9kdWxlcy9yaW90LW9ic2VydmFibGUvZGlzdC9vYnNlcnZhYmxlLmpzIiwic3JjXFxEZWNvcmF0b3JzLmVzNiIsInNyY1xcTW9kZWxBYnN0cmFjdC5lczYiLCJzcmNcXFdvcmtlci5lczYiLCJ0ZXN0XFxJbml0Q2hhbWJyV29ya2VyLmVzNiIsInRlc3RcXFRlc3QuTW9kZWwuZXM2IiwidGVzdFxcVGVzdC5Xb3JrZXIuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFNLFlBQVksSUFBWjs7Ozs7O0FBTU4sSUFBTSxpQkFBaUI7QUFDdEIsTUFBSztBQUNKLFlBQVUsRUFBVjtFQUREO0NBREs7Ozs7OztBQVVOLElBQU0sYUFBYSxXQUFiOzs7Ozs7SUFLZTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCcEIsVUFsQm9CLE9Ba0JwQixHQUF5QjtNQUFiLDZEQUFPLG9CQUFNOzt3QkFsQkwsU0FrQks7O0FBQ3hCLE9BQUssSUFBTCxHQUFZLElBQVosQ0FEd0I7QUFFeEIsT0FBSyxLQUFMLEdBRndCO0FBR3hCLE9BQUssS0FBTCxHQUh3QjtFQUF6Qjs7Ozs7Ozs7Ozs7Y0FsQm9COztzQkErQmhCLE1BQTJDO09BQXJDLDZEQUFPLHlCQUE4QjtPQUFuQiw4REFBUSx5QkFBVzs7QUFDOUMsUUFBSyxJQUFMLENBQVUsV0FBVixD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QUFMLENBQWUsTUFBZixDQUFzQixLQUF0QixFQUE2QixDQUE3QixDQUFiLENBQVA7QUFDQTs7O2tDQUVjO0FBQ2QsUUFBSyxPQUFMLENBQWEsZUFBYjtBQUNBOzs7b0NBR2dCO0FBQ2hCLFVBQU8sS0FBSyxPQUFMLEVBQVA7QUFDQTs7O2lDQUVhLENBRWI7OztRQWpESSxJO0VBQWEsaUJBQU8sSzs7SUFvRHBCLFk7V0FBQSxZOztVQUFBLFk7d0JBQUEsWTs7Z0VBQUEsWTs7O2NBQUEsWTs7NkJBQ0ssQ0FBRTs7O1FBRFAsWTtFQUFxQixJOztBQUkzQixpQkFBTyxLQUFQLEdBQWUsSUFBZjtBQUNBLGlCQUFPLEtBQVAsR0FBZSxZQUFmOzs7OztBQy9EQTs7QUFDQTs7Ozs7QUFFQSxRQUFRLElBQVIsQ0FBYSx3QkFBYjs7QUFFQSxLQUFLLEVBQUwsQ0FBUSxHQUFSLENBQVksZUFBWiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogRGVsaW1pdGVyIHRvIHNwbGl0IGV2ZW50IHJvdXRlc1xuICogQHR5cGUge3N0cmluZ31cbiAqL1xuY29uc3QgREVMSU1JVEVSID0gJy0+J1xuXG4vKipcbiAqIERlZmF1bHQgYnVja2V0IHByb3RvdHlwZVxuICogQHR5cGUge3sqOiB7aGFuZGxlcnM6IEFycmF5fX19XG4gKi9cbmNvbnN0IERFRkFVTFRfQlVDS0VUID0ge1xuXHQnKic6IHtcblx0XHRoYW5kbGVyczogW11cblx0fVxufVxuXG4vKipcbiAqICdleGUnIG1ldGhvZCBldmVudCBuYW1lXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG5jb25zdCBFVl9FWEVDVVRFID0gJ0hXRVhFQ1VURSdcblxuLyoqXG4gKiBNYWluIEhpZ2h3YXkgSlMgY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlnaHdheSB7XG5cblx0LyoqXG5cdCAqIEhvc3Qgb2JqZWN0XG5cdCAqIEBzdGF0aWNcblx0ICovXG5cdEhvc3RcblxuXHQvKipcblx0ICogQnVja2V0IHRvIHN0b3JlIGhhbmRsZXJzXG5cdCAqIEB0eXBlIHt7Kjoge2hhbmRsZXJzOiBBcnJheX19fVxuXHQgKi9cblx0QnVja2V0XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0gSG9zdCB7V2luZG93IHx8IFdvcmtlcn1cblx0ICovXG5cdGNvbnN0cnVjdG9yKEhvc3QgPSBzZWxmKSB7XG5cdFx0dGhpcy5Ib3N0ID0gSG9zdFxuXHRcdHRoaXMucmVzZXQoKVxuXHRcdHRoaXMuX2JpbmQoKVxuXHR9XG5cblx0LyoqXG5cdCAqIFB1Ymxpc2ggYW4gZXZlbnRcblx0ICogQHBhcmFtIG5hbWUgIHtTdHJpbmd9IFRoZSBldmVudCdzIG5hbWVcblx0ICogQHBhcmFtIGRhdGEgIFtNaXhlZF0gIEN1c3RvbSBldmVudCBkYXRhXG5cdCAqIEBwYXJhbSBzdGF0ZSBbU3RyaW5nXSBPcHRpb25hbCBzdGF0ZSBpZGVudGlmaWVyXG5cdCAqIEByZXR1cm5zIHtIaWdod2F5fVxuXHQgKi9cblx0cHViKG5hbWUsIGRhdGEgPSB1bmRlZmluZWQsIHN0YXRlID0gdW5kZWZpbmVkKSB7XG5cdFx0dGhpcy5Ib3N0LnBvc3RNZXNzYWdlKFxuXHRcdFx0e25hbWUsIGRhdGEsIHN0YXRlfSxcblx0XHRcdHRoaXMuSG9zdCA9PT0gc2VsZi53aW5kb3cgPyBzZWxmLmxvY2F0aW9uLm9yaWdpbiA6IHVuZGVmaW5lZFxuXHRcdClcblx0XHRyZXR1cm4gdGhpc1xuXHR9XG5cblx0LyoqXG5cdCAqIFN1YnNjcmliZSB0byBhbiBldmVudFxuXHQgKiBAcGFyYW0gbmFtZSAgICB7U3RyaW5nfSAgIFRoZSBldmVudCdzIG5hbWVcblx0ICogQHBhcmFtIGhhbmRsZXIge0Z1bmN0aW9ufSBDYWxsYmFjayBmdW5jdGlvblxuXHQgKiBAcGFyYW0gb25lICAgICB7Qm9vbGVhbn0gIFJ1biBvbmNlLCB0aGVuIG9mZj9cblx0ICogQHJldHVybnMge0hpZ2h3YXl9XG5cdCAqL1xuXHRzdWIobmFtZSwgaGFuZGxlciwgb25lID0gZmFsc2UpIHtcblx0XHQvLyBBcHBseSBvbmUgcHJvcFxuXHRcdGhhbmRsZXIub25lID0gb25lXG5cblx0XHQvLyBBcHBseSBzZWdtZW50cyBhbmQgcHJvdG90eXBlXG5cdFx0bGV0IHRlbXAgPSB0aGlzLkJ1Y2tldFxuXHRcdG5hbWUuc3BsaXQoREVMSU1JVEVSKS5mb3JFYWNoKChrLCBpLCBhKSA9PiB7XG5cdFx0XHRpZiAoIXRlbXAuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0dGVtcFtrXSA9IHtcblx0XHRcdFx0XHRoYW5kbGVyczogW11cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGVtcCA9IHRlbXBba107XG5cdFx0XHQrK2kgPT09IGEubGVuZ3RoICYmIHRlbXAuaGFuZGxlcnMucHVzaChoYW5kbGVyKVxuXHRcdH0pXG5cblx0XHQvLyBNYWtlIGl0IGNoYWluYWJsZVxuXHRcdHJldHVybiB0aGlzXG5cdH1cblxuXHQvKipcblx0ICogU2hvcnRoYW5kIHRvIHN1YnNjcmliZSBvbmNlXG5cdCAqIEBwYXJhbSAgIC4uLmEgPSB0aGlzLnN1YiBhcmdzXG5cdCAqIEByZXR1cm5zIHtIaWdod2F5fVxuXHQgKi9cblx0b25lKC4uLmEpe1xuXHRcdHRoaXMuc3ViKC4uLmEsIHRydWUpXG5cdFx0cmV0dXJuIHRoaXNcblx0fVxuXG5cdC8qKlxuXHQgKiBVbnN1YnNjcmliZSBmcm9tIGFuIGV2ZW50XG5cdCAqIEBwYXJhbSAgIG5hbWUgICAgICB7U3RyaW5nfSBOYW1lIG9mIHRoZSBldmVudFxuXHQgKiBAcGFyYW0gICBoYW5kbGVyICAge0Z1bmN0aW9ufHVuZGVmaW5lZHxCb29sZWFufSBIYW5kbGVyIHRvIHJlbW92ZSB8IFJlbW92ZSBhbGwgZm9yIHRoaXMgZXZlbnQgbmFtZSB8IHRydWU6IERlZXAgcmVtb3ZlXG5cdCAqIEByZXR1cm5zIHtIaWdod2F5fVxuXHQgKi9cblx0b2ZmKG5hbWUsIGhhbmRsZXIgPSB1bmRlZmluZWQpIHtcblx0XHRsZXQgdGVtcCA9IHRoaXMuQnVja2V0XG5cblx0XHRuYW1lLnNwbGl0KERFTElNSVRFUikuZm9yRWFjaCgoaywgaSwgYSkgPT4ge1xuXHRcdFx0aWYgKHRlbXAuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0aWYgKGhhbmRsZXIgPT09IHRydWUgJiYgayA9PT0gYVthLmxlbmd0aC0xXSkge1xuXHRcdFx0XHRcdGRlbGV0ZSB0ZW1wW2tdXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGVtcCA9IHRlbXBba107XG5cdFx0XHRcdFx0dGVtcC5oYW5kbGVycyA9IHRlbXAuaGFuZGxlcnMuZmlsdGVyKChmbikgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuICEoZm4gPT09IGhhbmRsZXIgfHwgaGFuZGxlciA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBhIGZ1bmN0aW9uIG9uIHRoZSBvdGhlciBzaWRlLlxuXHQgKiBAcGFyYW0gZm4ge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZS5cblx0ICovXG5cdGV4ZShmbil7XG5cdFx0dGhpcy5wdWIoRVZfRVhFQ1VURSwgZm4udG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25bXntdK1xceyhbXFxzXFxTXSopfSQvKVsxXSlcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXN0cm95IHRoZSBmdWxsIEhpZ2h3YXkgaW5zdGFuY2Vcblx0ICovXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy5Ib3N0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCA6OnRoaXMuX2hhbmRsZXIpXG5cdFx0ZGVsZXRlIHRoaXMuQnVja2V0XG5cdH1cblxuXHQvKipcblx0ICogUmVzZXRzIEJ1Y2tldCB0byBkZWZhdWx0XG5cdCAqL1xuXHRyZXNldCgpe1xuXHRcdERFRkFVTFRfQlVDS0VUWycqJ10uaGFuZGxlcnMgPSBbXVxuXHRcdHRoaXMuQnVja2V0ID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9CVUNLRVQpXG5cdH1cblxuXHQvKipcblx0ICogQWRkIG1lc3NhZ2UgbGlzdGVuZXIgdG8gdGhlIGhvc3Rcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9iaW5kKCkge1xuXHRcdHRoaXMuSG9zdC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgOjp0aGlzLl9oYW5kbGVyKVxuXHRcdHRoaXMuc3ViKEVWX0VYRUNVVEUsIGZ1bmN0aW9uKGV2KXtcblx0XHRcdChuZXcgRnVuY3Rpb24oZXYuZGF0YSkpLmNhbGwoc2VsZilcblx0XHR9KVxuXHR9XG5cblx0LyoqXG5cdCAqIG9uTWVzc2FnZSBjYWxsYmFjayBoYW5kbGVyXG5cdCAqIEBwYXJhbSBldiB7V29ya2VyRXZlbnR9XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfaGFuZGxlcihldikge1xuXHRcdGxldCBwYXJzZWQgPSB0aGlzLkJ1Y2tldFxuXHRcdGxldCBub3BlID0gZmFsc2VcblxuXHRcdHBhcnNlZFsnKiddLmhhbmRsZXJzLmZvckVhY2goKGZuKSA9PiBmbi5jYWxsKG51bGwsIGV2LmRhdGEpKVxuXHRcdGV2LmRhdGEubmFtZS5zcGxpdChERUxJTUlURVIpLmZvckVhY2goKHNlZ21lbnQpID0+IHtcblx0XHRcdGlmICghbm9wZSAmJiBwYXJzZWQuaGFzT3duUHJvcGVydHkoc2VnbWVudCkpIHtcblx0XHRcdFx0cGFyc2VkID0gcGFyc2VkW3NlZ21lbnRdXG5cblx0XHRcdFx0cGFyc2VkLmhhbmRsZXJzLmxlbmd0aFxuXHRcdFx0XHQmJiBwYXJzZWQuaGFuZGxlcnMuZm9yRWFjaCgoZm4sIGksIGFycikgPT4ge1xuXHRcdFx0XHRcdGZuLmNhbGwobnVsbCwgZXYuZGF0YSlcblx0XHRcdFx0XHRmbi5vbmUgJiYgYXJyLnNwbGljZShpLCAxKVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG5vcGUgPSB0cnVlXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSIsIjsoZnVuY3Rpb24od2luZG93LCB1bmRlZmluZWQpIHt2YXIgb2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgLyoqXG4gICAqIEV4dGVuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IG9yIGNyZWF0ZSBhIG5ldyBlbXB0eSBvbmVcbiAgICogQHR5cGUgeyBPYmplY3QgfVxuICAgKi9cblxuICBlbCA9IGVsIHx8IHt9XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgdmFyaWFibGVzXG4gICAqL1xuICB2YXIgY2FsbGJhY2tzID0ge30sXG4gICAgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcblxuICAvKipcbiAgICogUHJpdmF0ZSBNZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gbmVlZGVkIHRvIGdldCBhbmQgbG9vcCBhbGwgdGhlIGV2ZW50cyBpbiBhIHN0cmluZ1xuICAgKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgZSAtIGV2ZW50IHN0cmluZ1xuICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICAgZm4gLSBjYWxsYmFja1xuICAgKi9cbiAgZnVuY3Rpb24gb25FYWNoRXZlbnQoZSwgZm4pIHtcbiAgICB2YXIgZXMgPSBlLnNwbGl0KCcgJyksIGwgPSBlcy5sZW5ndGgsIGkgPSAwLCBuYW1lLCBpbmR4XG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5hbWUgPSBlc1tpXVxuICAgICAgaW5keCA9IG5hbWUuaW5kZXhPZignLicpXG4gICAgICBpZiAobmFtZSkgZm4oIH5pbmR4ID8gbmFtZS5zdWJzdHJpbmcoMCwgaW5keCkgOiBuYW1lLCBpLCB+aW5keCA/IG5hbWUuc2xpY2UoaW5keCArIDEpIDogbnVsbClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIEFwaVxuICAgKi9cblxuICAvLyBleHRlbmQgdGhlIGVsIG9iamVjdCBhZGRpbmcgdGhlIG9ic2VydmFibGUgbWV0aG9kc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlbCwge1xuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kXG4gICAgICogZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBlYWNoIHRpbWUgYW4gZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgICAqIEBwYXJhbSAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvbjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiAhPSAnZnVuY3Rpb24nKSAgcmV0dXJuIGVsXG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MsIG5zKSB7XG4gICAgICAgICAgKGNhbGxiYWNrc1tuYW1lXSA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXSkucHVzaChmbilcbiAgICAgICAgICBmbi50eXBlZCA9IHBvcyA+IDBcbiAgICAgICAgICBmbi5ucyA9IG5zXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9mZjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PSAnKicgJiYgIWZuKSBjYWxsYmFja3MgPSB7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcywgbnMpIHtcbiAgICAgICAgICAgIGlmIChmbiB8fCBucykge1xuICAgICAgICAgICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2IgPT0gZm4gfHwgbnMgJiYgY2IubnMgPT0gbnMpIGFyci5zcGxpY2UoaS0tLCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgZGVsZXRlIGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kXG4gICAgICogZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBhdCBtb3N0IG9uY2VcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvbmU6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uKCkge1xuICAgICAgICAgIGVsLm9mZihldmVudHMsIG9uKVxuICAgICAgICAgIGZuLmFwcGx5KGVsLCBhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsLm9uKGV2ZW50cywgb24pXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYWxsIGNhbGxiYWNrIGZ1bmN0aW9ucyB0aGF0IGxpc3RlbiB0b1xuICAgICAqIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYFxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICB0cmlnZ2VyOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzKSB7XG5cbiAgICAgICAgLy8gZ2V0dGluZyB0aGUgYXJndW1lbnRzXG4gICAgICAgIHZhciBhcmdsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMSxcbiAgICAgICAgICBhcmdzID0gbmV3IEFycmF5KGFyZ2xlbiksXG4gICAgICAgICAgZm5zXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdsZW47IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdIC8vIHNraXAgZmlyc3QgYXJndW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zLCBucykge1xuXG4gICAgICAgICAgZm5zID0gc2xpY2UuY2FsbChjYWxsYmFja3NbbmFtZV0gfHwgW10sIDApXG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgZm47IGZuID0gZm5zW2ldOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChmbi5idXN5KSBjb250aW51ZVxuICAgICAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgICAgIGlmICghbnMgfHwgZm4ubnMgPT0gbnMpIGZuLmFwcGx5KGVsLCBmbi50eXBlZCA/IFtuYW1lXS5jb25jYXQoYXJncykgOiBhcmdzKVxuICAgICAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgICAgIGZuLmJ1c3kgPSAwXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrc1snKiddICYmIG5hbWUgIT0gJyonKVxuICAgICAgICAgICAgZWwudHJpZ2dlci5hcHBseShlbCwgWycqJywgbmFtZV0uY29uY2F0KGFyZ3MpKVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBlbFxuXG59XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgICBtb2R1bGUuZXhwb3J0cyA9IG9ic2VydmFibGVcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIG9ic2VydmFibGUgfSlcbiAgZWxzZVxuICAgIHdpbmRvdy5vYnNlcnZhYmxlID0gb2JzZXJ2YWJsZVxuXG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkKTsiLCJjb25zdCBUWVBFX1ZBUiA9ICd2YXInXG5jb25zdCBUWVBFX0ZOID0gJ2ZuJ1xuXG5leHBvcnQgZnVuY3Rpb24gRGVmYXVsdCh2KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKXtcbiAgICAgICAgZGVjb3JhdGUoZGVzY3JpcHRvciwge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiB2XG4gICAgICAgIH0sIFRZUEVfVkFSKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRyaWdnZXIoZXYgPSAndXBkYXRlZCcpe1xuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3Ipe1xuICAgICAgICB2YXIgb2xkID0gZGVzY3JpcHRvci52YWx1ZVxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICBsZXQgciA9IG9sZC5jYWxsKHRoaXMsIC4uLmFyZ3MpXG4gICAgICAgICAgICBpZiAociAmJiByLnRoZW4pIHtcbiAgICAgICAgICAgICAgICByLnRoZW4oKCkgPT4gdGhpcy50cmlnZ2VyKGV2KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcihldilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBPbihldmVudCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIGxldCBjID0gdGFyZ2V0Ll9vblRyaWdnZXJFdmVudEhhbmRsZXJzID0gdGFyZ2V0Ll9vblRyaWdnZXJFdmVudEhhbmRsZXJzIHx8IHt9XG4gICAgICAgIGxldCBvID0gY1tldmVudF0gPSBjW2V2ZW50XSB8fCBbXVxuICAgICAgICBvLnB1c2gobmFtZSlcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQZWVsKC4uLnBlZWxMaXN0KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKXtcbiAgICAgICAgdmFyIG9sZCA9IGRlc2NyaXB0b3IudmFsdWVcbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgYXJncy5mb3JFYWNoKChhcmcsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVlbExpc3RbaV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgcGVlbExpc3RbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gYXJnXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gcGVlbExpc3RbaV0uc3BsaXQoJy0+JylcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ci5mb3JFYWNoKHggPT4gciA9IHJbeF0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAociA9PT0gdW5kZWZpbmVkKSB0aHJvdyAnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSByXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2goZSl7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gb2xkLmNhbGwodGhpcywgLi4uYXJncylcbiAgICAgICAgfVxuXG4gICAgICAgIGRlY29yYXRlKGRlc2NyaXB0b3IsIHtcbiAgICAgICAgICAgIHBlZWw6IHtcbiAgICAgICAgICAgICAgICBsaXN0OiBwZWVsTGlzdCxcbiAgICAgICAgICAgICAgICBmbjogZGVzY3JpcHRvci52YWx1ZS50b1N0cmluZygpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIFRZUEVfRk4pXG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZWNvcmF0ZShkZXNjcmlwdG9yLCB2YWx1ZSwgdHlwZSA9IGZhbHNlKXtcbiAgICBpZiAoZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgICAgdGhyb3coJ1lvdSB0cmllZCB0byBhcHBseSBhIGRlY29yYXRvciB0byBhIHNldHRlciB3aGljaCBpcyBub3QgYWxsb3dlZC4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9GTiAmJiBkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICB0aHJvdygnVHJpZWQgdG8gdXNlIGEgZGVjb3JhdG9yIG9uIGEgZ2V0dGVyIHdoaWNoIGlzIG9ubHkgYWxsb3dlZCBvbiBmdW5jdGlvbiB0eXBlcy4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9WQVIgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuICAgICAgICB0aHJvdygnVHJpZWQgdG8gdXNlIGEgZGVjb3JhdG9yIG9uIGEgZnVuY3Rpb24gd2hpY2ggaXMgb25seSBhbGxvd2VkIG9uIGdldHRlcnMuJyk7XG4gICAgfVxuXG4gICAgbGV0IGRlY29yYXRvcnNcblxuICAgIGlmIChkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICBkZWNvcmF0b3JzID0gZGVzY3JpcHRvci5nZXQuZGVjb3JhdG9ycyA9IGRlc2NyaXB0b3IuZ2V0LmRlY29yYXRvcnMgfHwge31cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnMgfHwge31cbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbihkZWNvcmF0b3JzLCB2YWx1ZSlcbn0iLCJpbXBvcnQgQ2hhbWJyIGZyb20gJy4vV29ya2VyLmVzNidcbmltcG9ydCBPYnNlcnZhYmxlIGZyb20gJ3Jpb3Qtb2JzZXJ2YWJsZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZWxBYnN0cmFjdCB7XG5cbiAgICBzZXQgbW9kZWxEYXRhKG8pe1xuICAgICAgICB0aGlzLl9kYXRhID0gb1xuICAgIH1cblxuICAgIGdldCBtb2RlbERhdGEoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEgfHwge31cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBPYnNlcnZhYmxlKHRoaXMpXG4gICAgICAgIHRoaXMub24oJyonLCAobmFtZSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgbGV0IG9uVHJpZ2dlcnMgPSB0aGlzLl9vblRyaWdnZXJFdmVudEhhbmRsZXJzID8gdGhpcy5fb25UcmlnZ2VyRXZlbnRIYW5kbGVyc1tuYW1lXSA6IGZhbHNlXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXVxuICAgICAgICAgICAgb25UcmlnZ2VycyAmJiBvblRyaWdnZXJzLmZvckVhY2gobWV0aG9kID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcCA9IHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIG5hbWUsIGRhdGEpXG4gICAgICAgICAgICAgICAgcC50aGVuICYmIHByb21pc2VzLnB1c2gocClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChwcm9taXNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0KG5hbWUsIGRhdGEsIGZhbHNlKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyb2FkY2FzdChuYW1lLCBkYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGJyb2FkY2FzdChuYW1lLCBkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gdHJ1ZSl7XG4gICAgICAgIENoYW1ici5SZXNvbHZlKGBDaGFtYnJDbGllbnQtPiR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfS0+RXZlbnRgLCAtMSwgdGhpcy5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQodGhpcyksIGRhdGEsIHNvZnQsIG5hbWUpXG4gICAgfVxuXG4gICAgcmVzb2x2ZShkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gZmFsc2UsIHN0YXRlID0gJ3Jlc29sdmUnKXtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7ZGF0YSwgc29mdCwgc3RhdGV9KVxuICAgIH1cblxuICAgIHJlamVjdChkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gdHJ1ZSwgc3RhdGUgPSAncmVqZWN0Jyl7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7ZGF0YSwgc29mdCwgc3RhdGV9KVxuICAgIH1cblxufSIsImltcG9ydCBNb2RlbEFic3RyYWN0IGZyb20gJy4vTW9kZWxBYnN0cmFjdC5lczYnXG5cbmNvbnN0IE1PREVMX0xJQlJBUlkgPSB7fVxuY29uc3QgTU9ERUxfSU5TVEFOQ0VTID0ge31cblxuLyoqIEB0eXBlIHtIaWdod2F5fSAqL1xudmFyIEhXID0gdW5kZWZpbmVkXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW1iciB7XG5cblx0LyoqXG5cdCAqIFxuICAgICAqIEBwYXJhbSBIaWdod2F5SW5zdGFuY2Uge0hpZ2h3YXl9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoSGlnaHdheUluc3RhbmNlKXtcbiAgICAgICAgSFcgPSBIaWdod2F5SW5zdGFuY2VcbiAgICAgICAgSFcuc3ViKCdDaGFtYnJXb3JrZXInLCBmdW5jdGlvbihDaGFtYnJFdmVudCl7XG4gICAgICAgICAgICBsZXQgZXYgICAgICA9IENoYW1ickV2ZW50LmRhdGFcbiAgICAgICAgICAgIGxldCByb3V0ZSAgID0gQ2hhbWJyRXZlbnQubmFtZS5zcGxpdCgnLT4nKVxuICAgICAgICAgICAgbGV0IGFyZ0xpc3QgPSBPYmplY3QudmFsdWVzKGV2LmFyZ0xpc3QpXG4gICAgICAgICAgICBsZXQgaXNDb25zdHJ1Y3RvciA9IHJvdXRlWzJdID09PSAnY29uc3RydWN0b3InXG4gICAgICAgICAgICBsZXQgbW9kZWwgICA9IENoYW1ici5nZXRNb2RlbChyb3V0ZVsxXSwgaXNDb25zdHJ1Y3RvciA/IGFyZ0xpc3QgOiB1bmRlZmluZWQpXG4gICAgICAgICAgICBsZXQgbWV0aG9kICA9IG1vZGVsID8gbW9kZWxbcm91dGVbMl1dIDogZmFsc2VcbiAgICAgICAgICAgIGxldCByZXNwb25zZUV2ZW50TmFtZSA9IENoYW1ickV2ZW50Lm5hbWUucmVwbGFjZSgnQ2hhbWJyV29ya2VyJywgJ0NoYW1ickNsaWVudCcpXG4gICAgICAgICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2hhbWJyLlJlc29sdmUocmVzcG9uc2VFdmVudE5hbWUsIGV2LnJlcXVlc3RJZCwgbW9kZWwubW9kZWxEYXRhLCB7fSwge30sIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgciA9IG1ldGhvZC5hcHBseShtb2RlbCwgYXJnTGlzdClcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByLnRoZW4obyA9PiBDaGFtYnIuUmVzb2x2ZShyZXNwb25zZUV2ZW50TmFtZSwgZXYucmVxdWVzdElkLCBtb2RlbC5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQobW9kZWwpLCBvLmRhdGEsIG8uc29mdCwgby5zdGF0ZSkpXG4gICAgICAgICAgICAgICAgICAgICAuY2F0Y2gobyA9PiBDaGFtYnIuUmVqZWN0KHJlc3BvbnNlRXZlbnROYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIG8uZGF0YSwgby5zb2Z0LCBvLnN0YXRlKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgIENoYW1ici5SZXNvbHZlKHJlc3BvbnNlRXZlbnROYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIHIsIHRydWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKiBAcmV0dXJucyB7TW9kZWxBYnN0cmFjdH0gKi9cbiAgICBzdGF0aWMgZ2V0IE1vZGVsKCl7XG4gICAgICAgIHJldHVybiBNb2RlbEFic3RyYWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG1vZGVsIHtNb2RlbEFic3RyYWN0fVxuICAgICAqL1xuICAgIHN0YXRpYyBzZXQgTW9kZWwobW9kZWwpIHtcbiAgICAgICAgbGV0IGFwaSA9IFtdXG4gICAgICAgIGxldCB0bXBNb2RlbCA9IG1vZGVsLnByb3RvdHlwZVxuICAgICAgICBsZXQgbW9kZWxOYW1lID0gZXh0cmFjdEZ1bmN0aW9uTmFtZShtb2RlbClcbiAgICAgICAgTU9ERUxfTElCUkFSWVttb2RlbE5hbWVdID0gbW9kZWxcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0bXBNb2RlbClcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuZmluZEluZGV4KHYgPT4gdi5uYW1lID09PSBwcm9wKSA9PT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHByb3AgIT09ICdjb25zdHJ1Y3RvcidcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHByb3AuY2hhckF0KDApICE9PSAnXydcbiAgICAgICAgICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0bXBNb2RlbCwgcHJvcClcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHByb3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVzY3JpcHRvci5nZXQgPyAndmFyJyA6ICdmbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdG9yczogZGVzY3JpcHRvci5nZXQgPyBkZXNjcmlwdG9yLmdldC5kZWNvcmF0b3JzIDogZGVzY3JpcHRvci52YWx1ZS5kZWNvcmF0b3JzXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdG1wTW9kZWwgPSB0bXBNb2RlbC5fX3Byb3RvX19cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRtcE1vZGVsXG4gICAgICAgICAgICAgICAgJiYgdG1wTW9kZWwuY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICAmJiBleHRyYWN0RnVuY3Rpb25OYW1lKHRtcE1vZGVsLmNvbnN0cnVjdG9yKSAhPT0gJ01vZGVsQWJzdHJhY3QnXG4gICAgICAgICAgICAgICAgJiYgZXh0cmFjdEZ1bmN0aW9uTmFtZSh0bXBNb2RlbC5jb25zdHJ1Y3RvcikgIT09ICdPYmplY3QnXG4gICAgICAgICAgICApIHt9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0bXBNb2RlbCA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKHRtcE1vZGVsKVxuXG4gICAgICAgIG1vZGVsLnByb3RvdHlwZS5fZXhwb3NlZEFwaSA9IGFwaVxuXG4gICAgICAgIEhXLnB1YignQ2hhbWJyQ2xpZW50LT5FeHBvc2UnLCB7XG4gICAgICAgICAgICBtb2RlbE5hbWU6IG1vZGVsTmFtZSxcbiAgICAgICAgICAgIG1vZGVsQXBpOiBhcGlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0TW9kZWwobW9kZWxOYW1lLCBhcmdMaXN0ID0gW10pe1xuICAgICAgICBsZXQgbW9kZWwgPSBNT0RFTF9JTlNUQU5DRVNbbW9kZWxOYW1lXVxuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICBtb2RlbCA9IE1PREVMX0lOU1RBTkNFU1ttb2RlbE5hbWVdID0gbmV3IE1PREVMX0xJQlJBUllbbW9kZWxOYW1lXSguLi5hcmdMaXN0KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2RlbFxuICAgIH1cblxuICAgIHN0YXRpYyBSZXNvbHZlKGV2ZW50TmFtZSwgcmVzcG9uc2VJZCwgbW9kZWxEYXRhLCBtb2RlbEV4cG9ydCwgcmVzcG9uc2VEYXRhLCByZXNwb25zZVNvZnQsIHJlc3BvbnNlU3RhdGUgPSAncmVzb2x2ZScpe1xuICAgICAgICBIVy5wdWIoZXZlbnROYW1lLCB7XG4gICAgICAgICAgICByZXNwb25zZUlkLFxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhLFxuICAgICAgICAgICAgcmVzcG9uc2VTb2Z0LFxuICAgICAgICAgICAgcmVzcG9uc2VTdGF0ZSxcbiAgICAgICAgICAgIG1vZGVsRGF0YSxcbiAgICAgICAgICAgIG1vZGVsRXhwb3J0XG4gICAgICAgIH0sICdyZXNvbHZlJylcbiAgICB9XG5cbiAgICBzdGF0aWMgUmVqZWN0KGV2ZW50TmFtZSwgcmVzcG9uc2VJZCwgbW9kZWxEYXRhLCBtb2RlbEV4cG9ydCwgcmVzcG9uc2VEYXRhLCByZXNwb25zZVNvZnQsIHJlc3BvbnNlU3RhdGUgPSAncmVqZWN0Jykge1xuICAgICAgICBIVy5wdWIoZXZlbnROYW1lLCB7XG4gICAgICAgICAgICByZXNwb25zZUlkLFxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhLFxuICAgICAgICAgICAgcmVzcG9uc2VTb2Z0LFxuICAgICAgICAgICAgcmVzcG9uc2VTdGF0ZSxcbiAgICAgICAgICAgIG1vZGVsRGF0YSxcbiAgICAgICAgICAgIG1vZGVsRXhwb3J0XG4gICAgICAgIH0sICdyZWplY3QnKVxuICAgIH1cblxuICAgIHN0YXRpYyBFeHBvcnQobW9kZWwpe1xuICAgICAgICBsZXQgcmVzdWx0cyA9IHt9XG4gICAgICAgIG1vZGVsLl9leHBvc2VkQXBpLmZvckVhY2goYXBpRGF0YSA9PiB7XG4gICAgICAgICAgICBhcGlEYXRhLnR5cGUgPT09ICd2YXInICYmIChyZXN1bHRzW2FwaURhdGEubmFtZV0gPSBtb2RlbFthcGlEYXRhLm5hbWVdKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZXh0cmFjdEZ1bmN0aW9uTmFtZShmbil7XG4gICAgcmV0dXJuIGZuLnRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFxXKyhbXFx3JF9dKz8pXFwoLylbMV1cbn1cbiIsImltcG9ydCBIaWdod2F5IGZyb20gJ0hpZ2h3YXknXG5pbXBvcnQgQ2hhbWJyIGZyb20gJy4uL3NyYy9Xb3JrZXIuZXM2J1xuXG5zZWxmLkhXID0gc2VsZi5IVyB8fCBuZXcgSGlnaHdheShzZWxmKVxuc2VsZi5DSCA9IG5ldyBDaGFtYnIoc2VsZi5IVykiLCJpbXBvcnQgQ2hhbWJyIGZyb20gJy4uL3NyYy9Xb3JrZXIuZXM2J1xuaW1wb3J0IHsgVHJpZ2dlciwgRGVmYXVsdCwgT24sIFBlZWwgfSBmcm9tICcuLi9zcmMvRGVjb3JhdG9ycy5lczYnXG4vL2ltcG9ydCBMb2NhbFN0b3JhZ2UgZnJvbSAnLi4vc3JjL0FkYXB0ZXIvTG9jYWxTdG9yYWdlLmVzNidcblxuLyoqXG4gKiBAZXh0ZW5kcyBNb2RlbEFic3RyYWN0XG4gKi9cbmNsYXNzIFRlc3QgZXh0ZW5kcyBDaGFtYnIuTW9kZWwge1xuXG5cdEBEZWZhdWx0KC0xKVxuXHRnZXQgdG90YWwoKXtcblx0XHRyZXR1cm4gdGhpcy5tb2RlbERhdGEubGVuZ3RoXG5cdH1cblx0XG5cdGNvbnN0cnVjdG9yKCl7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMubW9kZWxEYXRhID0gWydvbmUnLCAndHdvJ11cblxuXHRcdC8vbGV0IHggPSBuZXcgTG9jYWxTdG9yYWdlKHRoaXMsICdtYWluL2h1bGEnKVxuXHRcdC8veC5zZXQoJ2t1bGEvaHVsYS9zdW5hL2hhamphaicsICdjdW5jaScpXG5cdFx0Ly94LnNldCgna3VsYS9odWxhL3N1bmEvY3VsbG9uJywgJ2NhbGxvcCcpXG5cdFx0Ly9jb25zb2xlLmxvZyh4LmdldCgna3VsYS9odWxhJykpXG5cdH1cblxuXHRAUGVlbCgnaXRlbS0+dmFsdWUnKVxuXHRjcmVhdGUodmFsdWUpe1xuXHRcdHRoaXMubW9kZWxEYXRhLnB1c2godmFsdWUpXG5cdFx0XG5cdFx0cmV0dXJuIHRoaXMucmVzb2x2ZSh0aGlzLm1vZGVsRGF0YS5sZW5ndGgtMSlcblx0fVxuXG5cdHJlYWQoaW5kZXgpe1xuXHRcdHJldHVybiB0aGlzLm1vZGVsRGF0YVtpbmRleF1cblx0fVxuXG5cdHVwZGF0ZShpbmRleCwgdmFsdWUpe1xuXHRcdHRoaXMubW9kZWxEYXRhW2luZGV4XSA9IHZhbHVlXG5cdFx0cmV0dXJuIHRoaXMucmVzb2x2ZSh2YWx1ZSlcblx0fVxuXG5cdEBUcmlnZ2VyKCdjdXN0b21FdmVudCcpXG5cdGRlbGV0ZShpbmRleCl7XG5cdFx0cmV0dXJuIHRoaXMucmVzb2x2ZSh0aGlzLm1vZGVsRGF0YS5zcGxpY2UoaW5kZXgsIDEpKVxuXHR9XG5cblx0dHJpZ2dlck9uVGVzdCgpe1xuXHRcdHRoaXMudHJpZ2dlcigncmVtb3RlVXBkYXRlZCcpXG5cdH1cblxuXHRAT24oJ3JlbW90ZVVwZGF0ZWQnKVxuXHRvblJlbW90ZVVwZGF0ZWQoKXtcblx0XHRyZXR1cm4gdGhpcy5yZXNvbHZlKClcblx0fVxuXG5cdF9jYWxjUHJpdmF0ZSgpe1xuXG5cdH1cbn1cblxuY2xhc3MgVGVzdEV4dGVuZGVkIGV4dGVuZHMgVGVzdCB7XG5cdGV4dGVuZGVkKCl7fVxufVxuXG5DaGFtYnIuTW9kZWwgPSBUZXN0XG5DaGFtYnIuTW9kZWwgPSBUZXN0RXh0ZW5kZWQiLCIvL2ltcG9ydCAnYmFiZWwtcG9seWZpbGwnXG5pbXBvcnQgJy4vSW5pdENoYW1icldvcmtlci5lczYnXG5pbXBvcnQgJy4vVGVzdC5Nb2RlbC5lczYnXG5cbmNvbnNvbGUuaW5mbygnV29ya2VyIGVuZ2luZSBzdGFydGVkLicpXG5cbnNlbGYuSFcucHViKCdXb3JrZXItPlJlYWR5JylcbiJdfQ==
