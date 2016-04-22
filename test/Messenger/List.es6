import Chambr from '../../src/Worker.es6'
import Fetch from '../../src/Adapter/Fetch.es6'
import { Trigger, Default, On, Peel } from '../src/Decorators.es6'

let load  = Symbol()
let fetch = Symbol()

export default class MessengerList extends Chambr.Model {



	constructor() {
		this[fetch] = new Fetch()
		this[load]()
	}

	@Trigger()
	[load](search = undefined){

	}

}

Chambr.Model = MessengerList