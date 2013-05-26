function Graph (options) {
	var self = this;

	self.field = options.field;

	self.type = options.type;
}

Graph.prototype.calcPositions = function() {
	
};

Graph.prototype.drawVertexes = function() {
	
};

Graph.prototype.drawArrows = function() {
	
};

Graph.prototype.draw = function() {
	var self = this;

	self.calcPositions();

	self.drawVertexes();

	self.drawArrows();
};