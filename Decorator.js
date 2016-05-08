(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChambrDecorator = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXERlY29yYXRvci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O1FDR2dCO1FBUUE7UUFnQkE7UUFRQTtRQStCQTtBQWxFaEIsSUFBTSxXQUFXLEtBQVg7QUFDTixJQUFNLFVBQVUsSUFBVjs7QUFFQyxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBbUI7QUFDdEIsV0FBTyxVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsVUFBdkIsRUFBa0M7QUFDckMsaUJBQVMsVUFBVCxFQUFxQjtBQUNqQix1QkFBVyxDQUFYO1NBREosRUFFRyxRQUZILEVBRHFDO0tBQWxDLENBRGU7Q0FBbkI7O0FBUUEsU0FBUyxPQUFULEdBQWdDO1FBQWYsMkRBQUsseUJBQVU7O0FBQ25DLFdBQU8sVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQWtDO0FBQ3JDLFlBQUksTUFBTSxXQUFXLEtBQVgsQ0FEMkI7QUFFckMsbUJBQVcsS0FBWCxHQUFtQixZQUFpQjs7OzhDQUFMOzthQUFLOztBQUNoQyxnQkFBSSxJQUFJLElBQUksSUFBSixhQUFTLGFBQVMsS0FBbEIsQ0FBSixDQUQ0QjtBQUVoQyxnQkFBSSxLQUFLLEVBQUUsSUFBRixFQUFRO0FBQ2Isa0JBQUUsSUFBRixDQUFPOzJCQUFNLE1BQUssT0FBTCxDQUFhLEVBQWI7aUJBQU4sQ0FBUCxDQURhO2FBQWpCLE1BR0s7QUFDRCxxQkFBSyxPQUFMLENBQWEsRUFBYixFQURDO2FBSEw7QUFNQSxtQkFBTyxDQUFQLENBUmdDO1NBQWpCLENBRmtCO0tBQWxDLENBRDRCO0NBQWhDOztBQWdCQSxTQUFTLEVBQVQsQ0FBWSxLQUFaLEVBQWtCO0FBQ3JCLFdBQU8sVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQWtDO0FBQ3JDLFlBQUksSUFBSSxPQUFPLHVCQUFQLEdBQWlDLE9BQU8sdUJBQVAs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QUExQixFQW5COEM7Q0FBbEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgVFlQRV9WQVIgPSAndmFyJ1xuY29uc3QgVFlQRV9GTiA9ICdmbidcblxuZXhwb3J0IGZ1bmN0aW9uIERlZmF1bHQodil7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIGRlY29yYXRlKGRlc2NyaXB0b3IsIHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogdlxuICAgICAgICB9LCBUWVBFX1ZBUilcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmlnZ2VyKGV2ID0gJ3VwZGF0ZWQnKXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKXtcbiAgICAgICAgdmFyIG9sZCA9IGRlc2NyaXB0b3IudmFsdWVcbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgbGV0IHIgPSBvbGQuY2FsbCh0aGlzLCAuLi5hcmdzKVxuICAgICAgICAgICAgaWYgKHIgJiYgci50aGVuKSB7XG4gICAgICAgICAgICAgICAgci50aGVuKCgpID0+IHRoaXMudHJpZ2dlcihldikpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoZXYpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gclxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gT24oZXZlbnQpe1xuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3Ipe1xuICAgICAgICBsZXQgYyA9IHRhcmdldC5fb25UcmlnZ2VyRXZlbnRIYW5kbGVycyA9IHRhcmdldC5fb25UcmlnZ2VyRXZlbnRIYW5kbGVycyB8fCB7fVxuICAgICAgICBsZXQgbyA9IGNbZXZlbnRdID0gY1tldmVudF0gfHwgW11cbiAgICAgICAgby5wdXNoKG5hbWUpXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUGVlbCguLi5wZWVsTGlzdCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIHZhciBvbGQgPSBkZXNjcmlwdG9yLnZhbHVlXG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgIGFyZ3MuZm9yRWFjaCgoYXJnLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBlZWxMaXN0W2ldID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIHBlZWxMaXN0W2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IGFyZ1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0ciA9IHBlZWxMaXN0W2ldLnNwbGl0KCctPicpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIuZm9yRWFjaCh4ID0+IHIgPSByW3hdKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIgPT09IHVuZGVmaW5lZCkgdGhyb3cgJ2UnXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKGUpe31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIG9sZC5jYWxsKHRoaXMsIC4uLmFyZ3MpXG4gICAgICAgIH1cblxuICAgICAgICBkZWNvcmF0ZShkZXNjcmlwdG9yLCB7XG4gICAgICAgICAgICBwZWVsOiB7XG4gICAgICAgICAgICAgICAgbGlzdDogcGVlbExpc3QsXG4gICAgICAgICAgICAgICAgZm46IGRlc2NyaXB0b3IudmFsdWUudG9TdHJpbmcoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBUWVBFX0ZOKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEdldFNldChvYmope1xuICAgIGZvciAobGV0IGkgaW4gb2JqKSB7XG4gICAgICAgIG9ialtpXSA9IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tvYmpbaV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbihvKXtcbiAgICAgICAgICAgICAgICB0aGlzW29ialtpXV0gPSBvXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBvYmopXG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZWNvcmF0ZShkZXNjcmlwdG9yLCB2YWx1ZSwgdHlwZSA9IGZhbHNlKXtcbiAgICBpZiAoZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgICAgdGhyb3coJ1lvdSB0cmllZCB0byBhcHBseSBhIGRlY29yYXRvciB0byBhIHNldHRlciB3aGljaCBpcyBub3QgYWxsb3dlZC4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9GTiAmJiBkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICB0aHJvdygnVHJpZWQgdG8gdXNlIGEgZGVjb3JhdG9yIG9uIGEgZ2V0dGVyIHdoaWNoIGlzIG9ubHkgYWxsb3dlZCBvbiBmdW5jdGlvbiB0eXBlcy4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9WQVIgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuICAgICAgICB0aHJvdygnVHJpZWQgdG8gdXNlIGEgZGVjb3JhdG9yIG9uIGEgZnVuY3Rpb24gd2hpY2ggaXMgb25seSBhbGxvd2VkIG9uIGdldHRlcnMuJyk7XG4gICAgfVxuXG4gICAgbGV0IGRlY29yYXRvcnNcblxuICAgIGlmIChkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICBkZWNvcmF0b3JzID0gZGVzY3JpcHRvci5nZXQuZGVjb3JhdG9ycyA9IGRlc2NyaXB0b3IuZ2V0LmRlY29yYXRvcnMgfHwge31cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnMgfHwge31cbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbihkZWNvcmF0b3JzLCB2YWx1ZSlcbn0iXX0=
