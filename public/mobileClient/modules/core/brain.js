function Brain() {
	
	var self = this;
	var serverManager;
	
	self.init = function() {
		self.initSwitch();
		self.createServerManager();
	}

	self.initSwitch = function() {
		document.querySelector("#switch").addEventListener("touchstart", self.onSwitchTouchStart);
		document.querySelector("#switch").addEventListener("touchend", self.onSwitchTouchEnd);
		//document.querySelector("#switch").addEventListener("mousedown", self.onSwitchMouseDown);
		//document.querySelector("#switch").addEventListener("mouseup", self.onSwitchMouseUp);
	}
	
	self.createServerManager = function() {
		serverManager = new ServerManager(self);
	}

	self.getServerManager = function() { return serverManager; }

	self.onSwitchTouchStart = function(event) {
		//console.log("onSwitchTouchStart");
		self.getServerManager().sendSwitchEventToServer("touchstart");
	}

	self.onSwitchTouchEnd = function(event) {
		//console.log("onSwitchTouchEnd");
		self.getServerManager().sendSwitchEventToServer("touchend");
	}

	self.onSwitchMouseDown = function(event) {
		//console.log("onSwitchMouseDown");
		self.getServerManager().sendSwitchEventToServer("mousedown");
	}

	self.onSwitchMouseUp = function(event) {
		//console.log("onSwitchMouseUp");
		self.getServerManager().sendSwitchEventToServer("mouseup");
	}

	self.init();
}



















