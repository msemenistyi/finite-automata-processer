function State (options) {
	var self = this;
	
	self.name = options.name;

	self.products = [];

	for (var i = 0; i < options.products.length; i++)
		self.products.push(self.parseToObject(options.products[i]));
}

KissState.prototype.parseToObject = function(state) {
	var x_string = "";
	for (var i = 0; i < state[0].length; i++){
		if (state[0][i] == 1){
			x_string += "x" + i;
		}
		else if (state[0][i] == 0){
			x_string += "!x" + i;
		}
	}

	var y_string = "";
	for (var i = 0; i < state[3].length; i++){
		if (state[3][i] == 1){
			y_string += "y" + i;
		}
		else if (state[3][i] == 0){
			y_string += "!y" + i;
		}
	}

	return {
		destination: state[2],
		x_string: x_string,
		y_string: y_string
	}
};