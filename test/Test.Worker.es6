import 'babel-polyfill'
import './InitChambrWorker.es6'
import './Test.Model.es6'

console.info('Worker engine started.')

self.HW.pub('Worker->Ready')
