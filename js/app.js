$(function() {
	$('#process').on('click', function() {
		var graph = new Graph();

		graph.Init( { format: "kiss2", source: $('#source-text').val() } );

		if ( graph.conv.lastErrorCode != 0x00 ) {
			alert( "Trying to parse source text.\nError: " + graph.conv.getErrorString() );
			return;
		}

		var result = graph.getFormat( { format: "kiss2" } );

		if ( graph.conv.lastErrorCode != 0x00 ) {
			alert( "Trying to get format.\nError: " + graph.conv.getErrorString() );
			return;
		}

		$('#source-text').val( result );

		$('#tree-viewer').find("ul").detach();

		$.map( graph.vertexes, function(vertex, i) {
			var node = $('#tree-viewer #tree').append("<ul class='node'><b>" + vertex.name + "</b></ul>");
			
			$.map( vertex.transitions, function(transition) {
				$("#tree-viewer #tree .node:last")
					.append("<li>"
						+ transition.vertex.name
						+ " (in: "
						+ transition.condIn
						+ "; out: "
						+ transition.condOut
						+ ") </li>");
			});
		});
	});
});