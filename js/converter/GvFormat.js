function GvFormat (options) {
}

GvFormat.prototype.getVertexes = function(options) {
	return null;
};

GvFormat.prototype.getFormated = function(options) {
	if ( options == null || options.vertexes == null ) {
		return null;
	}

	var result = "digraph graph {\n";
	
	$.map(options.vertexes, function(vertex) {
		$.map(vertex.transitions, function(transition) {
			result += vertex.name + " -> " + transition.vertex.name;
			result += " [label=\"" + transition.condIn + "/" + transition.condOut + "\"]\n";
		});
	});

	result += "}";

	return result;
};