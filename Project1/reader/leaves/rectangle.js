/**
 * rectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

//rectangle e uma subclasse de CGFobject
function rectangle(scene, args, s, t) {

	CGFobject.call(this,scene);
	
	this.x_left = args[0];
	this.y_top = args[1];
	this.x_right = args[2];
	this.y_bottom = args[3];

	// amplification factors
	this.s = s || 1;		
	this.t = t || 1;

	this.initBuffers();

};


rectangle.prototype = Object.create(CGFobject.prototype);
rectangle.prototype.constructor=rectangle;

rectangle.prototype.initBuffers = function () {
	this.vertices = [
		this.x_left, this.y_top, 0,
		this.x_left, this.y_bottom, 0,
		this.x_right, this.y_top, 0,
		this.x_right, this.y_bottom, 0,
	];

	this.indices = [
		0, 1, 2, 
		3, 2, 1
    ];

    this.normals = [
    	0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.texCoords = [    
		0, 0,
		0, (this.y_top - this.y_bottom) / this.t,
		(this.x_right - this.x_left) / this.s, 0,
		(this.x_right - this.x_left) / this.s, (this.y_top - this.y_bottom) / this.t
	];
/*
    this.texCoords = [    
		0, 0,
		0, this.t,
		this.s, 0,
		this.s, this.t
	];
*/
 	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
	
};
