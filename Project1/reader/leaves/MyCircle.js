/**
 * MyCircle
 * @constructor
 */
 function MyCircle(scene, slices, minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);
	
	this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;
	this.slices=slices;
	
 	this.initBuffers();
};

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {

	var ang = 360 * degToRad / this.slices;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ang_now = 0;
	var ind_i = 0;

	for (i = 0; i < this.slices; i++) {

		var x0 = Math.cos(ang_now);
		var y0 = Math.sin(ang_now);

		ang_now += ang;

		var x1 = Math.cos(ang_now);
		var y1 = Math.sin(ang_now);

		this.vertices.push(x0);
		this.vertices.push(y0);
		this.vertices.push(0); // vertice 0

		this.vertices.push(x1);
		this.vertices.push(y1);
		this.vertices.push(0); // vertice 1

		this.vertices.push(0)
		this.vertices.push(0);
		this.vertices.push(0); // vertice 2

		this.indices.push(ind_i); 	  // 0
		this.indices.push(ind_i + 1); // 1
		this.indices.push(ind_i + 2); // 2

		ind_i += 3;

		// normal a vertice 0
		this.normals.push(0);
		this.normals.push(0);
		this.normals.push(1);
		
		// normal a vertice 1
        this.normals.push(0);
		this.normals.push(0);
		this.normals.push(1);

		// normal a vertice 2
		this.normals.push(0);
		this.normals.push(0);
		this.normals.push(1);

		// coordenadas textura
		this.texCoords.push(x0 / 2 + 0.5, -y0 / 2 + 0.5);
		this.texCoords.push(x1 / 2 + 0.5, -y1 / 2 + 0.5);
		this.texCoords.push(0.5, 0.5);
	}
		
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();

 };
