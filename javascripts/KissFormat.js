function KissFormat (options) {

	this.container = options.container || $("#input-form");

	this.canvas = options.canvas || $("canvas");

	this.radius = this.canvas.width() / 20;

	this.textSize = this.radius / 10 * 1.5;

	this.source = ko.observable();

	this.currentRow = 0;

	ko.applyBindings(this, this.container[0]);
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

	this.drawGraph();
};

KissFormat.prototype.calcPositions = function() {
	var self = this;

	var startX = self.canvas.width() / 2.3;
	var startY = (self.radius / 2) + 10;

	$.map(self.kissStates(), function(state) {
		if (state.visible == false) {

			state.x = startX;
			state.y = startY;
			state.r = self.radius;
			state.visible = true;
	
			var unqueProducts = [];
			$.map(state.products(), function(el, i) {
	    		if($.inArray(el.destination, unqueProducts) === -1 && el.destination != state.name) {
	    			var canPush =
	    			$.map(self.kissStates(), function(st) {
	    				if (st.name === el.destination) {
	    					return !st.visible;
	    				}
	    			})[0];
	    			if (canPush) unqueProducts.push(el.destination);
	    		}
			});

			var childNum = unqueProducts.length;
	
			if (childNum > 0)
			{
				startX -= (self.radius + 10) * (childNum - 1);
				startY += 2 * self.radius;
	
				$.map(unqueProducts, function(productName) {
					$.map(self.kissStates(), function(el) {
						if (el.name == productName && !el.visible) {
							el.x = startX;
							el.y = startY;
							el.r = self.radius;
							el.visible = true;
							startX += 2 * (self.radius + 10);
						}
					});
				});
	
				startX = self.canvas.width() / 2.3;
				startY += 2 * self.radius;
			}
		} // end if (visibility)
	});
}

KissFormat.prototype.drawGraph = function() {
	var self = this;

	if (self.kissStates().length == 0) return;

	var canvasHeight = self.kissStates().length * (self.radius * 2) * 0.7;

	self.canvas.attr({height: canvasHeight});

	self.canvas.clearCanvas();

	self.calcPositions();

	self.drawCircles();

	self.drawArrows();
}

KissFormat.prototype.drawCircles = function() {
	var self = this;

	$.map(self.kissStates(), function(state) {
		self.canvas.drawEllipse({
			strokeStyle: "#36C",
			strokeWidth: 2,
			fillStyle: "#3EC",
			width: state.r,
			height: state.r,
			x: state.x,
			y: state.y
		});
		self.canvas.drawText({
			font: self.textSize + "pt Verdana, sans-serif",
			fillStyle: "#000",
			x: state.x,
			y: state.y,
			text: state.name
		});
	});
};

KissFormat.prototype.drawArrows = function() {
	var self = this;

	$.map(self.kissStates(), function(start, j) {
		// if (j != 0) return;
		var list =
		$.map(start.products(), function(product) {
			return $.map(self.kissStates(), function(el) {
				if (product.destination === el.name) {
					return el;
				}
			});
		});

		// console.log(list);

		var zn = 1;

		$.map(list, function(end, i) {
			// if (i != 0) return;
			var dests = $.map(start.products(), function(el) { if (el.destination == end.name) return true;})
			var startX = start.x;
			var startY = start.y;

			var endX = end.x;
			var endY = end.y;

			var ctrlX = (startX + endX) / 2;
			var ctrlY = (startY + endY) / 2;

			var distY = Math.abs(startY - endY) / self.radius / 1.4;

			// console.log("Repeat: " + dests);
			// console.log("Distance Y: " + distY);

			// console.log("startY: " + startY + " endY: " + endY);
			// console.log("startX: " + startX + " endX: " + endX);

			if (dests.length > 1) zn *= -1;

			if (startY < endY) {
				if (startX > endX) {
					if (distY > 2) {
						startX += self.radius / 2;
						endX += self.radius / 2;
						ctrlX += self.radius * distY;
					}
					else {
						startX -= self.radius / 2;
						endY -= self.radius / 2;
						ctrlX -= self.radius;
						ctrlY -= self.radius / 2
					}
				}
				else if (startX < endX) {
					if (distY > 2) {
						startX -= self.radius / 2 * zn;
						endX -= self.radius / 2 * zn;
						ctrlX -= self.radius * distY * zn;
					}
					else {
						startX += self.radius / 2;
						endY -= self.radius / 2;
						ctrlX += self.radius;
						ctrlY -= self.radius / 2
					}
				}
				else {
					if (distY > 2) {

					}
					else {
						startY += self.radius / 2;
						endY -= self.radius / 2;
					}
				}
			}
			else if (startY > endY) {
				if (startX > endX) {
					if (distY > 2) {
						startX -= self.radius / 2 * zn;
						endX -= self.radius / 2 * zn;
						ctrlX -= self.radius * distY * zn;
					}
					else {
						startX -= self.radius / 2;
						endY += self.radius / 2;
						ctrlX -= self.radius;
						ctrlY += self.radius / 2;
					}
				}
				else if (startX < endX) {
					if (distY > 2) {
						startX += self.radius / 2;
						endX += self.radius / 2;
						ctrlX += self.radius * distY;
					}
					else {
						startX += self.radius / 2;
						endY += self.radius / 2;
						ctrlX += self.radius;
						ctrlY += self.radius / 2;
					}
				}
				else {
					if (distY > 2) {
						startX -= self.radius / 2;
						endX -= self.radius / 2;
						ctrlX -= self.radius * distY;
					}
					else {
						startY -= self.radius / 2;
						endY += self.radius / 2;
					}
				}
			}
			else {
				if (startX < endX) {
					if (distY > 2) {
						startY += self.radius / 2 * zn;
						endY += self.radius / 2 * zn;

						if (zn > 0) ctrlY += self.radius * distY * 0.2;
						else ctrlY -= self.radius * distY * 0.2;
					}
					else {
						startX += (self.radius / 2);
						endX -= (self.radius / 2);
					}
				}
				else if (startX > endX) {
					if (distY > 2) {
						startY += self.radius / 2 * zn;
						endY += self.radius / 2 * zn;

						if (zn > 0) ctrlY += self.radius * distY * 0.2;
						else ctrlY -= self.radius * distY * 0.2;
					}
					else {
						startX -= self.radius / 2;
						endX += self.radius / 2;
					}
				}
				else {
					startX -= self.radius / 2;
					endY += self.radius / 2;
					ctrlX -= self.radius;
					ctrlY += self.radius;
				}
			}

			self.canvas.drawQuad({
				strokeStyle: "#36C",
				strokeWidth: 2,
				x1: startX, y1: startY, // Start point
				cx1: ctrlX, cy1: ctrlY, // Control point
				x2: endX, y2: endY // End point
			});
		});
	});
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