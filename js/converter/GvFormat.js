function GvFormat (options) {
}

GvFormat.prototype.parse = function(options) {
	return null;
};

GvFormat.prototype.getFormated = function(options) {
	if ( options == null || options.vertexes == null ) {
		return null;
	}

	var result = "digraph {\n";
	
	_.map(options.vertexes, function(vertex) {
		_.map(vertex.transitions, function(transition) {
			result += vertex.name + " -> " + transition.vertex.name;
			result += " [label=\"" + transition.condIn + "/" + transition.condOut + "\"];\n";
		});
	});

	result += "}";

	return result;
};