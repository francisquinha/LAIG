/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks, minS,maxS, minT, maxT) {
 	CGFobject.call(this,scene);
	
	this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;

	this.slices=slices;
	this.stacks=stacks;
 	this.initBuffers();

};

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {

	var ang = 360 * degToRad / this.slices;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ind_j = 0;
	var aux_j = 4 * this.slices;
	
	for (j = 0; j < this.stacks; j++) {
		
		var ang_now = 0;
		var ind_i = 0;

		for (i = 0; i < this.slices; i++) {

			var x0 = Math.cos(ang_now);
			var y0 = Math.sin(ang_now);
			var z0 = j / this.stacks;

			ang_now += ang;

			var x1 = Math.cos(ang_now);
			var y1 = Math.sin(ang_now);
			var z1 = (j + 1) / this.stacks;

			this.vertices.push(x0);
			this.vertices.push(y0);
			this.vertices.push(z0); // vertice 0

			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(z0); // vertice 1

			this.vertices.push(x0)
			this.vertices.push(y0);
			this.vertices.push(z1); // vertice 2

			this.vertices.push(x1);
			this.vertices.push(y1);
 			this.vertices.push(z1); // vertice 3

 			var ind_i_j = ind_i + ind_j;

			this.indices.push(ind_i_j);		// 0
			this.indices.push(ind_i_j + 1); // 1
			this.indices.push(ind_i_j + 2); // 2

			this.indices.push(ind_i_j + 3); // 3
			this.indices.push(ind_i_j + 2); // 2
			this.indices.push(ind_i_j + 1); // 1

			ind_i += 4;

			// normal a vertice 0
			this.normals.push(x0);
			this.normals.push(y0);
			this.normals.push(0);
			
			// normal a vertice 1
            this.normals.push(x1);
			this.normals.push(y1);
			this.normals.push(0);

			// normal a vertice 2
			this.normals.push(x0);
			this.normals.push(y0);
			this.normals.push(0);
			
			// normal a vertice 3
            this.normals.push(x1);
			this.normals.push(y1);
			this.normals.push(0);

			// coordenadas textura
			this.texCoords.push(1 - i / this.slices, j / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
			this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);

		}			
		ind_j += aux_j;
	}
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
