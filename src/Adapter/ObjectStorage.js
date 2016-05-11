import Observable from 'riot-observable'

export const EV = {
	SET:     'storage.set',
	REMOVE:  'storage.remove',
	CLEAR:   'storage.clear',
	READY:   'storage.ready'
}

const DELIMITER = '/'
const parse  = Symbol('parse')
export const cache  = Symbol('cache')
const domain = Symbol('domain')
const makeDomain = Symbol('makeDomain')
const host = Symbol('host')
const store = Symbol('store')
export const namespace = Symbol('namespace')

export default class ObjectStorage {

	constructor(hs = undefined, ns = DELIMITER) {
		Observable(this)
		this[namespace] = ns
		this[store]  = undefined
		this[cache]  = {}
		this[host]   = hs
		this[domain] = this[parse](ns)
	}

	get(keys = ''){
		let s = this[cache]
		keys = this[parse](keys)
		for (let k of keys) {
			if (s[k]) {
				s = s[k]
			}
		}
		if (s != this[cache]) {
			return s
		}
		return null
	}

	set(key = '', value){
		let s = this[cache]
		let keys = this[parse](key)
		let l = keys.length
		let i = 0
		for (let k of keys) {
			if (++i === l) {
				s[k] = value
				this.trigger(EV.SET, key, value)
				this[host] && this[host].trigger && this[host].trigger(EV.SET, key, value)
			}
			else if (s[k]) {
				s = s[k]
			}
			else {
				s = s[k] = {}
			}
		}
	}

	remove(key){
		let s = this[cache]
		let keys = this[parse](key)
		let l = keys.length
		let i = 0
		for (let k of keys) {
			if (++i === l && s.hasOwnProperty(k)) {
				delete s[k]
				this.trigger(EV.REMOVE, key, value)
				this[host] && this[host].trigger && this[host].trigger(EV.REMOVE, key, value)
				return
			}
		}
	}

	clear(){
		this[cache] = {}
		this.trigger(EV.CLEAR)
		this[host] && this[host].trigger && this[host].trigger(EV.CLEAR)
	}

	[parse](url){
		return url.split(DELIMITER).filter(e => e)
	}

	[makeDomain](keys = []){
		return `${DELIMITER}${this[domain].concat(keys).join(DELIMITER)}${DELIMITER}`
	}
}