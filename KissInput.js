function KissInput () {

	this.container = $("#input-form");

	this.source = ko.observable();

	this.currentRow = 0;

	// this.processInput();

	ko.applyBindings(this, this.container[0]);


}

KissInput.prototype.processInput = function() {

	this.currentRow = 0;
	this.rows = this.source().split("\n");
	this.i = this.lookForNumber({header: ".i"});
	this.o = this.lookForNumber({header: ".o", rowToStart: this.currentRow});
	this.p = this.lookForNumber({header: ".p", rowToStart: this.currentRow});
	this.s = this.lookForNumber({header: ".s", rowToStart: this.currentRow});

};

KissInput.prototype.lookForNumber = function(options) {
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