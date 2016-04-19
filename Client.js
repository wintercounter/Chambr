(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChambrClient = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            console.info('Chambr: Incoming expose', exposeEvent);
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

},{"riot-observable":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcQ2xpZW50LmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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NEIsS0FBSyxPQUFMLENBQWEsSUFBYixDQUE3QixHQUFrRCxDQUFsRCxDQVRpQjtpQkFBcEIsQ0FEZTthQUEzQjs7QUFjQSxpQkFBSyxJQUFJLFNBQUosSUFBaUIsUUFBUSxVQUFSLEVBQW9CO0FBQ3RDLG9CQUFJLENBQUMsUUFBUSxVQUFSLENBQW1CLGNBQW5CLENBQWtDLFNBQWxDLENBQUQsRUFBK0MsU0FBbkQ7QUFDQSxvQkFBSSxhQUFhLFFBQVEsVUFBUixDQUFtQixTQUFuQixDQUFiLENBRmtDO0FBR3RDLHdCQUFPLFNBQVA7QUFDSSx5QkFBSyxTQUFMO0FBQ0ksZ0NBQVEsVUFBUixDQURKO0FBRUksOEJBRko7QUFESix5QkFJUyxNQUFMO0FBQ0ksNEJBQUksTUFBTSxLQUFOLENBRFI7QUFFSSw0QkFBSSxXQUFXLFdBQVcsSUFBWCxDQUZuQjtBQUdJLDBDQUFnQixXQUFXLEVBQVgsQ0FBaEIsQ0FISjtBQUlJLDhCQUpKO0FBSko7QUFTYSw4QkFBVDtBQVRKLGlCQUhzQzthQUExQzs7QUFnQkEsbUJBQU8sS0FBUCxDQW5Dd0I7Ozs7V0EvRVgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge3ZhciBvYnNlcnZhYmxlID0gZnVuY3Rpb24oZWwpIHtcblxuICAvKipcbiAgICogRXh0ZW5kIHRoZSBvcmlnaW5hbCBvYmplY3Qgb3IgY3JlYXRlIGEgbmV3IGVtcHR5IG9uZVxuICAgKiBAdHlwZSB7IE9iamVjdCB9XG4gICAqL1xuXG4gIGVsID0gZWwgfHwge31cblxuICAvKipcbiAgICogUHJpdmF0ZSB2YXJpYWJsZXNcbiAgICovXG4gIHZhciBjYWxsYmFja3MgPSB7fSxcbiAgICBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIE1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIEhlbHBlciBmdW5jdGlvbiBuZWVkZWQgdG8gZ2V0IGFuZCBsb29wIGFsbCB0aGUgZXZlbnRzIGluIGEgc3RyaW5nXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBlIC0gZXZlbnQgc3RyaW5nXG4gICAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gICBmbiAtIGNhbGxiYWNrXG4gICAqL1xuICBmdW5jdGlvbiBvbkVhY2hFdmVudChlLCBmbikge1xuICAgIHZhciBlcyA9IGUuc3BsaXQoJyAnKSwgbCA9IGVzLmxlbmd0aCwgaSA9IDAsIG5hbWUsIGluZHhcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgbmFtZSA9IGVzW2ldXG4gICAgICBpbmR4ID0gbmFtZS5pbmRleE9mKCcuJylcbiAgICAgIGlmIChuYW1lKSBmbiggfmluZHggPyBuYW1lLnN1YnN0cmluZygwLCBpbmR4KSA6IG5hbWUsIGksIH5pbmR4ID8gbmFtZS5zbGljZShpbmR4ICsgMSkgOiBudWxsKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgQXBpXG4gICAqL1xuXG4gIC8vIGV4dGVuZCB0aGUgZWwgb2JqZWN0IGFkZGluZyB0aGUgb2JzZXJ2YWJsZSBtZXRob2RzXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGVsLCB7XG4gICAgLyoqXG4gICAgICogTGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBhbmRcbiAgICAgKiBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGVhY2ggdGltZSBhbiBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAgICogQHBhcmFtICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBpZiAodHlwZW9mIGZuICE9ICdmdW5jdGlvbicpICByZXR1cm4gZWxcblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcywgbnMpIHtcbiAgICAgICAgICAoY2FsbGJhY2tzW25hbWVdID0gY2FsbGJhY2tzW25hbWVdIHx8IFtdKS5wdXNoKGZuKVxuICAgICAgICAgIGZuLnR5cGVkID0gcG9zID4gMFxuICAgICAgICAgIGZuLm5zID0gbnNcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgbGlzdGVuZXJzXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb2ZmOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBpZiAoZXZlbnRzID09ICcqJyAmJiAhZm4pIGNhbGxiYWNrcyA9IHt9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zLCBucykge1xuICAgICAgICAgICAgaWYgKGZuIHx8IG5zKSB7XG4gICAgICAgICAgICAgIHZhciBhcnIgPSBjYWxsYmFja3NbbmFtZV1cbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNiOyBjYiA9IGFyciAmJiBhcnJbaV07ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChjYiA9PSBmbiB8fCBucyAmJiBjYi5ucyA9PSBucykgYXJyLnNwbGljZShpLS0sIDEpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBkZWxldGUgY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBhbmRcbiAgICAgKiBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGF0IG1vc3Qgb25jZVxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgZnVuY3Rpb24gb24oKSB7XG4gICAgICAgICAgZWwub2ZmKGV2ZW50cywgb24pXG4gICAgICAgICAgZm4uYXBwbHkoZWwsIGFyZ3VtZW50cylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWwub24oZXZlbnRzLCBvbilcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBhbGwgY2FsbGJhY2sgZnVuY3Rpb25zIHRoYXQgbGlzdGVuIHRvXG4gICAgICogdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIHRyaWdnZXI6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMpIHtcblxuICAgICAgICAvLyBnZXR0aW5nIHRoZSBhcmd1bWVudHNcbiAgICAgICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxLFxuICAgICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkoYXJnbGVuKSxcbiAgICAgICAgICBmbnNcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ2xlbjsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV0gLy8gc2tpcCBmaXJzdCBhcmd1bWVudFxuICAgICAgICB9XG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MsIG5zKSB7XG5cbiAgICAgICAgICBmbnMgPSBzbGljZS5jYWxsKGNhbGxiYWNrc1tuYW1lXSB8fCBbXSwgMClcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBmbjsgZm4gPSBmbnNbaV07ICsraSkge1xuICAgICAgICAgICAgaWYgKGZuLmJ1c3kpIGNvbnRpbnVlXG4gICAgICAgICAgICBmbi5idXN5ID0gMVxuICAgICAgICAgICAgaWYgKCFucyB8fCBmbi5ucyA9PSBucykgZm4uYXBwbHkoZWwsIGZuLnR5cGVkID8gW25hbWVdLmNvbmNhdChhcmdzKSA6IGFyZ3MpXG4gICAgICAgICAgICBpZiAoZm5zW2ldICE9PSBmbikgeyBpLS0gfVxuICAgICAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2tzWycqJ10gJiYgbmFtZSAhPSAnKicpXG4gICAgICAgICAgICBlbC50cmlnZ2VyLmFwcGx5KGVsLCBbJyonLCBuYW1lXS5jb25jYXQoYXJncykpXG5cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGVsXG5cbn1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgLy8gc3VwcG9ydCBDb21tb25KUywgQU1EICYgYnJvd3NlclxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICAgIG1vZHVsZS5leHBvcnRzID0gb2JzZXJ2YWJsZVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JzZXJ2YWJsZSB9KVxuICBlbHNlXG4gICAgd2luZG93Lm9ic2VydmFibGUgPSBvYnNlcnZhYmxlXG5cbn0pKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQpOyIsImltcG9ydCBPYnNlcnZhYmxlIGZyb20gJ3Jpb3Qtb2JzZXJ2YWJsZSdcblxudmFyIEhXID0gdW5kZWZpbmVkXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW1iciB7XG5cbiAgICBfcmVxdWVzdElkID0gMFxuXG4gICAgX3Byb21pc2VzID0ge31cblxuICAgIF9iYXNrZXQgPSB7fVxuXG4gICAgZ2V0IEhXKCl7XG4gICAgICAgIHJldHVybiBIV1xuICAgIH1cblxuICAgIGdldCAkKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9iYXNrZXRcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihIaWdod2F5SW5zdGFuY2Upe1xuICAgICAgICBIVyA9IEhpZ2h3YXlJbnN0YW5jZVxuICAgICAgICBIVy5zdWIoJ0NoYW1ici0+RXhwb3NlJywgZXhwb3NlRXZlbnQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdDaGFtYnI6IEluY29taW5nIGV4cG9zZScsIGV4cG9zZUV2ZW50KVxuICAgICAgICAgICAgbGV0IGV4cG9zZURhdGEgPSAgZXhwb3NlRXZlbnQuZGF0YVxuICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy4kW2V4cG9zZURhdGEubW9kZWxOYW1lXSA9IHRoaXMuYXBwbHlBcGkoZXhwb3NlRGF0YSlcblxuICAgICAgICAgICAgSFcuc3ViKGBDaGFtYnItPiR7ZXhwb3NlRGF0YS5tb2RlbE5hbWV9YCwgbW9kZWxFdmVudCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGQgICAgICAgICAgICAgPSBtb2RlbEV2ZW50LmRhdGFcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VTdGF0ZSA9IGQucmVzcG9uc2VTdGF0ZVxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZUlkICAgID0gZC5yZXNwb25zZUlkXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlRGF0YSAgPSBkLnJlc3BvbnNlRGF0YVxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZVNvZnQgID0gZC5yZXNwb25zZVNvZnRcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWxEYXRhICAgICA9IGQubW9kZWxEYXRhXG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsRXhwb3J0ICAgPSBkLm1vZGVsRXhwb3J0XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVsRGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiBtb2RlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5oYXNPd25Qcm9wZXJ0eShrKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbW9kZWxba11cblxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG1vZGVsLCBtb2RlbERhdGEpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlU3RhdGUgJiYgcmVzcG9uc2VJZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWV0aG9kcyA9IHRoaXMuX3Byb21pc2VzW3Jlc3BvbnNlSWRdXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHMgJiYgbWV0aG9kc1ttb2RlbEV2ZW50LnN0YXRlXS5jYWxsKG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZURhdGEgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzcG9uc2VEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtb2RlbERhdGFcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvbWlzZXNbcmVzcG9uc2VJZF1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIG1vZGVsRXhwb3J0KXtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gaGFzIG93biBwcm9wIGNoZWNrIG5lZWRlZCFcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSBtb2RlbEV4cG9ydFtuYW1lXVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1vZGVsLnRyaWdnZXIobW9kZWxFdmVudC5uYW1lLCBtb2RlbEV2ZW50LmRhdGEpXG4gICAgICAgICAgICAgICAgbW9kZWwudHJpZ2dlcihtb2RlbEV2ZW50LnN0YXRlLCBtb2RlbEV2ZW50LmRhdGEpXG4gICAgICAgICAgICAgICAgbW9kZWwudHJpZ2dlcihyZXNwb25zZVNvZnQgPyAnc29mdCcgOiAnaGFyZCcsIGQpXG4gICAgICAgICAgICAgICAgIXJlc3BvbnNlU29mdCAmJiBtb2RlbC50cmlnZ2VyKCd1cGRhdGVkJywgZClcbiAgICAgICAgICAgICAgICByZXNwb25zZVN0YXRlICYmIG1vZGVsLnRyaWdnZXIocmVzcG9uc2VTdGF0ZSwgZClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXBwbHlBcGkoZXhwb3NlRGF0YSl7XG4gICAgICAgIGxldCBkID0gdGhpcy5hcHBseUFwaVZhbHVlKGV4cG9zZURhdGEubW9kZWxOYW1lLCB7XG4gICAgICAgICAgICBuYW1lOiAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgdHlwZTogJ2ZuJ1xuICAgICAgICB9KVxuICAgICAgICBPYmplY3QuYXNzaWduKGQsIGV4cG9zZURhdGEubW9kZWxEYXRhKVxuICAgICAgICBleHBvc2VEYXRhLm1vZGVsQXBpLmZvckVhY2goYXBpRGF0YSA9PiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZCwgYXBpRGF0YS5uYW1lLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuYXBwbHlBcGlWYWx1ZShleHBvc2VEYXRhLm1vZGVsTmFtZSwgYXBpRGF0YSlcbiAgICAgICAgfSkpXG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlKGQpXG4gICAgfVxuXG4gICAgYXBwbHlBcGlWYWx1ZShuYW1lLCBhcGlEYXRhKXtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzXG4gICAgICAgIGxldCBtZXRob2QgPSBhcGlEYXRhLm5hbWVcbiAgICAgICAgbGV0IHZhbHVlID0gdW5kZWZpbmVkXG5cbiAgICAgICAgaWYgKGFwaURhdGEudHlwZSA9PT0gJ2ZuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBmdW5jdGlvbiguLi5hcmdMaXN0KXtcbiAgICAgICAgICAgICAgICB0aGlzICYmIHRoaXMudHJpZ2dlciAmJiB0aGlzLnRyaWdnZXIobWV0aG9kKVxuICAgICAgICAgICAgICAgIGxldCBwID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9wcm9taXNlc1srK3RoYXQuX3JlcXVlc3RJZF0gPSB7IHJlc29sdmUsIHJlamVjdCB9XG4gICAgICAgICAgICAgICAgICAgIEhXLnB1YihgQ2hhbWJyLT4ke25hbWV9LT4ke21ldGhvZH1gLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdMaXN0OiBbXS5zbGljZS5jYWxsKGFyZ0xpc3QsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdElkOiB0aGF0Ll9yZXF1ZXN0SWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybiAobWV0aG9kID09PSAnY29uc3RydWN0b3InKSA/IHRoYXQuX2Jhc2tldFtuYW1lXSA6IHBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGRlY29yYXRvciBpbiBhcGlEYXRhLmRlY29yYXRvcnMpIHtcbiAgICAgICAgICAgIGlmICghYXBpRGF0YS5kZWNvcmF0b3JzLmhhc093blByb3BlcnR5KGRlY29yYXRvcikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBhcGlEYXRhLmRlY29yYXRvcnNbZGVjb3JhdG9yXVxuICAgICAgICAgICAgc3dpdGNoKGRlY29yYXRvcil7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVmYXVsdCc6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZGVzY3JpcHRvclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwZWVsJzpcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGxldCBwZWVsTGlzdCA9IGRlc2NyaXB0b3IubGlzdFxuICAgICAgICAgICAgICAgICAgICBldmFsKGB2YWx1ZSA9ICR7ZGVzY3JpcHRvci5mbn1gKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbn0iXX0=
