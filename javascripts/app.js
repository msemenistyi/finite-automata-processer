$(function(){
	var container = $("#input-form");

	var canvas = $("#canvas");

	canvas.attr({width: $(window).innerWidth() * 0.9});

	kissFormat = new KissFormat({container: container, canvas: canvas});
});