function KissFormat (options) {

	this.container = $("#input-form");

	this.canvas = options.canvas || $("canvas");

	this.source = ko.observable();

	this.currentRow = 0;

	ko.applyBindings(this, this.container[0]);
}

KissFormat.prototype.processInput = function() {
	// $("#states-container").html("");
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

	this.drawGraph();
};

KissFormat.prototype.calcPositions = function() {
	var self = this;

	var radius = 60;

	var startX = this.canvas.width() / 2;
	var startY = (radius / 2) + 10;

	this.kissStates()[0].x = startX;
	this.kissStates()[0].y = startY;
	this.kissStates()[0].r = radius;


	for (var i = 0; i < this.kissStates().length; i++) {
		if (this.kissStates()[i].visible == true) continue;
		this.kissStates()[i].x = startX;
		this.kissStates()[i].y = startY;
		this.kissStates()[i].r = radius;

		this.kissStates()[i].visible = true;

		// console.log(this.kissStates()[i].name);
		// console.log(this.kissStates()[i].products());

		var allProducts = [];
		$.each(self.kissStates()[i].products(), function(j, el) {
			allProducts.push(el.destination);
		});

		console.log("Для: " + self.kissStates()[i].name);
		console.log("До: ");
		console.log(allProducts);

		var unqueProducts = [];
		$.each(allProducts, function(j, el){
    		if($.inArray(el, unqueProducts) === -1 && el != self.kissStates()[i].name) unqueProducts.push(el);
		});

		console.log("После: ");
		console.log(unqueProducts);

		var childNum = unqueProducts.length;

		if (childNum > 0)
		{
			startX -= (radius + 10) * (childNum - 1);
			startY += 2 * radius;

			for (var k = 0; k < childNum; k++)
			{
				var nextName = unqueProducts[k];

				for (var j = 0; j < this.kissStates().length; j++) {
					if (this.kissStates()[j].name == nextName && !this.kissStates()[j].visible) {
						this.kissStates()[j].x = startX;
						this.kissStates()[j].y = startY;
						this.kissStates()[j].r = radius;
						this.kissStates()[j].visible = true;
						startX += 2 * (radius + 10);
						break;
					}
				}
			}

			startX = this.canvas.width() / 2;
			startY += 2 * radius;
		}
	};
};

KissFormat.prototype.drawGraph = function() {
	if (this.kissStates().length == 0) return;

	this.canvas.clearCanvas();

	this.calcPositions();

	for (var i = this.kissStates().length - 1; i >= 0; i--) {
		// ------
		this.canvas.drawEllipse({
			strokeStyle: "#36c",
			scale: 1,
			strokeWidth: 2,
			fillStyle: "#3ec",
			width: this.kissStates()[i].r,
			height: this.kissStates()[i].r,
			x: this.kissStates()[i].x,
			y: this.kissStates()[i].y
		});
		// ------
		this.canvas.drawText({
			font: "11pt Verdana, sans-serif",
			fillStyle: "#000",
			x: this.kissStates()[i].x,
			y: this.kissStates()[i].y,
			text: this.kissStates()[i].name
		});
	};


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