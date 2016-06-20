import Highway from 'Highway'
import WebWorkerProxy from 'Highway/dist/Proxy/WebWorker'
import Chambr from '../../dist/Worker'

self.HW = self.HW || new Highway(new WebWorkerProxy(self))
self.CH = new Chambr(self.HW)