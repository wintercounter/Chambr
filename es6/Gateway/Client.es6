import Abstract from './_Abstract.Shared.es6'

export default new class Client extends Abstract {

    Worker;

    get Promise(){
        return this._promise
    }

    set Promise(p){
        this._promise = p
    }

    constructor(){
        super()
        ci('Gateway Client started.')
        this.start('dist/worker.js')
    }

    start(worker){
        this.Promise = new Promise((resolve) => {
            this.Worker = new Worker(worker)
            this.Worker.addEventListener('message', (ev) => {
                resolve(ev.data)
                this.handle(ev.data)
            }, true)
        })
    }
}