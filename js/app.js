$(function() {
	$('#process').on('click', function() {
		var parser = new Parser();
		var source = $('#source-text').val();
		parser.tryToParse({format: "kiss2", source: source});
	});
});