/**
 * Plane
 * @constructor
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