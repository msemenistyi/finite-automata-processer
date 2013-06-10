function Block (options) {
	var self = this;

	this.type = options.type;

	this.posX = options.x;
	this.posY = options.y;

	this.width = options.width;
	this.height = options.height;

	this.arrowDist = options.arrowDist;
	this.arrowIndent = options.arrowIndent;

	this.leftEntryCount = 0;
	this.rightEntryCount = 0;

	self.text = options.text;
	self.textSize = (self.width / 2) / self.text.length;
}