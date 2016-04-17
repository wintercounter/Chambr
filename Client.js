(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function(window, undefined) {var observable = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {}

  /**
   * Private variables and methods
   */
  var callbacks = {},
    slice = Array.prototype.slice,
    onEachEvent = function(e, fn) { e.replace(/\S+/g, fn) }

  // extend the object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(events, fn) {
        if (typeof fn != 'function')  return el

        onEachEvent(events, function(name, pos) {
          (callbacks[name] = callbacks[name] || []).push(fn)
          fn.typed = pos > 0
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
          onEachEvent(events, function(name) {
            if (fn) {
              var arr = callbacks[name]
              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                if (cb == fn) arr.splice(i--, 1)
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
     * Listen to the given space separated list of `events` and execute the `callback` at most once
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
     * Execute all callback functions that listen to the given space separated list of `events`
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

        onEachEvent(events, function(name) {

          fns = slice.call(callbacks[name] || [], 0)

          for (var i = 0, fn; fn = fns[i]; ++i) {
            if (fn.busy) return
            fn.busy = 1
            fn.apply(el, fn.typed ? [name].concat(args) : args)
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HW = undefined;

var Chambr = function () {
    _createClass(Chambr, [{
        key: 'HW',
        get: function get() {
            return HW;
        }
    }, {
        key: '$',
        get: function get() {
            return this._basket;
        }
    }]);

    function Chambr(HighwayInstance) {
        var _this = this;

        _classCallCheck(this, Chambr);

        this._requestId = 0;
        this._promises = {};
        this._basket = {};

        HW = HighwayInstance;
        HW.sub('Chambr->Expose', function (exposeEvent) {
            ci('Chambr: Incoming expose', exposeEvent);
            var exposeData = exposeEvent.data;
            var model = _this.$[exposeData.modelName] = _this.applyApi(exposeData);

            HW.sub('Chambr->' + exposeData.modelName, function (modelEvent) {
                var d = modelEvent.data;
                var responseState = d.responseState;
                var responseId = d.responseId;
                var responseData = d.responseData;
                var responseSoft = d.responseSoft;
                var modelData = d.modelData;
                var modelExport = d.modelExport;

                if ((typeof modelData === 'undefined' ? 'undefined' : _typeof(modelData)) === 'object') {
                    for (var k in model) {
                        if (model.hasOwnProperty(k)) delete model[k];
                    }Object.assign(model, modelData);
                }

                if (responseState && responseId) {
                    var methods = _this._promises[responseId];
                    methods && methods[modelEvent.state].call(null, responseData !== undefined ? responseData : modelData);
                    delete _this._promises[responseId];
                }

                for (var name in modelExport) {
                    // No has own prop check needed!
                    model[name] = modelExport[name];
                }

                model.trigger(modelEvent.name, modelEvent.data);
                model.trigger(modelEvent.state, modelEvent.data);
                model.trigger(responseSoft ? 'soft' : 'hard', d);
                !responseSoft && model.trigger('updated', d);
                responseState && model.trigger(responseState, d);
            });
        });
    }

    _createClass(Chambr, [{
        key: 'applyApi',
        value: function applyApi(exposeData) {
            var _this2 = this;

            var d = this.applyApiValue(exposeData.modelName, {
                name: 'constructor',
                type: 'fn'
            });
            Object.assign(d, exposeData.modelData);
            exposeData.modelApi.forEach(function (apiData) {
                return Object.defineProperty(d, apiData.name, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: _this2.applyApiValue(exposeData.modelName, apiData)
                });
            });
            return (0, _riotObservable2.default)(d);
        }
    }, {
        key: 'applyApiValue',
        value: function applyApiValue(name, apiData) {
            var that = this;
            var method = apiData.name;
            var value = undefined;

            if (apiData.type === 'fn') {
                value = function value() {
                    for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
                        argList[_key] = arguments[_key];
                    }

                    this && this.trigger && this.trigger(method);
                    var p = new Promise(function (resolve, reject) {
                        that._promises[++that._requestId] = { resolve: resolve, reject: reject };
                        HW.pub('Chambr->' + name + '->' + method, {
                            argList: [].slice.call(argList, 0),
                            requestId: that._requestId
                        });
                    });
                    return method === 'constructor' ? that._basket[name] : p;
                };
            }

            for (var decorator in apiData.decorators) {
                if (!apiData.decorators.hasOwnProperty(decorator)) continue;
                var descriptor = apiData.decorators[decorator];
                switch (decorator) {
                    case 'default':
                        value = descriptor;
                        break;
                    case 'peel':
                        var old = value;
                        var peelList = descriptor.list;
                        eval('value = ' + descriptor.fn);
                        break;
                    default:
                        break;
                }
            }

            return value;
        }
    }]);

    return Chambr;
}();

exports.default = Chambr;

},{"riot-observable":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcQ2xpZW50LmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzSUE7Ozs7Ozs7O0FBRUEsSUFBSSxLQUFL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Q0FBRCxFQUErQyxTQUFuRDtBQUNBLG9CQUFJLGFBQWEsUUFBUSxVQUFSLENBQW1CLFNBQW5CLENBQWIsQ0FGa0M7QUFHdEMsd0JBQU8sU0FBUDtBQUNJLHlCQUFLLFNBQUw7QUFDSSxnQ0FBUSxVQUFSLENBREo7QUFFSSw4QkFGSjtBQURKLHlCQUlTLE1BQUw7QUFDSSw0QkFBSSxNQUFNLEtBQU4sQ0FEUjtBQUVJLDRCQUFJLFdBQVcsV0FBVyxJQUFYLENBRm5CO0FBR0ksMENBQWdCLFdBQVcsRUFBWCxDQUFoQixDQUhKO0FBSUksOEJBSko7QUFKSjtBQVNhLDhCQUFUO0FBVEosaUJBSHNDO2FBQTFDOztBQWdCQSxtQkFBTyxLQUFQLENBbkN3Qjs7OztXQS9FWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKHdpbmRvdywgdW5kZWZpbmVkKSB7dmFyIG9ic2VydmFibGUgPSBmdW5jdGlvbihlbCkge1xuXG4gIC8qKlxuICAgKiBFeHRlbmQgdGhlIG9yaWdpbmFsIG9iamVjdCBvciBjcmVhdGUgYSBuZXcgZW1wdHkgb25lXG4gICAqIEB0eXBlIHsgT2JqZWN0IH1cbiAgICovXG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIHZhcmlhYmxlcyBhbmQgbWV0aG9kc1xuICAgKi9cbiAgdmFyIGNhbGxiYWNrcyA9IHt9LFxuICAgIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIG9uRWFjaEV2ZW50ID0gZnVuY3Rpb24oZSwgZm4pIHsgZS5yZXBsYWNlKC9cXFMrL2csIGZuKSB9XG5cbiAgLy8gZXh0ZW5kIHRoZSBvYmplY3QgYWRkaW5nIHRoZSBvYnNlcnZhYmxlIG1ldGhvZHNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWwsIHtcbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZCBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGVhY2ggdGltZSBhbiBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAgICogQHBhcmFtICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBpZiAodHlwZW9mIGZuICE9ICdmdW5jdGlvbicpICByZXR1cm4gZWxcblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcykge1xuICAgICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9mZjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PSAnKicgJiYgIWZuKSBjYWxsYmFja3MgPSB7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2IgPT0gZm4pIGFyci5zcGxpY2UoaS0tLCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgZGVsZXRlIGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgYXQgbW9zdCBvbmNlXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb25lOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgICAgICBlbC5vZmYoZXZlbnRzLCBvbilcbiAgICAgICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbC5vbihldmVudHMsIG9uKVxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIHRyaWdnZXI6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMpIHtcblxuICAgICAgICAvLyBnZXR0aW5nIHRoZSBhcmd1bWVudHNcbiAgICAgICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxLFxuICAgICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkoYXJnbGVuKSxcbiAgICAgICAgICBmbnNcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ2xlbjsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV0gLy8gc2tpcCBmaXJzdCBhcmd1bWVudFxuICAgICAgICB9XG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lKSB7XG5cbiAgICAgICAgICBmbnMgPSBzbGljZS5jYWxsKGNhbGxiYWNrc1tuYW1lXSB8fCBbXSwgMClcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBmbjsgZm4gPSBmbnNbaV07ICsraSkge1xuICAgICAgICAgICAgaWYgKGZuLmJ1c3kpIHJldHVyblxuICAgICAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgICAgIGZuLmFwcGx5KGVsLCBmbi50eXBlZCA/IFtuYW1lXS5jb25jYXQoYXJncykgOiBhcmdzKVxuICAgICAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgICAgIGZuLmJ1c3kgPSAwXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrc1snKiddICYmIG5hbWUgIT0gJyonKVxuICAgICAgICAgICAgZWwudHJpZ2dlci5hcHBseShlbCwgWycqJywgbmFtZV0uY29uY2F0KGFyZ3MpKVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBlbFxuXG59XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgICBtb2R1bGUuZXhwb3J0cyA9IG9ic2VydmFibGVcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIG9ic2VydmFibGUgfSlcbiAgZWxzZVxuICAgIHdpbmRvdy5vYnNlcnZhYmxlID0gb2JzZXJ2YWJsZVxuXG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkKTsiLCJpbXBvcnQgT2JzZXJ2YWJsZSBmcm9tICdyaW90LW9ic2VydmFibGUnXG5cbnZhciBIVyA9IHVuZGVmaW5lZFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFtYnIge1xuXG4gICAgX3JlcXVlc3RJZCA9IDBcblxuICAgIF9wcm9taXNlcyA9IHt9XG5cbiAgICBfYmFza2V0ID0ge31cblxuICAgIGdldCBIVygpe1xuICAgICAgICByZXR1cm4gSFdcbiAgICB9XG5cbiAgICBnZXQgJCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYmFza2V0XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoSGlnaHdheUluc3RhbmNlKXtcbiAgICAgICAgSFcgPSBIaWdod2F5SW5zdGFuY2VcbiAgICAgICAgSFcuc3ViKCdDaGFtYnItPkV4cG9zZScsIGV4cG9zZUV2ZW50ID0+IHtcbiAgICAgICAgICAgIGNpKCdDaGFtYnI6IEluY29taW5nIGV4cG9zZScsIGV4cG9zZUV2ZW50KVxuICAgICAgICAgICAgbGV0IGV4cG9zZURhdGEgPSAgZXhwb3NlRXZlbnQuZGF0YVxuICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy4kW2V4cG9zZURhdGEubW9kZWxOYW1lXSA9IHRoaXMuYXBwbHlBcGkoZXhwb3NlRGF0YSlcblxuICAgICAgICAgICAgSFcuc3ViKGBDaGFtYnItPiR7ZXhwb3NlRGF0YS5tb2RlbE5hbWV9YCwgbW9kZWxFdmVudCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGQgICAgICAgICAgICAgPSBtb2RlbEV2ZW50LmRhdGFcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VTdGF0ZSA9IGQucmVzcG9uc2VTdGF0ZVxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZUlkICAgID0gZC5yZXNwb25zZUlkXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlRGF0YSAgPSBkLnJlc3BvbnNlRGF0YVxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZVNvZnQgID0gZC5yZXNwb25zZVNvZnRcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWxEYXRhICAgICA9IGQubW9kZWxEYXRhXG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsRXhwb3J0ICAgPSBkLm1vZGVsRXhwb3J0XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVsRGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiBtb2RlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5oYXNPd25Qcm9wZXJ0eShrKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbW9kZWxba11cblxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG1vZGVsLCBtb2RlbERhdGEpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlU3RhdGUgJiYgcmVzcG9uc2VJZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWV0aG9kcyA9IHRoaXMuX3Byb21pc2VzW3Jlc3BvbnNlSWRdXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHMgJiYgbWV0aG9kc1ttb2RlbEV2ZW50LnN0YXRlXS5jYWxsKG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZURhdGEgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzcG9uc2VEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtb2RlbERhdGFcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvbWlzZXNbcmVzcG9uc2VJZF1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIG1vZGVsRXhwb3J0KXtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gaGFzIG93biBwcm9wIGNoZWNrIG5lZWRlZCFcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSBtb2RlbEV4cG9ydFtuYW1lXVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1vZGVsLnRyaWdnZXIobW9kZWxFdmVudC5uYW1lLCBtb2RlbEV2ZW50LmRhdGEpXG4gICAgICAgICAgICAgICAgbW9kZWwudHJpZ2dlcihtb2RlbEV2ZW50LnN0YXRlLCBtb2RlbEV2ZW50LmRhdGEpXG4gICAgICAgICAgICAgICAgbW9kZWwudHJpZ2dlcihyZXNwb25zZVNvZnQgPyAnc29mdCcgOiAnaGFyZCcsIGQpXG4gICAgICAgICAgICAgICAgIXJlc3BvbnNlU29mdCAmJiBtb2RlbC50cmlnZ2VyKCd1cGRhdGVkJywgZClcbiAgICAgICAgICAgICAgICByZXNwb25zZVN0YXRlICYmIG1vZGVsLnRyaWdnZXIocmVzcG9uc2VTdGF0ZSwgZClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXBwbHlBcGkoZXhwb3NlRGF0YSl7XG4gICAgICAgIGxldCBkID0gdGhpcy5hcHBseUFwaVZhbHVlKGV4cG9zZURhdGEubW9kZWxOYW1lLCB7XG4gICAgICAgICAgICBuYW1lOiAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgdHlwZTogJ2ZuJ1xuICAgICAgICB9KVxuICAgICAgICBPYmplY3QuYXNzaWduKGQsIGV4cG9zZURhdGEubW9kZWxEYXRhKVxuICAgICAgICBleHBvc2VEYXRhLm1vZGVsQXBpLmZvckVhY2goYXBpRGF0YSA9PiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZCwgYXBpRGF0YS5uYW1lLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuYXBwbHlBcGlWYWx1ZShleHBvc2VEYXRhLm1vZGVsTmFtZSwgYXBpRGF0YSlcbiAgICAgICAgfSkpXG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlKGQpXG4gICAgfVxuXG4gICAgYXBwbHlBcGlWYWx1ZShuYW1lLCBhcGlEYXRhKXtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzXG4gICAgICAgIGxldCBtZXRob2QgPSBhcGlEYXRhLm5hbWVcbiAgICAgICAgbGV0IHZhbHVlID0gdW5kZWZpbmVkXG5cbiAgICAgICAgaWYgKGFwaURhdGEudHlwZSA9PT0gJ2ZuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBmdW5jdGlvbiguLi5hcmdMaXN0KXtcbiAgICAgICAgICAgICAgICB0aGlzICYmIHRoaXMudHJpZ2dlciAmJiB0aGlzLnRyaWdnZXIobWV0aG9kKVxuICAgICAgICAgICAgICAgIGxldCBwID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9wcm9taXNlc1srK3RoYXQuX3JlcXVlc3RJZF0gPSB7IHJlc29sdmUsIHJlamVjdCB9XG4gICAgICAgICAgICAgICAgICAgIEhXLnB1YihgQ2hhbWJyLT4ke25hbWV9LT4ke21ldGhvZH1gLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdMaXN0OiBbXS5zbGljZS5jYWxsKGFyZ0xpc3QsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdElkOiB0aGF0Ll9yZXF1ZXN0SWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybiAobWV0aG9kID09PSAnY29uc3RydWN0b3InKSA/IHRoYXQuX2Jhc2tldFtuYW1lXSA6IHBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGRlY29yYXRvciBpbiBhcGlEYXRhLmRlY29yYXRvcnMpIHtcbiAgICAgICAgICAgIGlmICghYXBpRGF0YS5kZWNvcmF0b3JzLmhhc093blByb3BlcnR5KGRlY29yYXRvcikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBhcGlEYXRhLmRlY29yYXRvcnNbZGVjb3JhdG9yXVxuICAgICAgICAgICAgc3dpdGNoKGRlY29yYXRvcil7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVmYXVsdCc6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZGVzY3JpcHRvclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwZWVsJzpcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGxldCBwZWVsTGlzdCA9IGRlc2NyaXB0b3IubGlzdFxuICAgICAgICAgICAgICAgICAgICBldmFsKGB2YWx1ZSA9ICR7ZGVzY3JpcHRvci5mbn1gKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbn0iXX0=
