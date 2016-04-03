import Abstract from '../ModelAbstract.es6'
import Chambr from '../Worker.es6'
import DB from '../Adapters/CouchDB.es6'
import { Default, On } from '../Decorators.es6'

export default class Todo extends Abstract {

	cache;

	@Default(0)
	get total(){
		return Object.keys(this.modelData).length
	}

	@Default(0)
	get uncompleted(){
		let c = 0
		for (let i in this.modelData) {
			this.modelData[i].doc.status === 'uncompleted' && c++
		}
		return c
	}

	get _db(){
		this._dbInstance = this._dbInstance || new DB(this, {
			name: 'todo',
			sync: true,
			watch: false
		})
		return this._dbInstance
	}

	constructor(){super()
		this.load()
	}

	@On(DB.EVENT.CHANGE)
	async load(){
		try {
			this.cache = await this._db.local.allDocs({
				include_docs: true,
				limit: 100,
				descending: true
			})
			this.modelData = this.cache.rows
		}
		catch(err){
			return this.reject(err.message)
		}
		return this.resolve()
	}

	async add(text){
		try {
			let date = parseInt(new Date().getTime() / 1000, 10)
			await this._db.local.put({
				_id: `doc-${date}`,
				text,
				status: 'uncompleted'
			})
			return this.resolve()
		}
		catch(err){
			return this.reject(err.message)
		}
	}

	async delete(id){
		try {
			let doc = await this._db.local.get(id)
			await this._db.local.remove(doc)
			return this.resolve()
		}
		catch(err){
			return this.reject(err.message)
		}
	}

	async set(id, key, value){
		try {
			let doc = await this._db.local.get(id)
			doc[key] = value
			await this._db.local.put(doc)
			return this.resolve()
		}
		catch(err){
			return this.reject(err.message)
		}
	}

	clear(){
		for (let i in this.modelData) {
			let d = this.modelData[i]
			d.doc.status === 'completed' && this.delete(d.id)
		}
	}

	all(status){
		for (let i in this.modelData) {
			this.set(this.modelData[i].id, 'status', status)
		}
	}
}

Chambr.Model = Todo