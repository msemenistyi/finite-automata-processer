$(function(){
	var container = $("#input-form");

	var canvas = $("#canvas");

	canvas.attr({width: $(window).innerWidth() * 0.98});

	kissFormat = new KissFormat({container: container, canvas: canvas});
});