import Abstract from '../ModelAbstract.es6'
import Chambr from '../Worker.es6'
import DB from '../Adapters/CouchDB.es6'
import { Default, On, Trigger } from '../Decorators.es6'

export default class Todo extends Abstract {

	cache;

	@Default(0)
	get total(){
		return this.modelData.length
	}

	@Default(0)
	get uncompleted(){
		return this.modelData.filter(item => item.doc.status === 'uncompleted').length
	}

	get _db(){
		this._dbInstance = this._dbInstance || new DB(this, {
			name: 'todo',
			sync: true,
			watch: false
		})
		return this._dbInstance
	}

	constructor(){
		super()
		this.load()
	}

	@On(DB.EVENT.CHANGE)
	@Trigger()
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
		this.modelData
			.filter(item => d.doc.status === 'completed')
			.forEach(item => this.delete(item.id))
	}

	all(status){
		for (let i in this.modelData) {
			this.set(this.modelData[i].id, 'status', status)
		}
	}
}

Chambr.Model = Todo