function triangle(scene, args, s, t) {

    CGFobject.call(this, scene);

    this.x0 = args[0];
    this.y0 = args[1];
    this.z0 = args[2];
    this.x1 = args[3];
    this.y1 = args[4];
    this.z1 = args[5];
    this.x2 = args[6];
    this.y2 = args[7];
    this.z2 = args[8];

	this.s = s || 1;
	this.t = t || 1;

    this.initBuffers();

};

triangle.prototype = Object.create(CGFobject.prototype);
triangle.prototype.constructor = triangle;

triangle.prototype.initBuffers = function() {

    this.vertices = [
    	this.x0, this.y0, this.z0,
    	this.x1, this.y1, this.z1,
    	this.x2, this.y2, this.z2
    ];

    this.indices = [
        0, 1, 2
    ];

    // compute normals
    var vector01 = vec3.fromValues(this.x1 - this.x0, this.y1 - this.y0, this.z1 - this.z0);
    var vector12 = vec3.fromValues(this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1);
    var normal = vec3.create();
    vec3.cross(normal, vector01, vector12);
    vec3.normalize(normal, normal);
	
	this.normals = [
		normal[0], normal[1], normal[2],
		normal[0], normal[1], normal[2],
		normal[0], normal[1], normal[2]
    ];

    // compute texCoords

   	var a = sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
   	var b = sqrt((x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0) + (z2 - z0) * (z2 - z0));
   	var c = sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0) + (z1 - z0) * (z1 - z0));
   	var cos_beta = (a * a - b * b + c * c) / (2 * a * c);
   	var sin_beta = sqrt(1 - cos_beta * cos_beta);

    this.texCoords = [
    	0, 0,
		c / this.s, 0,
		(c - a * cos_beta) / this.s, (a * sin_beta) / this.t
	];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    
};