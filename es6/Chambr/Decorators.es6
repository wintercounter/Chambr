const TYPE_VAR = 'var'
const TYPE_FN = 'fn'

export function Default(v){
    return function(target, name, descriptor){
        decorate(descriptor, {
            'default': v
        }, TYPE_VAR)
    }
}

export function Trigger(){
    return function(target, name, descriptor){
        var old = descriptor.value
        descriptor.value = function(...args){
            return old.call(this, ...args)
        }
    }
}

export function On(event){
    return function(target, name, descriptor){
        let c = target._onTriggerEventHandlers = target._onTriggerEventHandlers || {}
        let o = c[event] = c[event] || []
        o.push(name)
    }
}

export function Peel(...peelList){
    return function(target, name, descriptor){
        decorate(descriptor, {
            peel: peelList
        }, TYPE_FN)

        var old = descriptor.value
        descriptor.value = function(...args){
            args.forEach((arg, i) => {
                typeof arg === 'object'
                && peelList[i]
                && (args[i] = peel(arg, peelList[i]))
            })
            return old.call(this, ...args)
        }
    }
}

function peel(obj, str) {
    let r = obj
    str = str.split('->')
    str.forEach(x => r = obj[x])
    return r === undefined ? obj : r
}

export function ItemAccess(){
    return function(target, name, descriptor){
        decorate(descriptor, {
            itemAccess: true
        }, TYPE_FN)
    }
}

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