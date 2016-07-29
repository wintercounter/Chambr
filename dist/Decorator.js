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
/**
 * Some decorators to use with classes, functions and/or variables.
 */

var TYPE_VAR = 'var';
var TYPE_FN = 'fn';

/**
 * Set a default value for a getter,
 * so your model will have a value before initialization.
 *
 * Example:
 *      @Default(-1)
 *      get countTotal(){
 *          return this.data.length
 *      }
 *
 * @param {Any} v The return value of the getter
 * @returns {Function}
 * @constructor
 */
function Default(v) {
    return function (target, name, descriptor) {
        decorate(descriptor, {
            'default': v
        }, TYPE_VAR);
    };
}

/**
 * Every time this function is called,
 * the specified event will be triggered.
 *
 * In case your function returns a promise,
 * trigger will only happen after that promise is resolved.
 *
 * Example:
 *      @Trigger('myFunctionCalled')
 *      myFunction(){
 *          return true
 *      }
 *
 *      myModelInstance.on('myFunctionCalled', value => alert(value))
 *      myModelInstance.myFunction() // alert appears
 *
 * @param {String} ev The name of the event. Default = update
 * @returns {Function}
 * @constructor
 */
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

            // If a promise, wait for resolve
            if (r && r.then) {
                r.then(function (v) {
                    _this.trigger(ev, v);
                    return v;
                });
            } else {
                this.trigger(ev, r);
            }
            return r;
        };
    };
}

/**
 * Trigger this function, when a specific event/function call happens.
 *
 * Example:
 *      @On('myFunctionTwo')
 *      myFunctionOne(){
 *          return true
 *      }
 *
 *      myFunctionTwo(){
 *          return false
 *      }
 *
 *      myModel.myFunctionTwo() // myFunctionOne() is also called
 *
 * @param event
 * @returns {Function}
 * @constructor
 */
function On(event) {
    return function (target, name, descriptor) {
        var c = target._onTriggerEventHandlers = target._onTriggerEventHandlers || {};
        var o = c[event] = c[event] || [];
        o.push(name);
    };
}

/**
 * It extracts parameter from a given object. On the GUI side.
 * Separator is: `->`
 *
 * Example:
 *      @Peel('target->value')
 *      add(value){
 *          this.data.push(value)
 *      }
 *
 *      // Instead of
 *      myDomElement.onclick = function(ev){
 *          model.add(ev.target.value)
 *      }
 *
 *      // It's just
 *      myDomElement.onclick = model.add
 *
 *
 * @param {argList} peelList The list peels as separate parameters.
 *  Example (passing EventObject):
 *      @Peel('target->id', 'target->value', 'target->classNames')
 *      add(id, value, classNames){}
 *
 *      // Specify parameter number (starts at 0)
 *      @Peel('1:target->value')
 *      add(id, value, classNames){}
 *
 * @returns {Function}
 * @constructor
 */
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

            // Convert to array
            var finalArgs = args.slice();
            peelList.forEach(function (peel, i) {
                var peelArgIndex = i;

                // Indexed parameter
                if (peel.indexOf(':') + 1) {
                    var tmp = peel.split(':');
                    peelArgIndex = parseInt(tmp[0], 10);
                    peel = tmp[1];
                }

                // Do Peel
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

            // Override original args
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

// Not working, not finalized yet.
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

/**
 * Decorator helper.
 * - Prevents decorators on setters.
 * - Decides if the decorator is used on a Function or Variable Member
 *
 * @param descriptor Member descriptor
 * @param value      Object defining the Member value
 * @param type       Member type get/set
 * @private
 */
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