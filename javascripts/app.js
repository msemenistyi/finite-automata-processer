$(function(){
	var container = $("#input-form");
	var canvas = $("#canvas");
	canvas.attr({width: $(window).innerWidth() * 0.98});

	var mediator = new Mediator;

	var kissGraphics = new KissGraphics({canvas: canvas, mediator: mediator});
	var kissFormat = new KissFormat({container: container, mediator: mediator});
});