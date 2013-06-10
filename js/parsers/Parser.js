function Parser (options) {
	// this.mediator = options.mediator;
}

Parser.prototype.tryToParse = function(options) {
	if (options == null) return null;

	var self = this;

	var parser = null;

	switch (options.format)
	{
		case "kiss2":
			parser = new KissParser();
			break;
			
		case "xmlm":
			parser = new XmlmParser();
			break;
		case "dot":
		case "gv":
			parser = new DotParser();
			break;
	}

	return parser.tryToParse({source: options.source});
};