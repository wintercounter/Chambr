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
                r.then(() => this.trigger(ev))
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
            let finalArgs = args.slice()
            peelList.forEach((peel, i) => {
                let peelArgIndex = i
                if (peel.indexOf(':')+1) {
                    let tmp = peel.split(':')
                    peelArgIndex = parseInt(tmp[0], 10)
                    peel = tmp[1]
                }
                if (typeof args[peelArgIndex] === 'object') {
                    try {
                        let r = args[peelArgIndex]
                        let str = peel.split('->')
                        str.forEach(x => r = r[x])
                        if (r === undefined) throw 'e'
                        finalArgs[i] = r
                    }
                    catch(e){}
                }
            })
            return old.call(this, ...finalArgs)
        }

        decorate(descriptor, {
            peel: {
                list: peelList,
                fn: descriptor.value.toString()
            }
        }, TYPE_FN)
    }
}

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

export function Empty(){
    return function(target, name, descriptor){
        decorate(descriptor, {
            empty: true
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