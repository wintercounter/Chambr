import observable from 'riot-observable'
import contentful from 'contentful'

const ClientInstances = {}
const _request = Symbol()

export default class ContentfulAdapter {

	static EV = {
		LOADING : 'loading',
		DONE    : 'done'
	}

	static getClientInstance(config){
		let k = config.accessToken + config.space
		ClientInstances[k] = ClientInstances[k] || contentful.createClient(config)
	}

	requestCount = 0

	constructor (config = {}, host) {
		observable(this)
		this.client = ContentfulAdapter.getClientInstance(config)
	}

	getSpace(...args){
		return this[_request]('getSpace', args)
	}

	getContentType(...args){
		return this[_request]('getContentType', args)
	}

	getContentTypes(...args){
		return this[_request]('getContentTypes', args)
	}

	getEntry(...args){
		return this[_request]('getEntry', args)
	}

	getEntries(...args){
		return this[_request]('getEntries', args)
	}

	getAsset(...args){
		return this[_request]('getAsset', args)
	}

	getAssets(...args){
		return this[_request]('getAssets', args)
	}

	sync(...args){
		return this[_request]('sync', args)
	}

	[_request](method, args){
		// Trigger loading only once
		!(++this.requestCount - 1) && this.trigger(ContentfulAdapter.EV.LOADING)

		return this.client[method](...args)
			.then(result => {
				!--this.requestCount && this.trigger(ContentfulAdapter.EV.DONE)
				return result
			})
	}
}