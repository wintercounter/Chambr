export default class {

	length = 0;

	every(){

	}

	fetch(keys){
		let result = {}
	}

	filter(fn, thisArg){
		let result = {}
		let keys = Object.keys(this).filter(k => {
			return fn.call(thisArg || this, this[k])
		})
	}

	forEach(fn, thisArg){
		Object.keys(this).forEach(k => {
			fn.call(thisArg || this, this[k])
		})
		return this
	}

}