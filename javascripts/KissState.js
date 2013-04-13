function KissState (options) {

	this.name = options.name;

	this.x = 0;
	this.y = 0;
	this.r = 0;

	this.visible = false;

	this.products = ko.observableArray([]);

	for (var i = 0; i < options.products.length; i++)
		this.products.push(this.parseToObject(options.products[i]));
}

KissState.prototype.parseToObject = function(state) {
	var x_string = "";
	for (var i = 0; i < state[0].length; i++){
		if (state[0][i] == 1){
			x_string += "x" + i;
		} else if (state[0][i] == 0){
			x_string += "!x" + i;
		}
	}	
	var y_string = "";
	for (var i = 0; i < state[3].length; i++){
		if (state[3][i] == 1){
			y_string += "y" + i;
		} else if (state[3][i] == 0){
			y_string += "!y" + i;
		}
	}
	return {
		destination: state[2],
		x_string: x_string,
		y_string: y_string
	}
};