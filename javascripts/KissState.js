function KissState (options) {

	this.name = options.name;

	this.products = ko.observableArray([]);

	for (var i = 0; i < options.products.length; i++)
		this.products.push(this.parseToObject(options.products[i]));

	this.container = $("<div />");

	this.container.attr({"data-bind": "template: 'kiss-state-template'"});

	this.container.appendTo($("#states-container"));

	ko.applyBindings(this, this.container[0]);

}

KissState.prototype.parseToObject = function(state) {
	var x_string = "";
	for (var i = 0; i < state[0].length; i++){
		if (state[0][i] == 1){
			x_string += "X" + i;
		} else if (state[0][i] == 0){
			x_string += "nX" + i;
		}
	}	
	var y_string = "";
	for (var i = 0; i < state[3].length; i++){
		if (state[3][i] == 1){
			y_string += "Y" + i;
		} else if (state[3][i] == 0){
			y_string += "nY" + i;
		}
	}
	return {
		destination: state[2],
		x_string: x_string,
		y_string: y_string
	}
};