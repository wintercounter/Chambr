import 'babel-polyfill'
import Highway from 'Highway'
import WebWorkerProxy from 'Highway/dist/Proxy/WebWorker'
import Chambr from '../../dist/Gui'
let Host = new self.Worker('./dist/Test.Worker.js')
let HW = new Highway(new WebWorkerProxy(Host))
let CH = new Chambr(HW)

self.$ = CH.$

HW.sub('Worker->Ready', () => {
    console.info('Start test')
    mocha.run()
})

console.info('Site engine started.')
