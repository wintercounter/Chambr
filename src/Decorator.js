/**
 * Some decorators to use with classes, functions and/or variables.
 */


const TYPE_VAR = 'var'
const TYPE_FN = 'fn'

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
export function Default(v){
    return function(target, name, descriptor){
        decorate(descriptor, {
            'default': v
        }, TYPE_VAR)
    }
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
export function Trigger(ev = 'update'){
    return function(target, name, descriptor){
        var old = descriptor.value
        descriptor.value = function(...args){
            let r = old.call(this, ...args)

            // If a promise, wait for resolve
            if (r && r.then) {
                r.then(v => {
                    this.trigger(ev, v)
                    return v
                })
            }
            else {
                this.trigger(ev, r)
            }
            return r
        }
    }
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
export function On(event){
    return function(target, name, descriptor){
        let c = target._onTriggerEventHandlers = target._onTriggerEventHandlers || {}
        let o = c[event] = c[event] || []
        o.push(name)
    }
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
export function Peel(...peelList){
    return function(target, name, descriptor){
        var old = descriptor.value
        descriptor.value = function(...args){

            // Convert to array
            let finalArgs = args.slice()
            peelList.forEach((peel, i) => {
                let peelArgIndex = i

                // Indexed parameter
                if (peel.indexOf(':')+1) {
                    let tmp = peel.split(':')
                    peelArgIndex = parseInt(tmp[0], 10)
                    peel = tmp[1]
                }

                // Do Peel
                try {
                    if (args[peelArgIndex]) {
                        let r = args[peelArgIndex]
                        let str = peel.split('->')
                        str.forEach(x => r = r[x])
                        if (r === undefined) throw 'e'
                        finalArgs[i] = r
                    }
                }
                catch(e){}
            })

            // Override original args
            finalArgs.forEach((v, i) => args[i] = v)
            return old.call(this, ...args)
        }

        decorate(descriptor, {
            peel: {
                list: peelList,
                fn: descriptor.value.toString()
            }
        }, TYPE_FN)
    }
}

// Not working, not finalized yet.
export function GetSet(obj){
    for (let i in obj) {
        obj[i] = {
            get: function(){
                return this[obj[i]]
            },
            set: function(o){
                this[obj[i]] = o
            }
        }
    }

    return function(target){
        Object.defineProperties(target, obj)
    }
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
function decorate(descriptor, value, type = false){
    if (descriptor.set) {
        throw('You tried to apply a decorator to a setter which is not allowed.');
    }
    else if (type === TYPE_FN && descriptor.get) {
        throw('Tried to use a decorator on a getter which is only allowed on function types.');
    }
    else if (type === TYPE_VAR && descriptor.value) {
        throw('Tried to use a decorator on a function which is only allowed on getters.');
    }

    let decorators

    if (descriptor.get) {
        decorators = descriptor.get.decorators = descriptor.get.decorators || {}
    }
    else {
        decorators = descriptor.value.decorators = descriptor.value.decorators || {}
    }
    Object.assign(decorators, value)
}