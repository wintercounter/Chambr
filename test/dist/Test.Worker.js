'use strict';

require('babel-polyfill');

require('./InitChambrWorker');

require('./Test.Model.Array');

require('./Test.Model.Object');

//import './Test.Model.Map'
//import './Test.Model.Set'

console.info('Worker engine started.');

self.HW.pub('Worker->Ready');