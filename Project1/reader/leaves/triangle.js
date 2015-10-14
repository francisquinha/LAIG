function triangle(scene, x0, y0, z0, x1, y1, z1, x2, y2, z2) {

    CGFobject.call(this, scene);

    this.x0 = x0;
    this.y0 = y0;
    this.z0 = z0;
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

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

    this.texCoords = [
    	0, 0,
		1, 0,
		1, 1 // isto esta errado!
	];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    
};