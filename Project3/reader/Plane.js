/**
 * Plane
 * @constructor
 * @param scene
 * @param parts
 */
function Plane(scene, parts) {
	CGFobject.call(this, scene);

	this.parts = (parts==undefined) ? 1 : parts;

	this.plane = new Patch(scene, 1, this.parts, this.parts, [[-0.5, 0, 0.5], [-0.5, 0, -0.5], [0.5, 0, 0.5], [0.5, 0,-0.5]]);
};

Plane.prototype = Object.create(CGFobject.prototype);

Plane.prototype.constructor=Plane;

Plane.prototype.display = function () {
	this.plane.display();
};


/*
 * updateTextelCoordinates
 * No need to update the textel's coordinates according to amplifS and amplifT.
 *
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
Plane.prototype.updateTexelCoordinates = function (amplifS, amplifT) {};
