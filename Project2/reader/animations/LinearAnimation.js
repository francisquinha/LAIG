/**
 * LinearAnimation
 * @constructor
 */

function LinearAnimation(scene, span, control_points) {
    Animation.call(this, scene, span);

    this.control_points = control_points;

    this.init();
}

LinearAnimation.prototype.init = function () {
    var nr_control_points = this.control_points.length;
    this.length = 0;
    this.lines = [];
    for(var i = 0 ; i < nr_control_points - 1 ; i++){
        var x = this.control_points[i + 1]["xx"] - this.control_points[i]["xx"];
        var y = this.control_points[i + 1]["yy"] - this.control_points[i]["yy"];
        var z = this.control_points[i + 1]["zz"] - this.control_points[i]["zz"];
        var line_length = Math.sqrt(x*x + y*y + z*z);
        this.lines.push({'deltaX': x, 'deltaY': y, 'deltaZ': z, 'length': line_length});
        this.length += line_length;
    }
    var normal = vec3.fromValues(0, 1, 0);
    var vector1 = vec3.fromValues(1, 0, 1);    
    var v1_size = Math.sqrt(2);
    for(var i = 0 ; i < nr_control_points - 1 ; i++) {
        this.lines[i].time = this.lines[i].length * this.span / this.length;
        this.lines[i].velX = this.lines[i].deltaX / this.lines[i].time;
        this.lines[i].velY = this.lines[i].deltaY / this.lines[i].time;
        this.lines[i].velZ = this.lines[i].deltaZ / this.lines[i].time;
        var vector2 = vec3.fromValues(this.lines[i].deltaX, 0, this.lines[i].deltaZ);
        var v2_size = this.lines[i].length;
        var cross = vec3.create();
        vec3.cross(cross, vector1, vector2);
        var angle = Math.acos(vec3.dot(vector1, vector2) / (v1_size * v2_size));
        if (vec3.dot(normal, cross) < 0) angle *= -1;
        this.lines[i].angle = angle;
    }
    this.line = -1;
    this.angle = this.lines[0].angle;
    this.deltaX = 0;
    this.deltaY = 0;
    this.deltaZ = 0;
    this.startT = 0;
    this.lastT = 0;
};

LinearAnimation.prototype.update = function (time) {
    if (this.line == -1) {
        this.startT = time;
        this.lastT = time;
        this.line++;
    }
    if (this.line < this.control_points.length - 1) {
        var line = this.lines[this.line]
        var deltaT = (time - this.startT) / 1000;
        if (deltaT >= line.time) {
            this.line++;
            this.startT = time;
            this.deltaX = this.control_points[this.line]["xx"];
            this.deltaY = this.control_points[this.line]["yy"];
            this.deltaZ = this.control_points[this.line]["zz"];
            if (this.line < this.lines.length)
                this.angle = this.lines[this.line].angle;
        }
        else {
            var dT = (time - this.lastT) / 1000;
            this.deltaX += dT * line.velX;
            this.deltaY += dT * line.velY;
            this.deltaZ += dT * line.velZ;
        }
        this.lastT = time;
        return 0;
    }
    return 1;
};

LinearAnimation.prototype.apply = function () {
	this.scene.translate(this.deltaX, this.deltaY, this.deltaZ);	
	this.scene.rotate(this.angle, 0, 1, 0);
}
