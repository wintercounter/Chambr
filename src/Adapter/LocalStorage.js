import ObjectStorage, { EV, namespace, cache } from './ObjectStorage'
import localforage from 'localforage'

export default class LocalStorage extends ObjectStorage {
	constructor(...args){
		super(...args)
		localforage.getItem(this[namespace]).then(v => {
			this[cache] = JSON.parse(v)
			this.trigger(EV.READY)
		})
		this.on(EV.SET, (k, v) => localforage.setItem(this[namespace], JSON.stringify(this[cache])))
		this.on(EV.REMOVE, (k, v) => localforage.setItem(this[namespace], JSON.stringify(this[cache])))
		this.on(EV.CLEAR, (k, v) => localforage.clear())
	}
}