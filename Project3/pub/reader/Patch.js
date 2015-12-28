/**
 * Patch
 * @constructor
 * @param scene
 * @param args
 */
function Patch(scene, order, partsU, partsV, controlPoints) {
	CGFobject.call(this,scene);

	this.scene = scene;
	this.order = order;
	this.partsU = partsU;
	this.partsV = partsV;
	this.controlPoints = controlPoints.slice(0);

	for(var n=0; n<this.controlPoints.length; n++)
		this.controlPoints[n].push(1);

	this.initBuffers();
};

Patch.prototype = Object.create(CGFobject.prototype);

Patch.prototype.constructor=Patch;

Patch.prototype.initBuffers = function () {
	var knots = [];
	var controlPointsOrdered = [];

	switch(this.order){
		case 1:
			knots = [0, 0, 1, 1];
			break;
		case 2:
			knots = [0, 0, 0, 1, 1, 1];
			break;
		case 3:
			knots = [0, 0, 0, 0, 1, 1, 1, 1];
			break;
		default:
			break;
	}

	for(var n=0; n<this.controlPoints.length; n+=(this.order+1)){
		var group = [];
		for(var i=0; i<=this.order; i++)
			group.push(this.controlPoints[n+i]);
		
		controlPointsOrdered.push(group);
	}

	// create surface
	var nurbsSurface = new CGFnurbsSurface(this.order, this.order, knots, knots, controlPointsOrdered);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.surface =	new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
};

Patch.prototype.display = function () {
	this.surface.display();	
};


/*
 * updateTextelCoordinates
 * No need to update the textel's coordinates according to amplifS and amplifT.
 *
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
Patch.prototype.updateTexelCoordinates = function (amplifS, amplifT) {};