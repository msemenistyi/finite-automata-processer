function Parser (options) {
	this.mediator = options.mediator;
}

Parser.prototype.tryToParse = function(options) {
	if (options == null) return null;

	var parser = null;

	switch (options.format)
	{
		case "kiss2":
			parser = new KissFormat();
			break;
			
		case "xmlm":
			parser = new XmlmFormat();
			break;
	}

	return parser.tryToParse();
};