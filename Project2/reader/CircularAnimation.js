/**
 * CircularAnimation
 * @constructor
 */
function CircularAnimation(scene, span, radius, center, startAng, rotAng) {
    Animation.call(this, scene, span);

    this.radius = radius;
    this.center = center;
    this.startAng = startAng;
    this.rotAng = rotAng;

    this.deltaAngle = this.rotAng / this.span;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function () {

};