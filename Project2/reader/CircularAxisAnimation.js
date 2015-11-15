/**
 * CircularAxisAnimation
 * @constructor
 */
function CircularAxisAnimation(scene, span, radius, center, startAng, rotAng, axis) {
    Animation.call(this, scene, span);

    this.radius = radius;
    this.centerX = center[0];
    this.centerY = center[1];
    this.centerZ = center[2];
    this.startAng = startAng * Math.PI / 180;
    this.rotAng = rotAng * Math.PI / 180;
    this.axisX = axis[0];
    this.axisY = axis[1];
    this.axisZ = axis[2];

    this.deltaAngle = this.rotAng / this.span;
    this.startT = 0;
    this.lastT = 0;
    this.start = -1;
    this.angle = this.startAng;
}

CircularAxisAnimation.prototype = Object.create(Animation.prototype);
CircularAxisAnimation.prototype.constructor = CircularAnimation;

CircularAxisAnimation.prototype.update = function (time) {
    if (this.start == -1) {
        this.start = 0;
        this.startT = time;
        this.lastT = time;
    }
    var deltaT = (time - this.startT) / 1000;
    if (deltaT >= this.span) {
        this.angle = this.startAng + this.rotAng;
        return 1;
    }
    else {
        var dT = (time - this.lastT) / 1000;
        this.angle += dT * this.deltaAngle;
        this.lastT = time;
        return 0;
    }
};

CircularAxisAnimation.prototype.apply = function () {
	this.scene.translate(this.centerX, this.centerY, this.centerZ);
	this.scene.rotate(this.angle, this.axisX, this.axisY, this.axisZ);
	this.scene.translate(this.radius, 0, 0);	
}
