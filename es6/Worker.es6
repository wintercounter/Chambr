import 'babel-polyfill'
import './_Debug.es6'
import Gateway from './Gateway/Worker.es6'
import * as C from './Gateway/_Constants.Shared.es6'
import './Chambr/ActionModel/Notes.es6'

ci('Worker engine started.')

self.GW.pub('Worker->Ready')
