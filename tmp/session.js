class Session extends EventEmitter {
	static Storage      = new Map()
	static EVENT_START  = 'start'
	static KEY_SOCKET   = 'socket'
	static KEY_SOCKETS  = 'socket'
	static KEY_HIGHWAY  = 'Highway'
	static KEY_CHAMBR   = 'Chambr'
	static KEY_INSTANCE = 'Instance'

	constructor(sessionId, socket){
		super()
		let sessionStorage = new Map()
		sessionStorage.set(Session.KEY_INSTANCE, this)
		sessionStorage.set(Session.KEY_SOCKETS, new Map())
		Session.Storage.set(sessionId, sessionStorage)
		Session.emit(Session.EVENT_START, this)
		this.emit(Session.EVENT_START, this)
		console.log('Socket session first start', sessionId, socket.id)
	}

	addSocket(socket){
		socket = new Map()
		socket.set(Session.KEY_SOCKET, socket)
		this.sockets.set(socket.id, socket)
		return socket
	}

	getSocket(socketId){
		return this.sockets.get(socketId)
	}
}

Object.assign(Session, new EventEmitter())

module.exports = Session