/**
 * patch
 * @constructor
 */

function patch(scene, args) {
	
	this.default = [
        1, 1, 1, [ [1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1]]];

    this.args = args || this.default;

    this.order = this.args[0];
    this.partsU = this.args[1];
    this.partsV = this.args[2];
    this.all_controlPoints = this.getControlPoints(this.args[3]);
  
    var knots = this.getKnots();

    var nurbsSurface = new CGFnurbsSurface(this.order, this.order, knots, knots, this.all_controlPoints);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, this.partsU, this.partsV);
 }
 
 patch.prototype = Object.create(CGFnurbsObject.prototype);
 patch.prototype.constructor = patch;
 

patch.prototype.getControlPoints = function(arrayPoints) {
    var arrangedArrayPoints = [];
    var index;
    for (var orderU = 0 ; orderU <= this.order ; orderU++) {

        var vPoints = [];
        for (var orderV = 0 ; orderV <= this.order ; orderV++) {
            index = orderU * (this.order + 1) + orderV;
            vPoints.push(arrayPoints[index]);
        }
        arrangedArrayPoints.push(vPoints);     
    }
        arrangedArrayPoints.push(vPoints);
   return arrangedArrayPoints;
};

patch.prototype.getKnots = function() {
    var knots = [];
    for (var i = 0; i <= this.order ; i++)
        knots.push(0);
    for (var j = 0; j <= this.order ; j++)
        knots.push(1);

    return knots;
};