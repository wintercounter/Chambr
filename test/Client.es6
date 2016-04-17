import 'babel-polyfill'
import Highway from './Highway.es6'
import Chambr from '../src/Client.es6'
let Host = new self.Worker('./Test.Worker.js')
let HW = new Highway(Host)
let CH = new Chambr(HW)
console.info('Site engine started.')

/**
 * Wait for worker to be ready
 */
HW.sub('Worker->Ready', () => {
    console.log(CH)
})