import observable from 'riot-observable'

export const ACTION_SIMPLE_SET  = 'action-simple-set'
export const ACTION_SIMPLE_DEL  = 'action-simple-delete'
export const ACTION_COMPLEX     = 'action-complex'
export const UPDATE             = 'update'

const M = Map
const S = Set

/**
 * Array Type
 * @param {Array} input Default array values
 * @constructor
 */
export function Arr(input = []){
    return Simple(input)
}

/**
 * Object Type
 * @param {Object} input Default object values
 * @constructor
 */
export function Obj(input = {}){
    return Simple(input)
}

/**
 * Map Type
 * @param {Map} input Default map values
 * @constructor
 */
export function Map(input = new M()) {
    return Complex(input)
}

/**
 * Set Type
 * @param {Set} input Default set values
 * @constructor
 */
export function Set(input = new S()) {
    return Complex(input)
}

/**
 * Generates a Proxy object for an Array or Object.
 * Makes data observable.
 *
 * @param {Array|Object} type Initial data object.
 * @returns {Proxy}
 * @constructor
 */
function Simple(type){
    observable(type)
    // @TODO Compact callbacks
    type = new Proxy(type, {
        set: function(target, name, value){
            let r = (target[name] = value)
            // No need to trigger array length change
            if (name !== 'length') {
                type.trigger(ACTION_SIMPLE_SET, name, value)
                type.trigger(UPDATE)
            }
            return r
        },
        deleteProperty: function(target, name, value){
            delete target[name]
            type.trigger(ACTION_SIMPLE_DEL, name, value)
            type.trigger(UPDATE)
            return true
        }
    })
    return type
}

/**
 * Overrides Map/Set methods for to be able
 * to trigger certain event on their calls.
 * Makes data observable.
 *
 * @param {Map|Set} type Initial data object
 * @returns {Map|Set}
 * @constructor
 */
function Complex(type){
    observable(type)
    ['clear', 'delete', 'set'].forEach(method => {
        let m = type[`_${method}`] = type[method]
        type[method] = function(...args){
            m.call(this, args)
            type.trigger(ACTION_COMPLEX, method, ...args)
            type.trigger(method)
            type.trigger(UPDATE)
        }
    })
    return type
}