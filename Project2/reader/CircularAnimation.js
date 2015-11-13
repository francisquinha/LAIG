/**
 * CircularAnimation
 * @constructor
 */
function CircularAnimation(scene, span, radius, center, startAng, rotAng) {
    Animation.call(this, scene, span);

    this.radius = radius;
    this.centerX = center[0];
    this.centerY = center[1];
    this.centerZ = center[2];
    this.startAng = startAng * Math.PI / 180;
    this.rotAng = rotAng * Math.PI / 180;

    this.deltaAngle = this.rotAng / this.span;
    this.startT = 0;
    this.lastT = 0;
    this.start = -1;
    this.angle = this.startAng;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function (time) {
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

CircularAnimation.prototype.apply = function () {
	this.scene.translate(this.centerX, this.centerY, this.centerZ);
	this.scene.rotate(this.angle, 0, 0, 1);
	this.scene.translate(this.radius, 0, 0);	
}
