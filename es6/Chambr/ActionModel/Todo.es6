import ModelAbstract from '../ModelAbstract.es6'
import Chambr from '../Worker.es6'
import DB from '../Adapters/CouchDB.es6'
import { Default, On, Trigger, Peel } from '../Decorators.es6'

const STATUS_COMPLETED   = 'completed'
const STATUS_UNCOMPLETED = 'uncompleted'

export default class Todo extends ModelAbstract {

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
		text = text.trim()
		if (!text) {
			return this.reject('Text cannot be empty.')
		}

		try {
			let date = parseInt(new Date().getTime() / 1000, 10)
			await this._db.local.put({
				_id: `doc-${date}`,
				text,
				status: STATUS_UNCOMPLETED
			})
			return this.resolve()
		}
		catch(err){
			return this.reject(err.message)
		}
	}

	@Peel('item->v->id')
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

	@Peel('item->v->id')
	async toggle(id){
		let doc = await this._db.local.get(id)
		return await this.set(id, 'status', doc.status === STATUS_UNCOMPLETED ? STATUS_COMPLETED : STATUS_UNCOMPLETED)
	}

	@Peel('target->checked')
	toggleAll(isCompleted = false){
		this.modelData.forEach(item => this.set(item.id, 'status', isCompleted ? STATUS_COMPLETED : STATUS_UNCOMPLETED))
	}

	@Peel(null)
	clear(){
		this.modelData
			.filter(item => item.doc.status === STATUS_COMPLETED)
			.forEach(item => this.delete(item.id))
	}
}

Chambr.Model = Todo