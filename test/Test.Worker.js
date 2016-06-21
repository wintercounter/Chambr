import 'babel-polyfill'
import './InitChambrWorker'
import './Test.Model.Array'
import './Test.Model.Object'

console.info('Worker engine started.')

self.HW.pub('Worker->Ready')
