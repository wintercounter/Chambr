import Chambr from '../src/Worker.es6'
import { Trigger } from '../src/Decorators.es6'

class Test extends Chambr.Model {
	
	constructor(){
		super()
		this.modelData = ['one', 'two']
	}

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

	delete(index){
		return this.resolve(this.modelData.splice(index, 1))
	}

	_calcPrivate(){

	}
}

Chambr.Model = Test