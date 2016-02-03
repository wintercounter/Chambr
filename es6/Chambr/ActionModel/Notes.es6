import Abstract from './_Abstract.es6'
import DB from '../Connectors/CouchDB.es6'
import { ExposeAPI } from '../_Decorators.Shared.es6'

export default new @ExposeAPI
class Notes extends Abstract {

    cache;

    get db(){
        this._db = this._db || new DB({
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
            ce(err)
            return this.reject(err.message)
        }

        return this.resolve('done')
    }

    async add(title){
        try {
            let date = new Date().getTime()
            let res = await this.db.remote.put({
                _id: `doc-${date}`,
                title: title
            })
            return this.resolve('added')
        }
        catch(err){
            return this.reject(err.message)
        }
    }

}