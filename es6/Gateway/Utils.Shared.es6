import * as C from './_Constants.Shared.es6'

export function buildRoute (){
    if(
        arguments
        && (arguments[0].indexOf(C.EVENT_CLIENT) === 0
        || arguments[0].indexOf(C.EVENT_WORKER) === 0)
    ){
        return arguments[0]
    }
    return [self.document && self.document.querySelector ? C.EVENT_CLIENT : C.EVENT_WORKER]
        .concat(Array.prototype.filter.call(arguments, Boolean))
        .join(C.EVENT_DELIMITER)
}

export function registerHelper(name, handler, Handlers){
    // Extract segments
    let segments = []
    segments.push(self.document ? C.EVENT_CLIENT : C.EVENT_WORKER)
    segments.concat(name.split(C.EVENT_DELIMITER))

    // Apply segments and prototype
    let temp = Handlers
    segments.forEach((k, i, a) => {
        if (!temp.hasOwnProperty(k)) {
            temp[k] = {
                handlers: []
            }
        }
        temp = temp[k]
        ++i === a.length && temp.handlers.push(handler)
    })
}

export function parseRoute(route, Handlers){
    let parsed = Handlers
    route.split(C.EVENT_DELIMITER).forEach((s) => {
        parsed.hasOwnProperty(s) && (parsed = parsed[s])
    })
}

export function handlerHelper(Handlers, ev){
    let parsed = parseRoute(ev.name, Handlers)
    applyHandlers(parsed, ev)
}

function applyHandlers(obj, ev){
    for (let i in obj) {
        if (obj.hasOwnProperty(i)){
            typeof obj[i] === 'object'
            && handlerHelper(obj[i], ev)

            (i = obj.handlers)
            && i.length
            && i.forEach((fn) => fn.apply(null, ev))
        }
    }
}