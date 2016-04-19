import 'babel-polyfill'
import './InitChambrWorker.es6'
import './Test.Model.es6'

console.log(self.HW)

console.info('Worker engine started.')

self.HW.pub('Worker->Ready')
