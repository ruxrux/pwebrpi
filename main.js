

function Brain() {

	var self = this;
	var serverManager;

	self.init = function() {
		serverManager = new ServerManager(self);
	}

	self.getServerManager = function() { return serverManager; }

	self.init();
}

function ServerManager(brain) {

	var self = this;
	var app;
	var express;
	var favicon;
	var PUBLIC_FOLDER_PATH = "/public";
	var MOBILE_CLIENT_FOLDER_PATH = PUBLIC_FOLDER_PATH + "/mobileClient";
	var MOBILE_CLIENT_INDEX_PATH = MOBILE_CLIENT_FOLDER_PATH + "/index.html";
	var FAVICON_PATH = MOBILE_CLIENT_FOLDER_PATH + "/images/favicon.png";
	var MOBILE_CLIENT_SOCKET_PORT = 23232;
	var RASPI_SOCKET_PORT = 23233;
	var mobileClientSockets = [];
	var raspiSocket = null;

	self.init = function() {
		self.createExpress();
		self.createApp();
		self.createFavicon();
		self.createMobileClientSocket();
		self.createRasPiSocket();
	}

	self.createExpress = function() {
		express = require('express');
	}

	self.createApp = function() {
		app = express();
		// Serve up static files from the public folder
		app.use(express.static(__dirname + PUBLIC_FOLDER_PATH));
		// Set the mobile client path
		app.get('/', function(req, res){
			res.sendFile(MOBILE_CLIENT_INDEX_PATH, {"root": __dirname});
		});
	}

	self.createFavicon = function() {
		var favicon = require('serve-favicon');
		app.use(favicon(__dirname + FAVICON_PATH));
	}

	self.createMobileClientSocket = function() {
		var server = require('http').Server(app);
		var io = require('socket.io')(server);

		// Listen for the connection event
		io.on('connection', function(socket){
			self.onMobileClientSocketConnection(socket);
			socket.on('disconnect', function() {
				self.onMobileClientSocketDisconnection(socket);
	   		});
			socket.on("switchEvent", self.handleSwitchEventMessage);
		});

		server.listen(MOBILE_CLIENT_SOCKET_PORT, function() {
		  console.log('listening on *:' + MOBILE_CLIENT_SOCKET_PORT.toString());
		});
	}

	self.createRasPiSocket = function() {
		var server = require('http').Server(app);
		var io = require('socket.io')(server);

		// Listen for the connection event
		io.on('connection', function(socket){
			self.onRasPiSocketConnection(socket);
			socket.on('disconnect', function() {
				self.onRasPiSocketDisconnection(socket);
	   		});
		});

		server.listen(RASPI_SOCKET_PORT, function() {
		  console.log('listening on *:' + RASPI_SOCKET_PORT.toString());
		});
	}

	self.onMobileClientSocketConnection = function(socket) {
		console.log("mobile client socket " + socket.id + " connection opened");
		mobileClientSockets.push(socket);
	}

	self.onMobileClientSocketDisconnection = function(socket) {
		console.log("mobile client socket " + socket.id + " disconnected");
		var socketIndex = mobileClientSockets.indexOf(socket);
		if (socketIndex > -1) {
			mobileClientSockets.splice(socketIndex, 1);
		}
	}

	self.onRasPiSocketConnection = function(socket) {
		console.log("ras pi socket " + socket.id + " connection opened");
		raspiSocket = socket;
	}

	self.onRasPiSocketDisconnection = function(socket) {
		console.log("ras pi socket " + socket.id + " disconnected");
	}

	self.handleSwitchEventMessage = function(message) {
		self.sendMessageToRasPi("switchEvent", message);	
	}
 
	self.sendMessageToMobileClients = function(messageType, message) {	
		for (var i=0; i<mobileClientSockets.length; i++) {
			console.log("sending message to mobileClient " + i + "  " + messageType + "   " + message);
			mobileClientSockets[i].emit(messageType, message);
		}
	}

	self.sendMessageToRasPi = function(messageType, message) {
		console.log("sendMessageToRasPi", messageType, message);
		if (raspiSocket != null) {
			raspiSocket.emit(messageType, message);	
		}
	}


	self.init();
}


var brain = new Brain();


