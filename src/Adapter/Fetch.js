import Observable from 'riot-observable'

export const EV = {
	SUCCESS: 'fetch-success',
	ERROR  : 'fetch-error',
	LOADING: 'fetch-loading',
	STATE  : 'fetch-state'
}

export const STATE = {
	CALM   : 'state-calm',
	LOADING: 'state-loading'
}

export const DEFAULTS = {
	base: location.origin,
	cache: false,
	responseFormat: JSON,
	headers: {},

	// TODO
	single: true
}

export const config        = Symbol()
export const buildUrl      = Symbol()
export const parseResponse = Symbol()
export const parseData     = Symbol()
export const handleError   = Symbol()
export const inProgress    = Symbol()

const bind  = Symbol()
const state = Symbol()

class Fetch {

	get state(){
		return this[state] || STATE.CALM
	}

	constructor(cnf = DEFAULTS){
		Observable(this)
		this[config] = Object.assign(this[config], cnf)
		this[inProgress] = {
			_id: 0,
			promises: {}
		}
		this[bind]()
	}

	request(r){
		return ((routing) => {
			let id = this[inProgress]._id++
			let promise = Promise((resolve, reject) => {
				let url = this[buildUrl](routing)
				this.trigger(EV.LOADING, {id, url, routing})
				fetch(url)
					.then(::this[parseResponse])
					.then(::this[parseData])
					.then(data => resolve(data))
					.catch(err => reject(this.handleError(err)))
			})
			this[inProgress].promises[id] = promise
			promise.then(data => {
				this.trigger(EV.SUCCESS, data, id)
				return data
			})
			promise.catch(err => {
				this.trigger(EV.ERROR, err, id)
				throw err
			})
			return promise
		})(r)
	}

	[buildUrl](routing){
		return `${this[config].base}/${routing}`
	}

	[parseResponse](response){
		return response
	}

	[parseData](response){
		return response
	}

	[bind](){
		this.on(EV.LOADING, () => {
			this[state] !== STATE.LOADING && this.trigger(EV.STATE, STATE.LOADING)
			this[state] = STATE.LOADING
		})

		this.on(EV.SUCCESS, (data, id) => {
			delete this[inProgress].promises[id]
			if (Object.keys(this[inProgress].promises).length) return
			this[state] !== STATE.CALM && this.trigger(EV.STATE, STATE.CALM)
			this[state] = STATE.CALM
		})

		this.on(EV.ERROR, (data, id) => {
			delete this[inProgress].promises[id]
			if (Object.keys(this[inProgress].promises).length) return
			this[state] !== STATE.CALM && this.trigger(EV.STATE, STATE.CALM)
			this[state] = STATE.CALM
		})
	}
}

export default Fetch