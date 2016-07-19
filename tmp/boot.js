socket.on((socket) => {
	let sessionId    = socket.express.session
	let socketId     = socket.id
	let isNewSession = false
	let isNewSocket  = false
	let session
	let socketStorage
	let modelStorage
	let chambr
	let highway

	// Has session storage
	session = Session.Storage.get(sessionId)
	if (!session) {
		session = new Session(sessionId, socket)
		isNewSession = true
	}
	
	// Session has socketStorage
	socketStorage = session.getSocket(socketId)
	if (!socketStorage) {
		socketStorage = session.addSocket(socket)
		isNewSocket = true
	}

	// Initialize highway
	highway = socketStorage.get(Session.KEY_HIGHWAY)
	if (!highway) {
		highway = new Highway(socket)
		socketStorage.set(Session.KEY_HIGHWAY, highway)
	}

	// Initialize chambr
	chambr = socketStorage.get(Session.KEY_CHAMBR)
	if (!chambr) {
		chambr = new Chambr(highway)
		socketStorage.set(Session.KEY_CHAMBR, chambr)
	}
	
	/*if (isNewSession) {
		new ConfigModel()
		new UserModel()
		new LanguageModel()
	}*/
})