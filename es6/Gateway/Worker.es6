import Abstract from './_Abstract.Shared.es6'

export default new class Worker extends Abstract {

    constructor(){
        super()
        ci('Gateway Worker started.')
        self.onmessage = ev => this.handle(ev.data)
    }
}