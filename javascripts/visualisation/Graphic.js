function Graphic (options) {
	var self = this;

	self.field = options.field;
}

Graphic.prototype.draw = function(style) {
	var self = this;

	var graphic = null;

	switch (style) {
		case "Mealy":
			graphic = new Graph({field: self.field, type: "Mealy"});
			break;

		case "Moore":
			graphic = new Graph({field: self.field, type: "Moore"});
			break;

		case "BlockDiagram":
			graphic = new BlockDiagram({field: self.field});
			break;
	}

	graphic.draw();
};