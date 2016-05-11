import 'babel-polyfill'
import './InitChambrWorker'
import './Test.Model'

console.info('Worker engine started.')

self.HW.pub('Worker->Ready')
