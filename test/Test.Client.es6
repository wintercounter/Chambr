import 'babel-polyfill'
import Highway from 'Highway'
import Chambr from '../src/Client.es6'
let Host = new self.Worker('./Test.Worker.js')
let HW = new Highway(Host)
let CH = new Chambr(HW)

self.$ = CH.$

HW.sub('Worker->Ready', () => {
    console.info('Start test')
    mocha.run()
})

console.info('Site engine started.')
