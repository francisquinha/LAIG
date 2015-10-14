/**
 * rectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

//rectangle e uma subclasse de CGFobject
function rectangle(scene, xbl, ybl, xtr, ytr, minS, maxS, minT, maxT) {

	CGFobject.call(this,scene);
	
	this.xbl = xbl;
	this.ybl = ybl;
	this.xtr = xtr;
	this.ytr = ytr;

	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;

	this.initBuffers();

};


rectangle.prototype = Object.create(CGFobject.prototype);
rectangle.prototype.constructor=rectangle;

rectangle.prototype.initBuffers = function () {
	this.vertices = [
		this.xbl, this.ybl,
		this.xtr, this.ybl,
		this.xbl, this.ytr, 
		this.xtr, this.ytr
	];

	this.indices = [
		0, 1, 2, 
		3, 2, 1,
    ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;

    this.normals = [
    	0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.texCoords = [    
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
	];

	this.initGLBuffers();
	
};
