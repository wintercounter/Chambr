/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Highway = __webpack_require__(2);

	var _Highway2 = _interopRequireDefault(_Highway);

	var _WebWorker = __webpack_require__(3);

	var _WebWorker2 = _interopRequireDefault(_WebWorker);

	var _Worker = __webpack_require__(4);

	var _Worker2 = _interopRequireDefault(_Worker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	self.HW = self.HW || new _Highway2.default(new _WebWorker2.default(self));
	self.CH = new _Worker2.default(self.HW);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
	  * Proxy object
	  * @static
	  */


		/**
	  * Bucket to store handlers
	  * @type {{*: {handlers: Array}}}
	  */


		/**
	  * @constructor
	  * @param Proxy
	  */

		function Highway() {
			var Proxy = arguments.length <= 0 || arguments[0] === undefined ? self : arguments[0];

			_classCallCheck(this, Highway);

			this.Proxy = Proxy;
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

				this.Proxy.postMessage({ name: name, data: data, state: state });
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
				this.Proxy.removeEventListener(this._handler.bind(this));
				delete this.Bucket;
			}

			/**
	   * Resets Bucket to default
	   */

		}, {
			key: 'reset',
			value: function reset() {
				DEFAULT_BUCKET['*'].handlers = [];
				this.Bucket = _extends({}, DEFAULT_BUCKET);
			}

			/**
	   * Add message listener to the host
	   * @private
	   */

		}, {
			key: '_bind',
			value: function _bind() {
				this.Proxy.addEventListener(this._handler.bind(this));
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WebWorkerProxy = function () {
		function WebWorkerProxy(Host) {
			_classCallCheck(this, WebWorkerProxy);

			this.Host = undefined;

			this.Host = Host;
		}

		_createClass(WebWorkerProxy, [{
			key: 'postMessage',
			value: function postMessage(message) {
				this.Host.postMessage(message, this.Host.document ? self.location.origin : undefined);
			}
		}, {
			key: 'addEventListener',
			value: function addEventListener(handler) {
				this.Host.addEventListener('message', handler);
			}
		}, {
			key: 'removeEventListener',
			value: function removeEventListener(handler) {
				this.Host.removeEventListener('message', handler);
			}
		}]);

		return WebWorkerProxy;
	}();

	exports.default = WebWorkerProxy;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ModelAbstract = __webpack_require__(5);

	var _ModelAbstract2 = _interopRequireDefault(_ModelAbstract);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var lastInstance = undefined;

	/**
	 * 
	 */

	var Chambr = function () {
	    _createClass(Chambr, null, [{
	        key: 'Instance',
	        get: function get() {
	            return lastInstance;
	        }

	        /**
	         * @param HighwayInstance {Highway}
	         */

	    }]);

	    function Chambr(HighwayInstance) {
	        var _this = this;

	        _classCallCheck(this, Chambr);

	        this.MODEL_LIBRARY = {};
	        this.MODEL_INSTANCES = {};
	        this.HW = undefined;
	        this.INSTANCE = undefined;

	        this.INSTANCE = lastInstance = this;
	        this.HW = HighwayInstance;
	        this.HW.sub('ChambrWorker', function (ChambrEvent) {
	            console.log('In-W: ', ChambrEvent);
	            var ev = ChambrEvent.data;
	            var route = ChambrEvent.name.split('->');
	            var argList = Object.values(ev.argList);
	            var isConstructor = route[2] === 'constructor';
	            var model = _this.getModel(route[1], isConstructor ? argList : undefined);
	            var method = model ? model[route[2]] : false;
	            var responseEventName = ChambrEvent.name.replace('ChambrWorker', 'ChambrClient');
	            if (method && isConstructor) {
	                _this.resolve(responseEventName, ev.requestId, {
	                    buffer: Array.from(model.buffer),
	                    export: _this.exports(model)
	                });
	            } else if (method) {
	                var r = method.apply(model, argList);
	                try {
	                    r.then(function (o) {
	                        return _this.resolve(responseEventName, ev.requestId, {
	                            buffer: Array.from(model.buffer),
	                            export: _this.exports(model),
	                            output: o
	                        });
	                    }).catch(function (o) {
	                        return _this.reject(responseEventName, ev.requestId, {
	                            buffer: Array.from(model.buffer),
	                            export: _this.exports(model),
	                            output: o
	                        });
	                    });
	                } catch (e) {
	                    _this.resolve(responseEventName, ev.requestId, {
	                        buffer: Array.from(model.buffer),
	                        export: _this.exports(model),
	                        output: r
	                    });
	                }
	            }
	        });
	    }

	    /** @returns {ModelAbstract} */


	    _createClass(Chambr, [{
	        key: 'getModel',
	        value: function getModel(modelName) {
	            var argList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	            var model = this.MODEL_INSTANCES[modelName];
	            if (!model) {
	                model = this.MODEL_INSTANCES[modelName] = new (Function.prototype.bind.apply(this.MODEL_LIBRARY[modelName], [null].concat(_toConsumableArray(argList))))();
	            }
	            return model;
	        }
	    }, {
	        key: 'resolve',
	        value: function resolve(eventName, responseId, responseData) {
	            var responseState = arguments.length <= 3 || arguments[3] === undefined ? 'resolve' : arguments[3];

	            this.HW.pub(eventName, {
	                responseId: responseId,
	                responseData: responseData,
	                responseState: responseState
	            }, 'resolve');
	        }
	    }, {
	        key: 'reject',
	        value: function reject(eventName, responseId, responseData) {
	            var responseState = arguments.length <= 3 || arguments[3] === undefined ? 'reject' : arguments[3];

	            this.HW.pub(eventName, {
	                responseId: responseId,
	                responseData: responseData,
	                responseState: responseState
	            }, 'reject');
	        }
	    }, {
	        key: 'exports',
	        value: function exports(model) {
	            var results = {};
	            model._exposedApi.forEach(function (apiData) {
	                apiData.type === 'var' && (results[apiData.name] = model[apiData.name]);
	            });
	            return results;
	        }
	    }, {
	        key: 'Model',
	        get: function get() {
	            _ModelAbstract2.default.Chambr = this;
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
	            this.MODEL_LIBRARY[modelName] = model;

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

	            this.HW.pub('ChambrClient->Expose', {
	                modelData: model.DefaultData,
	                modelName: modelName,
	                modelApi: api
	            });
	        }
	    }]);

	    return Chambr;
	}();

	exports.default = Chambr;


	function extractFunctionName(fn) {
	    var match = void 0;
	    fn = fn.toString();
	    match = fn.match(/class\W+(.*?)\W+/);
	    if (match) return match[1];else return fn.match(/function\W+([\w$_]+?)\(/)[1];
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _riotObservable = __webpack_require__(6);

	var _riotObservable2 = _interopRequireDefault(_riotObservable);

	var _Storage = __webpack_require__(7);

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

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
	  if (true)
	    module.exports = observable
	  else if (typeof define === 'function' && define.amd)
	    define(function() { return observable })
	  else
	    window.observable = observable

	})(typeof window != 'undefined' ? window : undefined);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.UPDATE = exports.ACTION_COMPLEX = exports.ACTION_SIMPLE_DEL = exports.ACTION_SIMPLE_SET = undefined;
	exports.Arr = Arr;
	exports.Obj = Obj;
	exports.Map = Map;
	exports.Set = Set;

	var _riotObservable = __webpack_require__(6);

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

/***/ }
/******/ ]);