function KissFormat () {

	this.container = $("#input-form");

	this.source = ko.observable();

	this.currentRow = 0;

	this.kissStates = ko.observableArray([]);

	ko.applyBindings(this, this.container[0]);

}

KissFormat.prototype.processInput = function() {

	$("#states-container").html("");
	this.currentRow = 0;
	this.rows = this.source().split("\n");
	this.i = this.lookForNumber({header: ".i"});
	this.o = this.lookForNumber({header: ".o", rowToStart: this.currentRow});
	this.p = this.lookForNumber({header: ".p", rowToStart: this.currentRow});
	this.s = this.lookForNumber({header: ".s", rowToStart: this.currentRow});

	this.currentRow++;
	this.inputStates = [];
	while (this.currentRow != this.rows.length){
		var splittedState = this.rows[this.currentRow].split(" ");
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