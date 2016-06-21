import Chambr from '../../dist/Worker'
import { Trigger, Default, On, Peel } from '../../dist/Decorator'
import { Obj } from '../../dist/Storage'

/**
 * @extends ModelAbstract
 */
class TestObject extends Chambr.Instance.Model {

	@Default(-1)
	get total(){
		return Object.keys(this.data).length
	}
	
	constructor(){
		super(new Obj())
		Object.assign(this.data, {0: 'one', 1: 'two'})
	}

	@Peel('item->value')
	create(value){
		this.data[2] = value
	}

	read(index){
		return this.data[index]
	}

	update(index, value){
		this.data[index] = value
	}

	@Trigger('customEvent')
	delete(index){
		delete this.data[index]
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

class TestExtendedObject extends TestObject {
	extended(){}
}

Chambr.Instance.Model = TestObject
Chambr.Instance.Model = TestExtendedObject