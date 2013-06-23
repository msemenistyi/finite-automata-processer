function Kiss2Format (options) {
}

// try to parse options.source (text)
Kiss2Format.prototype.parse = function(options) {
	var self = this;

	var rows = options.source.split("\n");

	var iVal = self._lookForNumber( { rows: rows, header: ".i" } );
	var oVal = self._lookForNumber( { rows: rows, header: ".o" } );
	var pVal = self._lookForNumber( { rows: rows, header: ".p" } );
	var sVal = self._lookForNumber( { rows: rows, header: ".s" } );

	var vertexes = [];
	var statesArray = [];

	$.map(rows, function(row) {
		var splittedState = row.split(/\s+/);
		if ( splittedState.length == 4 ) {
			statesArray.push( splittedState );
		}
	});

	// Create collection of vertexes
	$.map(statesArray, function(state) {
		var vertex = self._getVertex( { vertexes: vertexes, name: state[1] } );
		if (vertex == null) {
			vertexes.push( new Vertex( { name: state[1] } ) );
		}
	});

	// Fill transition fields for each vertex in collection
	$.map(vertexes, function(vertex) {
		for (var i = 0; i < statesArray.length; ++i) {
			var state = statesArray[i];
			if ( vertex.name === state[1] ) {
				vertex.transitions.push(
					new Transition({
						vertex: self._getVertex( { vertexes: vertexes, name: state[2] } ),
						condIn: state[0],
						condOut: state[3]
					}));
				statesArray.splice(i, 1);
				i--;
			}
		}
	});

	// Check for parameter .p
	var pValRes = 0;
	$.map(vertexes, function(vertex) {
		// Check for correct transitions
		if ( vertex.transitions.length > Math.pow(2, iVal) ) {
			return null;
		}
		$.map(vertex.transitions, function(transition) {
			pValRes++;
			if ( transition.vertex == null ||
				// Check for parameter .i
				transition.condIn != iVal ||
				// Check for parameter .o
				transition.condOut != oVal ) {
				return null;
			}
		});
	});

	if ( pValRes != pVal ) {
		return null;
	}

	// Check for parameter .s
	if ( vertexes.length != sVal ) {
		return null;
	}

	return vertexes;
};

// convert array of Vertexes to text (Kiss2 format)
Kiss2Format.prototype.getFormated = function(options) {
	if ( options == null || options.vertexes == null ) {
		return null;
	}

	var iVal = options.vertexes[0].transitions[0].condIn.length;
	var oVal = options.vertexes[0].transitions[0].condOut.length;

	var sVal = options.vertexes.length;

	var pVal = 0;

	$.map(options.vertexes, function(vertex) {
		pVal += vertex.transitions.length;
	});

	var result = ""
		+ ".i " + iVal + "\n"
		+ ".o " + oVal + "\n"
		+ ".s " + sVal + "\n"
		+ ".p " + pVal + "\n";

	$.map(options.vertexes, function(vertex) {
		// console.log(vertex);
		$.map(vertex.transitions, function(transition) {
			result += transition.condIn + " "
				   +  vertex.name + " "
				   +  transition.vertex.name + " "
				   +  transition.condOut + "\n";
		});
	});

	return result;
};

Kiss2Format.prototype._lookForNumber = function(options) {
	if ( options == null ||
		 options.rows == null ||
		 options.header == null ) {
		return null;
	}

	var pattern = new RegExp("(" + options.header + "\\s(\\d*))", "g");

	for (var i = options.rows.length-1; i >= 0; --i) {
		var hasString = options.rows[i].match(pattern);
		if ( hasString != null ) {
			var strFound = hasString[0];
			var strSplitted = strFound.split(" ");

			for (var i = 0; i < strSplitted.length; i++) {
				var number = parseInt( strSplitted[i] );
				if ( !isNaN(number) ) {
					return number;
				}
			}
		}
	}

	return 0;
};


// return reference to Vertex (from self.vertexes) with specified name
Kiss2Format.prototype._getVertex = function(options) {
	for (var i = options.vertexes.length-1; i >= 0; --i) {
		if ( options.vertexes[i].name === options.name ) {
			return options.vertexes[i];
		}
	}
	return null;
};

// // Convert record "0101" to form "!x4x3!x2x1"
// // x - specified name => options.text
// Kiss2Format.prototype._getCondition = function(options) {
// 	var count = options.condition.length;
// 	var result = "";

// 	for (var i = 0; i < count; i++) {
// 		if (options.condition[i] == 0) {
// 			result += "!" + options.text + (count - i - 1);
// 		}
// 		else if (options.condition[i] == 1) {
// 			result += options.text + (count - i - 1);
// 		}
// 	}
// 	return result;
// };