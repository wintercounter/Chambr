(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChambrWorker = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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

},{"./Worker.es6":3,"riot-observable":1}],3:[function(require,module,exports){
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

},{"./ModelAbstract.es6":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcTW9kZWxBYnN0cmFjdC5lczYiLCJzcmNcXFdvcmtlci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUMzQiwyQkFBVyxNQUFNLFdBQU47QUFDWCwyQkFBVyxTQUFYO0FBQ0EsMEJBQVUsR0FBVjthQUhKLEVBdkNvQjs7OztXQXhDUDs7Ozs7O0FBNkhyQixTQUFTLG1CQUFULENBQTZCLEVBQTdCLEVBQWdDO0FBQzVCLFdBQU8sR0FBRyxRQUFILEdBQWMsS0FBZCxDQUFvQix5QkFBcEIsRUFBK0MsQ0FBL0MsQ0FBUCxDQUQ0QjtDQUFoQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKHdpbmRvdywgdW5kZWZpbmVkKSB7dmFyIG9ic2VydmFibGUgPSBmdW5jdGlvbihlbCkge1xuXG4gIC8qKlxuICAgKiBFeHRlbmQgdGhlIG9yaWdpbmFsIG9iamVjdCBvciBjcmVhdGUgYSBuZXcgZW1wdHkgb25lXG4gICAqIEB0eXBlIHsgT2JqZWN0IH1cbiAgICovXG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIHZhcmlhYmxlc1xuICAgKi9cbiAgdmFyIGNhbGxiYWNrcyA9IHt9LFxuICAgIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG5cbiAgLyoqXG4gICAqIFByaXZhdGUgTWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIG5lZWRlZCB0byBnZXQgYW5kIGxvb3AgYWxsIHRoZSBldmVudHMgaW4gYSBzdHJpbmdcbiAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGUgLSBldmVudCBzdHJpbmdcbiAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgIGZuIC0gY2FsbGJhY2tcbiAgICovXG4gIGZ1bmN0aW9uIG9uRWFjaEV2ZW50KGUsIGZuKSB7XG4gICAgdmFyIGVzID0gZS5zcGxpdCgnICcpLCBsID0gZXMubGVuZ3RoLCBpID0gMCwgbmFtZSwgaW5keFxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBuYW1lID0gZXNbaV1cbiAgICAgIGluZHggPSBuYW1lLmluZGV4T2YoJy4nKVxuICAgICAgaWYgKG5hbWUpIGZuKCB+aW5keCA/IG5hbWUuc3Vic3RyaW5nKDAsIGluZHgpIDogbmFtZSwgaSwgfmluZHggPyBuYW1lLnNsaWNlKGluZHggKyAxKSA6IG51bGwpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBBcGlcbiAgICovXG5cbiAgLy8gZXh0ZW5kIHRoZSBlbCBvYmplY3QgYWRkaW5nIHRoZSBvYnNlcnZhYmxlIG1ldGhvZHNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWwsIHtcbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZFxuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgZWFjaCB0aW1lIGFuIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICAgKiBAcGFyYW0gIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb246IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm4gIT0gJ2Z1bmN0aW9uJykgIHJldHVybiBlbFxuXG4gICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zLCBucykge1xuICAgICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICAgICAgZm4ubnMgPSBuc1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvZmY6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGlmIChldmVudHMgPT0gJyonICYmICFmbikgY2FsbGJhY2tzID0ge31cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MsIG5zKSB7XG4gICAgICAgICAgICBpZiAoZm4gfHwgbnMpIHtcbiAgICAgICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgY2I7IGNiID0gYXJyICYmIGFycltpXTsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNiID09IGZuIHx8IG5zICYmIGNiLm5zID09IG5zKSBhcnIuc3BsaWNlKGktLSwgMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGRlbGV0ZSBjYWxsYmFja3NbbmFtZV1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZFxuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgYXQgbW9zdCBvbmNlXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb25lOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgICAgICBlbC5vZmYoZXZlbnRzLCBvbilcbiAgICAgICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbC5vbihldmVudHMsIG9uKVxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG9cbiAgICAgKiB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2BcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgdHJpZ2dlcjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cykge1xuXG4gICAgICAgIC8vIGdldHRpbmcgdGhlIGFyZ3VtZW50c1xuICAgICAgICB2YXIgYXJnbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDEsXG4gICAgICAgICAgYXJncyA9IG5ldyBBcnJheShhcmdsZW4pLFxuICAgICAgICAgIGZuc1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJnbGVuOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXSAvLyBza2lwIGZpcnN0IGFyZ3VtZW50XG4gICAgICAgIH1cblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcywgbnMpIHtcblxuICAgICAgICAgIGZucyA9IHNsaWNlLmNhbGwoY2FsbGJhY2tzW25hbWVdIHx8IFtdLCAwKVxuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGZuOyBmbiA9IGZuc1tpXTsgKytpKSB7XG4gICAgICAgICAgICBpZiAoZm4uYnVzeSkgY29udGludWVcbiAgICAgICAgICAgIGZuLmJ1c3kgPSAxXG4gICAgICAgICAgICBpZiAoIW5zIHx8IGZuLm5zID09IG5zKSBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgICAgIGlmIChmbnNbaV0gIT09IGZuKSB7IGktLSB9XG4gICAgICAgICAgICBmbi5idXN5ID0gMFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjYWxsYmFja3NbJyonXSAmJiBuYW1lICE9ICcqJylcbiAgICAgICAgICAgIGVsLnRyaWdnZXIuYXBwbHkoZWwsIFsnKicsIG5hbWVdLmNvbmNhdChhcmdzKSlcblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gZWxcblxufVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAvLyBzdXBwb3J0IENvbW1vbkpTLCBBTUQgJiBicm93c2VyXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBvYnNlcnZhYmxlXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBvYnNlcnZhYmxlIH0pXG4gIGVsc2VcbiAgICB3aW5kb3cub2JzZXJ2YWJsZSA9IG9ic2VydmFibGVcblxufSkodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZCk7IiwiaW1wb3J0IENoYW1iciBmcm9tICcuL1dvcmtlci5lczYnXG5pbXBvcnQgT2JzZXJ2YWJsZSBmcm9tICdyaW90LW9ic2VydmFibGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGVsQWJzdHJhY3Qge1xuXG4gICAgc2V0IG1vZGVsRGF0YShvKXtcbiAgICAgICAgdGhpcy5fZGF0YSA9IG9cbiAgICB9XG5cbiAgICBnZXQgbW9kZWxEYXRhKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgT2JzZXJ2YWJsZSh0aGlzKVxuICAgICAgICB0aGlzLm1vZGVsRGF0YSA9IHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdERhdGFcbiAgICAgICAgdGhpcy5vbignKicsIChuYW1lLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBsZXQgb25UcmlnZ2VycyA9IHRoaXMuX29uVHJpZ2dlckV2ZW50SGFuZGxlcnMgPyB0aGlzLl9vblRyaWdnZXJFdmVudEhhbmRsZXJzW25hbWVdIDogZmFsc2VcbiAgICAgICAgICAgIGxldCBwcm9taXNlcyA9IFtdXG4gICAgICAgICAgICBvblRyaWdnZXJzICYmIG9uVHJpZ2dlcnMuZm9yRWFjaChtZXRob2QgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwID0gdGhpc1ttZXRob2RdLmNhbGwodGhpcywgbmFtZSwgZGF0YSlcbiAgICAgICAgICAgICAgICBwLnRoZW4gJiYgcHJvbWlzZXMucHVzaChwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKHByb21pc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHRoaXMuYnJvYWRjYXN0KG5hbWUsIGRhdGEsIGZhbHNlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0KG5hbWUsIGRhdGEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYnJvYWRjYXN0KG5hbWUsIGRhdGEgPSB1bmRlZmluZWQsIHNvZnQgPSB0cnVlKXtcbiAgICAgICAgQ2hhbWJyLlJlc29sdmUoYENoYW1ickNsaWVudC0+JHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9LT5FdmVudGAsIC0xLCB0aGlzLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydCh0aGlzKSwgZGF0YSwgc29mdCwgbmFtZSlcbiAgICB9XG5cbiAgICByZXNvbHZlKGRhdGEgPSB1bmRlZmluZWQsIHNvZnQgPSBmYWxzZSwgc3RhdGUgPSAncmVzb2x2ZScpe1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtkYXRhLCBzb2Z0LCBzdGF0ZX0pXG4gICAgfVxuXG4gICAgcmVqZWN0KGRhdGEgPSB1bmRlZmluZWQsIHNvZnQgPSB0cnVlLCBzdGF0ZSA9ICdyZWplY3QnKXtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtkYXRhLCBzb2Z0LCBzdGF0ZX0pXG4gICAgfVxuXG59IiwiaW1wb3J0IE1vZGVsQWJzdHJhY3QgZnJvbSAnLi9Nb2RlbEFic3RyYWN0LmVzNidcblxuY29uc3QgTU9ERUxfTElCUkFSWSA9IHt9XG5jb25zdCBNT0RFTF9JTlNUQU5DRVMgPSB7fVxuXG4vKiogQHR5cGUge0hpZ2h3YXl9ICovXG52YXIgSFcgPSB1bmRlZmluZWRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbWJyIHtcblxuXHQvKipcblx0ICogXG4gICAgICogQHBhcmFtIEhpZ2h3YXlJbnN0YW5jZSB7SGlnaHdheX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihIaWdod2F5SW5zdGFuY2Upe1xuICAgICAgICBIVyA9IEhpZ2h3YXlJbnN0YW5jZVxuICAgICAgICBIVy5zdWIoJ0NoYW1icldvcmtlcicsIGZ1bmN0aW9uKENoYW1ickV2ZW50KXtcbiAgICAgICAgICAgIGxldCBldiAgICAgID0gQ2hhbWJyRXZlbnQuZGF0YVxuICAgICAgICAgICAgbGV0IHJvdXRlICAgPSBDaGFtYnJFdmVudC5uYW1lLnNwbGl0KCctPicpXG4gICAgICAgICAgICBsZXQgYXJnTGlzdCA9IE9iamVjdC52YWx1ZXMoZXYuYXJnTGlzdClcbiAgICAgICAgICAgIGxldCBpc0NvbnN0cnVjdG9yID0gcm91dGVbMl0gPT09ICdjb25zdHJ1Y3RvcidcbiAgICAgICAgICAgIGxldCBtb2RlbCAgID0gQ2hhbWJyLmdldE1vZGVsKHJvdXRlWzFdLCBpc0NvbnN0cnVjdG9yID8gYXJnTGlzdCA6IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGxldCBtZXRob2QgID0gbW9kZWwgPyBtb2RlbFtyb3V0ZVsyXV0gOiBmYWxzZVxuICAgICAgICAgICAgbGV0IHJlc3BvbnNlRXZlbnROYW1lID0gQ2hhbWJyRXZlbnQubmFtZS5yZXBsYWNlKCdDaGFtYnJXb3JrZXInLCAnQ2hhbWJyQ2xpZW50JylcbiAgICAgICAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ2hhbWJyLlJlc29sdmUocmVzcG9uc2VFdmVudE5hbWUsIGV2LnJlcXVlc3RJZCwgbW9kZWwubW9kZWxEYXRhLCB7fSwge30pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCByID0gbWV0aG9kLmFwcGx5KG1vZGVsLCBhcmdMaXN0KVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHIudGhlbihvID0+IENoYW1ici5SZXNvbHZlKHJlc3BvbnNlRXZlbnROYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIG8uZGF0YSwgby5zb2Z0LCBvLnN0YXRlKSlcbiAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChvID0+IENoYW1ici5SZWplY3QocmVzcG9uc2VFdmVudE5hbWUsIGV2LnJlcXVlc3RJZCwgbW9kZWwubW9kZWxEYXRhLCBDaGFtYnIuRXhwb3J0KG1vZGVsKSwgby5kYXRhLCBvLnNvZnQsIG8uc3RhdGUpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgQ2hhbWJyLlJlc29sdmUocmVzcG9uc2VFdmVudE5hbWUsIGV2LnJlcXVlc3RJZCwgbW9kZWwubW9kZWxEYXRhLCBDaGFtYnIuRXhwb3J0KG1vZGVsKSwgciwgdHJ1ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqIEByZXR1cm5zIHtNb2RlbEFic3RyYWN0fSAqL1xuICAgIHN0YXRpYyBnZXQgTW9kZWwoKXtcbiAgICAgICAgcmV0dXJuIE1vZGVsQWJzdHJhY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbW9kZWwge01vZGVsQWJzdHJhY3R9XG4gICAgICovXG4gICAgc3RhdGljIHNldCBNb2RlbChtb2RlbCkge1xuICAgICAgICBsZXQgYXBpID0gW11cbiAgICAgICAgbGV0IHRtcE1vZGVsID0gbW9kZWwucHJvdG90eXBlXG4gICAgICAgIGxldCBtb2RlbE5hbWUgPSBleHRyYWN0RnVuY3Rpb25OYW1lKG1vZGVsKVxuICAgICAgICBNT0RFTF9MSUJSQVJZW21vZGVsTmFtZV0gPSBtb2RlbFxuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRtcE1vZGVsKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5maW5kSW5kZXgodiA9PiB2Lm5hbWUgPT09IHByb3ApID09PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgcHJvcCAhPT0gJ2NvbnN0cnVjdG9yJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgcHJvcC5jaGFyQXQoMCkgIT09ICdfJ1xuICAgICAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRtcE1vZGVsLCBwcm9wKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcHJvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkZXNjcmlwdG9yLmdldCA/ICd2YXInIDogJ2ZuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNvcmF0b3JzOiBkZXNjcmlwdG9yLmdldCA/IGRlc2NyaXB0b3IuZ2V0LmRlY29yYXRvcnMgOiBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0bXBNb2RlbCA9IHRtcE1vZGVsLl9fcHJvdG9fX1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdG1wTW9kZWxcbiAgICAgICAgICAgICAgICAmJiB0bXBNb2RlbC5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICYmIGV4dHJhY3RGdW5jdGlvbk5hbWUodG1wTW9kZWwuY29uc3RydWN0b3IpICE9PSAnTW9kZWxBYnN0cmFjdCdcbiAgICAgICAgICAgICAgICAmJiBleHRyYWN0RnVuY3Rpb25OYW1lKHRtcE1vZGVsLmNvbnN0cnVjdG9yKSAhPT0gJ09iamVjdCdcbiAgICAgICAgICAgICkge31cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRtcE1vZGVsID0gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAodG1wTW9kZWwpXG5cbiAgICAgICAgbW9kZWwucHJvdG90eXBlLl9leHBvc2VkQXBpID0gYXBpXG5cbiAgICAgICAgSFcucHViKCdDaGFtYnJDbGllbnQtPkV4cG9zZScsIHtcbiAgICAgICAgICAgIG1vZGVsRGF0YTogbW9kZWwuRGVmYXVsdERhdGEsXG4gICAgICAgICAgICBtb2RlbE5hbWU6IG1vZGVsTmFtZSxcbiAgICAgICAgICAgIG1vZGVsQXBpOiBhcGlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0TW9kZWwobW9kZWxOYW1lLCBhcmdMaXN0ID0gW10pe1xuICAgICAgICBsZXQgbW9kZWwgPSBNT0RFTF9JTlNUQU5DRVNbbW9kZWxOYW1lXVxuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICBtb2RlbCA9IE1PREVMX0lOU1RBTkNFU1ttb2RlbE5hbWVdID0gbmV3IE1PREVMX0xJQlJBUllbbW9kZWxOYW1lXSguLi5hcmdMaXN0KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2RlbFxuICAgIH1cblxuICAgIHN0YXRpYyBSZXNvbHZlKGV2ZW50TmFtZSwgcmVzcG9uc2VJZCwgbW9kZWxEYXRhLCBtb2RlbEV4cG9ydCwgcmVzcG9uc2VEYXRhLCByZXNwb25zZVNvZnQsIHJlc3BvbnNlU3RhdGUgPSAncmVzb2x2ZScpe1xuICAgICAgICBIVy5wdWIoZXZlbnROYW1lLCB7XG4gICAgICAgICAgICByZXNwb25zZUlkLFxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhLFxuICAgICAgICAgICAgcmVzcG9uc2VTb2Z0LFxuICAgICAgICAgICAgcmVzcG9uc2VTdGF0ZSxcbiAgICAgICAgICAgIG1vZGVsRGF0YSxcbiAgICAgICAgICAgIG1vZGVsRXhwb3J0XG4gICAgICAgIH0sICdyZXNvbHZlJylcbiAgICB9XG5cbiAgICBzdGF0aWMgUmVqZWN0KGV2ZW50TmFtZSwgcmVzcG9uc2VJZCwgbW9kZWxEYXRhLCBtb2RlbEV4cG9ydCwgcmVzcG9uc2VEYXRhLCByZXNwb25zZVNvZnQsIHJlc3BvbnNlU3RhdGUgPSAncmVqZWN0Jykge1xuICAgICAgICBIVy5wdWIoZXZlbnROYW1lLCB7XG4gICAgICAgICAgICByZXNwb25zZUlkLFxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhLFxuICAgICAgICAgICAgcmVzcG9uc2VTb2Z0LFxuICAgICAgICAgICAgcmVzcG9uc2VTdGF0ZSxcbiAgICAgICAgICAgIG1vZGVsRGF0YSxcbiAgICAgICAgICAgIG1vZGVsRXhwb3J0XG4gICAgICAgIH0sICdyZWplY3QnKVxuICAgIH1cblxuICAgIHN0YXRpYyBFeHBvcnQobW9kZWwpe1xuICAgICAgICBsZXQgcmVzdWx0cyA9IHt9XG4gICAgICAgIG1vZGVsLl9leHBvc2VkQXBpLmZvckVhY2goYXBpRGF0YSA9PiB7XG4gICAgICAgICAgICBhcGlEYXRhLnR5cGUgPT09ICd2YXInICYmIChyZXN1bHRzW2FwaURhdGEubmFtZV0gPSBtb2RlbFthcGlEYXRhLm5hbWVdKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZXh0cmFjdEZ1bmN0aW9uTmFtZShmbil7XG4gICAgcmV0dXJuIGZuLnRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFxXKyhbXFx3JF9dKz8pXFwoLylbMV1cbn1cbiJdfQ==
