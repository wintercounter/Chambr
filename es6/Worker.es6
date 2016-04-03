import 'babel-polyfill'
import './_Debug.es6'
import 'hwjs'
import './HWInit.es6'
//import './Chambr/ActionModel/Notes.es6'
import './Chambr/ActionModel/Todo.es6'

ci('Worker engine started.')

self.HW.pub('Worker->Ready')
