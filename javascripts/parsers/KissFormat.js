function KissFormat () {

}

KissFormat.prototype.tryToParse = function(options) {
	var self = this;

	slef.currentRow = 0;
	self.rows = options.source.split("\n");
	self.i = self.lookForNumber({header: ".i"});
	self.o = self.lookForNumber({header: ".o", rowToStart: self.currentRow});
	self.p = self.lookForNumber({header: ".p", rowToStart: self.currentRow});
	self.s = self.lookForNumber({header: ".s", rowToStart: self.currentRow});

	var kissStates = [];

	self.currentRow++;
	self.inputStates = [];

	while (self.currentRow != self.rows.length){
		var splittedState = self.rows[self.currentRow].split(/ {1,}/);
		if (splittedState.length == 4)
			self.inputStates.push(splittedState);
		self.currentRow++;
	}

	var statesArray = self.inputStates.slice();
	var i = 0;
	while (i < statesArray.length){
		var candidate = statesArray[i];
		var products = [];
		for (var j = i + 1; j < statesArray.length; j++){
			if (candidate[1] == statesArray[j][1]){
				products.push(statesArray[j]);
				statesArray.splice(j, 1);
				j--;
			}
		}
		products.push(candidate);
		var options = {
			name: candidate[1],
			products: products
		}
		statesArray.splice(i, 1);
		kissStates.push(new State(options));
	}

	return kissStates;
};

KissFormat.prototype.lookForNumber = function(options) {
	var self = this;

	var rowToStart = options.rowToStart || self.rowToStart; 
	var pattern    = new RegExp("(" + options.header + " (\\d*))", "g")

	while ( self.currentRow != self.rows.length) {
		var hasString = self.rows[self.currentRow].match(pattern);
		if (hasString != null) {
			var strFound = hasString[0];
			var strSplitted = strFound.split(" ");
			for ( var i = 0; i < strSplitted.length; i++ ) {
				var number = parseInt(strSplitted[i]);
				if (!isNaN(number))
					return number;
			}
		}
		self.currentRow++;
	}
};