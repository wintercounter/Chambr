'use strict';

require('babel-polyfill');

require('./InitChambrWorker');

require('./Test.Model');

console.info('Worker engine started.');

self.HW.pub('Worker->Ready');