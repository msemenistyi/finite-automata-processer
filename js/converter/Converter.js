function Converter (options) {
	this.lastErrorCode = 0x00;
}

Converter.prototype.convert = function(options) {
	this.lastErrorCode = 0x00;

	if ( options == null ) {
		this.lastErrorCode = 0x01;
		return null;
	}

	if ( options.source == null ) {
		this.lastErrorCode = 0x02
		return null;
	}

	if ( options.inFormat == null && options.outFormat == null ) {
		this.lastErrorCode = 0x06;
		return null;
	}

	if ( options.inFormat == options.outFormat ) {
		this.lastErrorCode = 0x03;
		return null;
	}

	var inFormat = this._getFormatObject( { format: options.inFormat } );
	var outFormat = this._getFormatObject( { format: options.outFormat } );;

	var result = null;

	if ( inFormat == null ) {
		result = outFormat.getFormated( { vertexes: options.source } );
		if ( result == null ) {
			this.lastErrorCode = 0x05;
			return null;
		}
	}
	else if ( outFormat == null ) {
		result = inFormat.parse( { source: options.source } );
		if ( result == null ) {
			this.lastErrorCode = 0x07;
			return null;
		}
	}
	else {
		var vertexes = inFormat.parse( { source: options.source } );

		if ( vertexes == null ) {
			this.lastErrorCode = 0x04;
			return null;
		}

		result = outFormat.getFormated( { vertexes: vertexes } );

		if ( result == null ) {
			this.lastErrorCode = 0x05;
			return null;
		}
	}

	return result;
};

Converter.prototype.getErrorString = function() {
	switch ( this.lastErrorCode ) {
		case 0x00:
			return "Convert was successfully completed";

		case 0x01:
			return "Converting data are not specified";

		case 0x02:
			return "The data for converting can't be empty";

		case 0x03:
			return "Input and output formats can't be equal";

		case 0x04:
			return "Input data is wrong or input format is incorrect";

		case 0x05:
			return "Output format is incorrect";

		case 0x06:
			return "One of the in or out format must be necessarily specified";

		case 0x07:
			return "Input data are incorrect";

		default:
			return "Unknow error";
	}
};

Converter.prototype._getFormatObject = function(options) {
	var format = null;

	switch ( options.format ) {
		case "kiss2":
			format = new Kiss2Format();
			break;

		case "xmlm":
			format = new XmlmFormat();
			break;

		case "gv":
			format = new GvFormat();
			break;
	}

	return format;
};