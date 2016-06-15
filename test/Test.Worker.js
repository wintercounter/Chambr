import 'babel-polyfill'
import './InitChambrWorker'
import './Test.Model.Array'
import './Test.Model.Object'
//import './Test.Model.Map'
//import './Test.Model.Set'

console.info('Worker engine started.')

self.HW.pub('Worker->Ready')
