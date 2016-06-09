import observable from 'riot-observable'

export const ACTION_SIMPLE  = 'action-simple'
export const ACTION_COMPLEX = 'action-complex'
export const UPDATE         = 'update'

const M = Map
const S = Set
const A = Array
const O = Object

export function Array(input = []){
	return Simple(input)
}

export function Object(input = {}){
	return Simple(input)
}

export function Map(input = new M()) {
	return Complex(input)
}

export function Set(input = new S()) {
	return Complex(input)
}

function Simple(type){
	observable(type)
	type = new Proxy(type, {
		set: function(target, name, value){
			let r = (target[name] = value)
			type.trigger(ACTION_SIMPLE, name, value)
			type.trigger(UPDATE)
			return r
		},
		deleteProperty: function(target, name, value){
			// On array we don't need delete, set will do the job perfectly.
			if (!(target instanceof A)) {
				let r = (target[name] = value)
				type.trigger(ACTION_SIMPLE, name, value)
				type.trigger(UPDATE)
				return r
			}
		}
	})
	return type
}

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