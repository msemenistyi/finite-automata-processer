$(function(){
	var canvas = $("#canvas");

	canvas.attr({
		width: $(window).innerWidth() * 0.6,
        height: $(window).innerHeight() * 4
	});

	kissFormat = new KissFormat({canvas: canvas});
});