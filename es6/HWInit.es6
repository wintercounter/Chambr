/**
 * Start worker
 */
var Host = self.Worker && self.HTMLElement ? new self.Worker('/ChambrGit/dist/worker.js') : self
self.HW = self.HW || new self.Highway(Host)