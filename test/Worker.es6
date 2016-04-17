import 'babel-polyfill'
import Highway from './Highway.es6'
import Chambr from '../src/Worker.es6'
//import './Chambr/ActionModel/Todo.es6'

let HW = new Highway(self)
let CH = new Chambr(HW)

console.info('Worker engine started.')

HW.pub('Worker->Ready')
