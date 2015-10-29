/**
 * LinearAnimation
 * @constructor
 */

function LinearAnimation(scene, span, control_points) {
    Animation.call(this, scene, span);

    this.control_points = control_points;
    var nr_control_points = this.control_points.length;

    var total_line_length = 0;

    var lines = [];

    for(var i = 0 ; i < nr_control_points - 1 ; i++){
        var x = this.control_points[i]["xx"] - this.control_points[i + 1]["xx"];
        var y = this.control_points[i]["yy"] - this.control_points[i + 1]["yy"];
        var z = this.control_points[i]["zz"] - this.control_points[i + 1]["zz"];

        var line_length = Math.sqrt(x*x + y*y + z*z);

        lines.push({'deltaX': x, 'deltaY': y, 'deltaZ': z, 'length': line_length});

        total_line_length += line_length;
    }

    this.velocity = total_line_length / this.span;
}

//LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.init = function () {

};