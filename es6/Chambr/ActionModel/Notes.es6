import Abstract from '../ModelAbstract.es6'
import Chambr from '../Worker.es6'
import DB from '../Adapters/CouchDB.es6'
import { On } from '../Decorators.es6'

export default class Notes extends Abstract {

    cache;

    get db(){
        this._db = this._db || new DB(this, {
            name: 'notes',
            sync: true,
            watch: false
        })
        return this._db
    }

    async load(){
        try {
            this.cache = await this.db.local.allDocs({
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

    @On('sanyi')
    async add(title){
        try {
            let date = parseInt(new Date().getTime() / 1000, 10)
            await this.db.local.put({
                _id: `doc-${date}`,
                title: title,
                added: date
            })
            await this.load()
            return this.resolve()
        }
        catch(err){
            return this.reject(err.message)
        }
    }

    async delete(id){
        try {
            let doc = await this.db.local.get(id)
            await this.db.local.remove(doc)
            await this.load()
            return this.resolve()
        }
        catch(err){
            return this.reject(err.message)
        }
    }

    async setColor(id, color){
        try {
            let doc = await this.db.local.get(id)
            doc.color = color
            await this.db.local.put(doc)
            await this.load()
            return this.resolve()
        }
        catch(err){
            return this.reject(err.message)
        }
    }
}

Chambr.Model = Notes