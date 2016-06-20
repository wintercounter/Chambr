'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
    var ev = arguments.length <= 0 || arguments[0] === undefined ? 'update' : arguments[0];

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
                try {
                    if (args[peelArgIndex]) {
                        (function () {
                            var r = args[peelArgIndex];
                            var str = peel.split('->');
                            str.forEach(function (x) {
                                return r = r[x];
                            });
                            if (r === undefined) throw 'e';
                            finalArgs[i] = r;
                        })();
                    }
                } catch (e) {}
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