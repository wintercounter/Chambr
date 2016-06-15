import Chambr from '../../dist/Worker'
import { Trigger, Default, On, Peel } from '../../dist/Decorator'
import { Arr } from '../../dist/Storage'
//import LocalStorage from '../../dist/Adapter/LocalStorage'

/**
 * @extends ModelAbstract
 */
class TestArray extends Chambr.Model {

	@Default(-1)
	get total(){
		return this.data.length
	}
	
	constructor(){
		super(new Arr())
		let data = ['one', 'two']
		this.data.push(...data)
	}

	@Peel('item->value')
	create(value){
		this.data.push(value)
	}

	read(index){
		return this.data[index]
	}

	update(index, value){
		this.data[index] = value
	}

	@Trigger('customEvent')
	delete(index){
		this.data.splice(index, 1)
	}

	triggerOnTest(){
		this.trigger('remoteUpdated')
	}

	@On('remoteUpdated')
	onRemoteUpdated(){

	}

	_calcPrivate(){

	}
}

class TestExtendedArray extends TestArray {
	extended(){}
}

Chambr.Model = TestArray
Chambr.Model = TestExtendedArray