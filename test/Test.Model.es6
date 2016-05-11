import Chambr from '../dist/Worker'
import { Trigger, Default, On, Peel } from '../dist/Decorator'
//import LocalStorage from '../dist/Adapter/LocalStorage'

/**
 * @extends ModelAbstract
 */
class Test extends Chambr.Model {

	@Default(-1)
	get total(){
		return this.modelData.length
	}
	
	constructor(){
		super()
		this.modelData = ['one', 'two']
	}

	@Peel('item->value')
	create(value){
		this.modelData.push(value)
		return this.resolve(this.modelData.length-1)
	}

	read(index){
		return this.modelData[index]
	}

	update(index, value){
		this.modelData[index] = value
		return this.resolve(value)
	}

	@Trigger('customEvent')
	delete(index){
		return this.resolve(this.modelData.splice(index, 1))
	}

	triggerOnTest(){
		this.trigger('remoteUpdated')
	}

	@On('remoteUpdated')
	onRemoteUpdated(){
		return this.resolve()
	}

	_calcPrivate(){

	}
}

class TestExtended extends Test {
	extended(){}
}

Chambr.Model = Test
Chambr.Model = TestExtended