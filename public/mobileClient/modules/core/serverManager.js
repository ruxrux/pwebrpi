function ServerManager(brain) {

	var self = this;
	var socket;

	self.init = function() {
		socket = io();
		socket.on("connect", self.onConnectionWithServer);
		socket.on("connect_failed", self.onConnectionFailedWithServer);
		socket.on("disconnect", self.onDisonnectionFromServer);
	}

	self.onConnectionWithServer = function() {
		console.log("connected to server");
	}

	self.onConnectionFailedWithServer = function() {
		console.log("connect to server failure");
	}

	self.onDisonnectionFromServer = function() {
		console.log("disconnected from server");
	}

	self.sendSwitchEventToServer = function(eventType) {
		var message = {"eventType": eventType};
		self.sendMessageToServer("switchEvent", message);
	}

	self.sendMessageToServer = function(messageType, message) {
		var json = JSON.stringify(message);
		console.log("sending message to server: " + messageType + "  " + json);
		socket.emit(messageType, message);
	}

	self.init();
}
