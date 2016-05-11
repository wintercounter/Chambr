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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(300);


/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ModelAbstract = __webpack_require__(4);

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
	                    return Chambr.Resolve(responseEventName, ev.requestId, model.modelData, {}, {});
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
	    return fn.toString().match(/function\W+([\w$_]+?)\(/)[1];
	}

/***/ },

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Worker = __webpack_require__(3);

	var _Worker2 = _interopRequireDefault(_Worker);

	var _riotObservable = __webpack_require__(5);

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
	            return this._data;
	        }
	    }]);

	    function ModelAbstract() {
	        var _this = this;

	        _classCallCheck(this, ModelAbstract);

	        (0, _riotObservable2.default)(this);
	        this.modelData = this.constructor.DefaultData;
	        this.on('*', function (name, data) {
	            var onTriggers = _this._onTriggerEventHandlers ? _this._onTriggerEventHandlers[name] : false;
	            var promises = [];
	            onTriggers && onTriggers.forEach(function (method) {
	                var p = _this[method].call(_this, name, data);
	                p.then && promises.push(p);
	            });

	            if (promises.length) {
	                Promise.all(promises).then(function () {
	                    return _this.broadcast(name, data, false);
	                });
	            } else {
	                _this.broadcast(name, data);
	            }
	        });
	    }

	    // TODO to private


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

/***/ },

/***/ 5:
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

/***/ 300:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _dec2, _dec3, _dec4, _desc, _value, _class;

	var _Worker = __webpack_require__(3);

	var _Worker2 = _interopRequireDefault(_Worker);

	var _Decorator = __webpack_require__(301);

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

/***/ },

/***/ 301:
/***/ function(module, exports) {

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
	exports.GetSet = GetSet;
	exports.Empty = Empty;
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

	            var finalArgs = args.slice();
	            peelList.forEach(function (peel, i) {
	                var peelArgIndex = i;
	                if (peel.indexOf(':') + 1) {
	                    var tmp = peel.split(':');
	                    peelArgIndex = parseInt(tmp[0], 10);
	                    peel = tmp[1];
	                }
	                if (_typeof(args[peelArgIndex]) === 'object') {
	                    try {
	                        (function () {
	                            var r = args[peelArgIndex];
	                            var str = peel.split('->');
	                            str.forEach(function (x) {
	                                return r = r[x];
	                            });
	                            if (r === undefined) throw 'e';
	                            finalArgs[i] = r;
	                        })();
	                    } catch (e) {}
	                }
	            });
	            finalArgs.forEach(function (v, i) {
	                return args[i] = v;
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

	function GetSet(obj) {
	    var _loop = function _loop(i) {
	        obj[i] = {
	            get: function get() {
	                return this[obj[i]];
	            },
	            set: function set(o) {
	                this[obj[i]] = o;
	            }
	        };
	    };

	    for (var i in obj) {
	        _loop(i);
	    }

	    return function (target) {
	        Object.defineProperties(target, obj);
	    };
	}

	function Empty() {
	    return function (target, name, descriptor) {
	        decorate(descriptor, {
	            empty: true
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

/***/ }

/******/ });