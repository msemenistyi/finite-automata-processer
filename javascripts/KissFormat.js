function KissFormat (options) {

	this.container = options.container || $("#input-form");

	this.source  = ko.observable();
	this.enableX = ko.observable(false);
	this.enableY = ko.observable(false);

	this.currentRow = 0;

	this.rendered = ko.observable(false);
	ko.applyBindings(this, this.container[0]);

	this.mediator = options.mediator;
	var self = this;
	this.mediator.once("app:render", function(){
		self.rendered(true);
	})
}

KissFormat.prototype.processInput = function() {
	this.currentRow = 0;
	this.rows = this.source().split("\n");
	this.i = this.lookForNumber({header: ".i"});
	this.o = this.lookForNumber({header: ".o", rowToStart: this.currentRow});
	this.p = this.lookForNumber({header: ".p", rowToStart: this.currentRow});
	this.s = this.lookForNumber({header: ".s", rowToStart: this.currentRow});

	this.kissStates = ko.observableArray([]);

	this.currentRow++;
	this.inputStates = [];
	while (this.currentRow != this.rows.length){
		var splittedState = this.rows[this.currentRow].split(/ {1,}/);
		if (splittedState.length == 4)
			this.inputStates.push(splittedState);
		this.currentRow++;
	}
	var statesArray = this.inputStates.slice();
	var i = 0;
	while (i < statesArray.length){
		var candidate = statesArray[i];
		var products = [];
		for (var j = i + 1; j < statesArray.length; j++){
			if (candidate[1] == statesArray[j][1]){
				products.push(statesArray[j]);
				statesArray.splice(j,1);
				j--;
			}
		}
		products.push(candidate);
		var options = {
			name: candidate[1],
			products: products
		}
		statesArray.splice(i,1);
		this.kissStates.push(new KissState(options));
	}

	this.mediator.publish("app:render", {states: this.kissStates(), x_enabled: this.enableX(), y_enabled: this.enableY()})
};

KissFormat.prototype.lookForNumber = function(options) {
	var rowToStart = options.rowToStart || this.rowToStart; 
	var pattern    = new RegExp("(" + options.header + " (\\d*))", "g")

	while ( this.currentRow != this.rows.length){
		var hasString = this.rows[this.currentRow].match(pattern);
		if (hasString != null){
			var strFound = hasString[0];
			var strSplitted = strFound.split(" ");
			for ( var i = 0; i < strSplitted.length; i++ ){
				var number = parseInt(strSplitted[i]);
				if (!isNaN(number))
					return number;
			}
		}
		this.currentRow++;
	}
};

KissFormat.prototype.render = function() {

	if (this.rendered()){
		this.mediator.publish("app:render", {states: this.kissStates(), x_enabled: this.enableX(), y_enabled: this.enableY()})
	}
	return true;
};

KissFormat.prototype.save = function() {

	if (this.rendered()){
		this.mediator.publish("app:save");
	}

};