function Graph (options) {
	this.vertexes = null;

	this.sourceText = null;

	this.conv = new Converter();
}

Graph.prototype.Init = function(options) {
	this.vertexes = null;
	this.vertexes = this.conv.convert( { inFormat: options.format, source: options.source } );
	this.sourceText = options.source;
};

Graph.prototype.getFormat = function(options) {
	return this.conv.convert( { outFormat: options.format, source: this.vertexes } );
};