function KissInput () {

	this.container = $("#input-form");

	this.source = ko.observable();

	ko.applyBindings(this, this.container[0]);

}

KissInput.prototype.processInput = function() {
	alert(this.source());
};