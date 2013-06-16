function Vertex (options) {
	this.name = options.name || "";
	this.transitions = [];

	this.x = options.x || 0;
	this.y = options.y || 0;

	this.color = options.color || null;
}