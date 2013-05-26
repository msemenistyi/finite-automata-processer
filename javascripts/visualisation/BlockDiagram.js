function BlockDiagram (options) {
	var self = this;

	self.field = options.field;

	self.fieldWidth = options.width;
	self.fieldHeight = options.height;

	self.mediator.subscribe("app:render", function(data) {
		self.states = data.states;
		self.draw();
	}
}

BlockDiagram.prototype.calcPositions = function() {
	var self = this;

	var startX = self.fieldWidth / 2;
	var startY = 20;

	$.map(self.states, function(state) {
		
	});
};

BlockDiagram.prototype.drawElements = function() {
	
};

BlockDiagram.prototype.drawArrows = function() {
	
};

BlockDiagram.prototype.draw = function() {
	var self = this;

	self.calcPositions();

	self.drawElements();

	self.drawArrows();
};