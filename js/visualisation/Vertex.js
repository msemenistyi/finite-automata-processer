function Vertex (options) {
	this.text = options.text;

	this.posX = options.x;
	this.posY = options.y;

	this.radius = options.r;

	this.textSize = options.r / options.text.length;
}