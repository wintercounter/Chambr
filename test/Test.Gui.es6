import 'babel-polyfill'
import Highway from 'Highway'
import Chambr from '../dist/Gui'
let Host = new self.Worker('./dist/Test.Worker')
let HW = new Highway(Host)
let CH = new Chambr(HW)

self.$ = CH.$

HW.sub('Worker->Ready', () => {
    console.info('Start test')
    mocha.run()
})

console.info('Site engine started.')
