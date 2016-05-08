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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXERlY29yYXRvci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O1FDR2dCO1FBUUE7UUFnQkE7UUFRQTtRQW9DQTtRQWlCQTtBQXhGaEIsSUFBTSxXQUFXLEtBQVg7QUFDTixJQUFNLFVBQVUsSUFBVjs7QUFFQyxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBbUI7QUFDdEIsV0FBTyxVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsVUFBdkIsRUFBa0M7QUFDckMsaUJBQVMsVUFBVCxFQUFxQjtBQUNqQix1QkFBVyxDQUFYO1NBREosRUFFRyxRQUZILEVBRHFDO0tBQWxDLENBRGU7Q0FBbkI7O0FBUUEsU0FBUyxPQUFULEdBQWdDO1FBQWYsMkRBQUsseUJBQVU7O0FBQ25DLFdBQU8sVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQWtDO0FBQ3JDLFlBQUksTUFBTSxXQUFXLEtBQVgsQ0FEMkI7QUFFckMsbUJBQVcsS0FBWCxHQUFtQixZQUFpQjs7OzhDQUFMOzthQUFLOztBQUNoQyxnQkFBSSxJQUFJLElBQUksSUFBSixhQUFTLGFBQVMsS0FBbEIsQ0FBSixDQUQ0QjtBQUVoQyxnQkFBSSxLQUFLLEVBQUUsSUFBRixFQUFRO0FBQ2Isa0JBQUUsSUFBRixDQUFPOzJCQUFNLE1BQUssT0FBTCxDQUFhLEVBQWI7aUJBQU4sQ0FBUCxDQURhO2FBQWpCLE1BR0s7QUFDRCxxQkFBSyxPQUFMLENBQWEsRUFBYixFQURDO2FBSEw7QUFNQSxtQkFBTyxDQUFQLENBUmdDO1NBQWpCLENBRmtCO0tBQWxDLENBRDRCO0NBQWhDOztBQWdCQSxTQUFTLEVBQVQsQ0FBWSxLQUFaLEVBQWtCO0FBQ3JCLFdBQU8sVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQWtDO0FBQ3JDLFlBQUksSUFBSSxPQUFPLHVCQUFQLEdBQWlDLE9BQU8s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QUNoQixjQUFNLGtFQUFOLENBRGdCO0tBQXBCLE1BR0ssSUFBSSxTQUFTLE9BQVQsSUFBb0IsV0FBVyxHQUFYLEVBQWdCO0FBQ3pDLGNBQU0sK0VBQU4sQ0FEeUM7S0FBeEMsTUFHQSxJQUFJLFNBQVMsUUFBVCxJQUFxQixXQUFXLEtBQVgsRUFBa0I7QUFDNUMsY0FBTSwwRUFBTixDQUQ0QztLQUEzQzs7QUFJTCxRQUFJLG1CQUFKLENBWDhDOztBQWE5QyxRQUFJLFdBQVcsR0FBWCxFQUFnQjtBQUNoQixxQkFBYSxXQUFXLEdBQVgsQ0FBZSxVQUFmLEdBQTRCLFdBQVcsR0FBWCxDQUFlLFVBQWYsSUFBNkIsRUFBN0IsQ0FEekI7S0FBcEIsTUFHSztBQUNELHFCQUFhLFdBQVcsS0FBWCxDQUFpQixVQUFqQixHQUE4QixXQUFXLEtBQVgsQ0FBaUIsVUFBakIsSUFBK0IsRUFBL0IsQ0FEMUM7S0FITDtBQU1BLGFBQWMsVUFBZCxFQUEwQixLQUExQixFQW5COEM7Q0FBbEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgVFlQRV9WQVIgPSAndmFyJ1xuY29uc3QgVFlQRV9GTiA9ICdmbidcblxuZXhwb3J0IGZ1bmN0aW9uIERlZmF1bHQodil7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIGRlY29yYXRlKGRlc2NyaXB0b3IsIHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogdlxuICAgICAgICB9LCBUWVBFX1ZBUilcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmlnZ2VyKGV2ID0gJ3VwZGF0ZWQnKXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKXtcbiAgICAgICAgdmFyIG9sZCA9IGRlc2NyaXB0b3IudmFsdWVcbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgbGV0IHIgPSBvbGQuY2FsbCh0aGlzLCAuLi5hcmdzKVxuICAgICAgICAgICAgaWYgKHIgJiYgci50aGVuKSB7XG4gICAgICAgICAgICAgICAgci50aGVuKCgpID0+IHRoaXMudHJpZ2dlcihldikpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoZXYpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gclxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gT24oZXZlbnQpe1xuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3Ipe1xuICAgICAgICBsZXQgYyA9IHRhcmdldC5fb25UcmlnZ2VyRXZlbnRIYW5kbGVycyA9IHRhcmdldC5fb25UcmlnZ2VyRXZlbnRIYW5kbGVycyB8fCB7fVxuICAgICAgICBsZXQgbyA9IGNbZXZlbnRdID0gY1tldmVudF0gfHwgW11cbiAgICAgICAgby5wdXNoKG5hbWUpXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUGVlbCguLi5wZWVsTGlzdCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIHZhciBvbGQgPSBkZXNjcmlwdG9yLnZhbHVlXG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgIGxldCBmaW5hbEFyZ3MgPSBhcmdzLnNsaWNlKClcbiAgICAgICAgICAgIHBlZWxMaXN0LmZvckVhY2goKHBlZWwsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGVlbEFyZ0luZGV4ID0gaVxuICAgICAgICAgICAgICAgIGlmIChwZWVsLmluZGV4T2YoJzonKSsxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0bXAgPSBwZWVsLnNwbGl0KCc6JylcbiAgICAgICAgICAgICAgICAgICAgcGVlbEFyZ0luZGV4ID0gcGFyc2VJbnQodG1wWzBdLCAxMClcbiAgICAgICAgICAgICAgICAgICAgcGVlbCA9IHRtcFsxXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbcGVlbEFyZ0luZGV4XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gYXJnc1twZWVsQXJnSW5kZXhdXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gcGVlbC5zcGxpdCgnLT4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyLmZvckVhY2goeCA9PiByID0gclt4XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyID09PSB1bmRlZmluZWQpIHRocm93ICdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxBcmdzW2ldID0gclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKGUpe31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgZmluYWxBcmdzLmZvckVhY2goKHYsIGkpID0+IGFyZ3NbaV0gPSB2KVxuICAgICAgICAgICAgcmV0dXJuIG9sZC5jYWxsKHRoaXMsIC4uLmFyZ3MpXG4gICAgICAgIH1cblxuICAgICAgICBkZWNvcmF0ZShkZXNjcmlwdG9yLCB7XG4gICAgICAgICAgICBwZWVsOiB7XG4gICAgICAgICAgICAgICAgbGlzdDogcGVlbExpc3QsXG4gICAgICAgICAgICAgICAgZm46IGRlc2NyaXB0b3IudmFsdWUudG9TdHJpbmcoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBUWVBFX0ZOKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEdldFNldChvYmope1xuICAgIGZvciAobGV0IGkgaW4gb2JqKSB7XG4gICAgICAgIG9ialtpXSA9IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tvYmpbaV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbihvKXtcbiAgICAgICAgICAgICAgICB0aGlzW29ialtpXV0gPSBvXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBvYmopXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gRW1wdHkoKXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKXtcbiAgICAgICAgZGVjb3JhdGUoZGVzY3JpcHRvciwge1xuICAgICAgICAgICAgZW1wdHk6IHRydWVcbiAgICAgICAgfSwgVFlQRV9GTilcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlY29yYXRlKGRlc2NyaXB0b3IsIHZhbHVlLCB0eXBlID0gZmFsc2Upe1xuICAgIGlmIChkZXNjcmlwdG9yLnNldCkge1xuICAgICAgICB0aHJvdygnWW91IHRyaWVkIHRvIGFwcGx5IGEgZGVjb3JhdG9yIHRvIGEgc2V0dGVyIHdoaWNoIGlzIG5vdCBhbGxvd2VkLicpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlID09PSBUWVBFX0ZOICYmIGRlc2NyaXB0b3IuZ2V0KSB7XG4gICAgICAgIHRocm93KCdUcmllZCB0byB1c2UgYSBkZWNvcmF0b3Igb24gYSBnZXR0ZXIgd2hpY2ggaXMgb25seSBhbGxvd2VkIG9uIGZ1bmN0aW9uIHR5cGVzLicpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlID09PSBUWVBFX1ZBUiAmJiBkZXNjcmlwdG9yLnZhbHVlKSB7XG4gICAgICAgIHRocm93KCdUcmllZCB0byB1c2UgYSBkZWNvcmF0b3Igb24gYSBmdW5jdGlvbiB3aGljaCBpcyBvbmx5IGFsbG93ZWQgb24gZ2V0dGVycy4nKTtcbiAgICB9XG5cbiAgICBsZXQgZGVjb3JhdG9yc1xuXG4gICAgaWYgKGRlc2NyaXB0b3IuZ2V0KSB7XG4gICAgICAgIGRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLmdldC5kZWNvcmF0b3JzID0gZGVzY3JpcHRvci5nZXQuZGVjb3JhdG9ycyB8fCB7fVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZGVjb3JhdG9ycyA9IGRlc2NyaXB0b3IudmFsdWUuZGVjb3JhdG9ycyA9IGRlc2NyaXB0b3IudmFsdWUuZGVjb3JhdG9ycyB8fCB7fVxuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKGRlY29yYXRvcnMsIHZhbHVlKVxufSJdfQ==
