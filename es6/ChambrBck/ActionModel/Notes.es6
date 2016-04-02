import Abstract from '../_Abstract.es6'
import DB from '../Connectors/CouchDB.es6'
import { ExposeAPI } from '../_Decorators.Shared.es6'

export default new @ExposeAPI
class Notes extends Abstract {

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
            this.data = this.cache.rows
        }
        catch(err){
            return this.reject(err.message)
        }
        return this.resolve('done', true)
    }

    async add(title){
        try {
            let date = parseInt(new Date().getTime() / 1000, 10)
            await this.db.remote.put({
                _id: `doc-${date}`,
                title: title,
                added: date
            })
            return this.resolve('added')
        }
        catch(err){
            return this.reject(err.message)
        }
    }

    async delete(id){
        try {
            await this.db.local.get(id).then(doc => this.db.remote.remove(doc))
            return this.resolve('deleted')
        }
        catch(err){
            return this.reject(err.message)
        }
    }

    async setColor(id, color){
        try {
            let doc = await this.db.local.get(id)
            doc.color = color
            await this.db.remote.put(doc)
            return this.resolve('done')
        }
        catch(err){
            return this.reject(err.message)
        }
    }

}