const TYPE_VAR = 'var'
const TYPE_FN = 'fn'

export function Default(v){
    return function(target, name, descriptor){
        decorate(descriptor, {
            'default': v
        }, TYPE_VAR)
    }
}

export function Trigger(ev = 'updated'){
    return function(target, name, descriptor){
        var old = descriptor.value
        descriptor.value = function(...args){
            let r = old.call(this, ...args)
            if (r && r.then) {
                r.then(() => {
                    this.trigger(ev)
                })
            }
            else {
                this.trigger(ev)
            }
            return r
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
        var old = descriptor.value
        descriptor.value = function(...args){
            args.forEach((arg, i) => {
                if (peelList[i] === null) {
                    args[i] = null
                }
                else if (typeof arg === 'object' && peelList[i]) {
                    try {
                        let r = arg
                        let str = peelList[i].split('->')
                        str.forEach(x => r = r[x])
                        if (r === undefined) throw 'e'
                        args[i] = r
                    }
                    catch(e){}
                }
            })
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