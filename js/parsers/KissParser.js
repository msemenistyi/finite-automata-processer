function KissParser (options) {
}

KissParser.prototype.tryToParse = function(options) {
	var self = this;

	self.rows = options.source.split("\n");
	self.i = self._lookForNumber( { header: ".i" } );
	self.o = self._lookForNumber( { header: ".o" } );
	self.p = self._lookForNumber( { header: ".p" } );
	self.s = self._lookForNumber( { header: ".s" } );

	self.vertexes = [];
	var statesArray = [];

	$.map(self.rows, function(row) {
		var splittedState = row.split(/ {1,}/);
		if ( splittedState.length == 4 ) {
			statesArray.push(splittedState);
		}
	});

	$.map(statesArray, function(state) {
		var vertex = self._getVertex(state[1]);
		if (vertex == null) {
			self.vertexes.push( new Vertex( {name: state[1]} ) );
		}
	});

	$.map(self.vertexes, function(vertex) {
		for (var i = 0; i < statesArray.length; ++i) {
			var state = statesArray[i];
			if (vertex.name === state[1]) {
				vertex.transitions.push(
					new Transition({
						vertex: self._getVertex(state[2]),
						conditionX: self._getCondition( {condition: state[0], text: "x"} ),
						conditionY: self._getCondition( {condition: state[3], text: "y"} )
					}));
				statesArray.splice(i, 1);
				i--;
			}
		}
	});

	$.map(self.vertexes, function(vertex) {
		console.log(vertex);
	});

	return self.vertexes;
};

KissParser.prototype._lookForNumber = function(options) {
	var self = this;

	var pattern = new RegExp("(" + options.header + " (\\d*))", "g")

	for (var i = self.rows.length-1; i >= 0; --i) {
		var hasString = self.rows[i].match(pattern);
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
	};
};

KissParser.prototype._getVertex = function(name) {
	var self = this;
	for (var i = self.vertexes.length-1; i >= 0; --i) {
		if (self.vertexes[i].name === name) {
			return self.vertexes[i];
		}
	}
	return null;
};

KissParser.prototype._getCondition = function(options) {
	var count = options.condition.length;
	var result = "";

	for (var i = 0; i < count; i++) {
		if (options.condition[i] == 0) {
			result += "!" + options.text + (count - i - 1);
		}
		else if (options.condition[i] == 1) {
			result += options.text + (count - i - 1);
		}
	}

	return result;
};