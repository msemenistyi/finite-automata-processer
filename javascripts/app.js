$(function(){
	var canvas = $("#canvas");

	canvas.attr({
		width: $(window).innerWidth() * 0.6,
        height: $(window).innerHeight() * 2
	});

	kissFormat = new KissFormat({canvas: canvas});
});