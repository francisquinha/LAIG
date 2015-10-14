/**
 * cylinder
 * @constructor
 */
 function cylinder(scene, height, bottom, top, slices, stacks, minS, maxS, minT, maxT) {

 	CGFobject.call(this, scene);
	
	this.height = height;
	this.bottom = bottom;
	this.top = top;
	this.slices = slices;
	this.stacks = stacks;

	this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;

 	this.initBuffers();

};

 cylinder.prototype = Object.create(CGFobject.prototype);
 cylinder.prototype.constructor = cylinder;

 cylinder.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ang = 360 * degToRad / this.slices;

	var ind_j = 0;
	var aux_j = 4 * this.slices;

	var rad = (this.top - this.bottom) / this.stacks;
	var rad_now = this.bottom;

	var z_now = 0;
	var z = this.height / this.stacks;

	var tex_j = 0;
	var tex_j_add = 1/this.stacks;
	var tex_i_sub = 1/this.slices;
	
	for (j = 0; j < this.stacks; j++) {
		
		var ang_now = 0;
		var ang_then = ang;
		var ind_i = 0;
		var tex_i = 1;

		for (i = 0; i < this.slices; i++) {

			var x0 = rad_now * Math.cos(ang_now);
			var y0 = rad_now * Math.sin(ang_now);

			this.vertices.push(x0);
			this.vertices.push(y0);
			this.vertices.push(z_now); // vertice 0

			var x1 = rad_now * Math.cos(ang_then);
			var y1 = rad_now * Math.sin(ang_then);

			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(z_now); // vertice 1

			rad_now += rad;
			z_now += z;

			var x2 = rad_now * Math.cos(ang_now);
			var y2 = rad_now * Math.sin(ang_now);

			this.vertices.push(x2)
			this.vertices.push(y2);
			this.vertices.push(z_now); // vertice 2

			var x3 = rad_now * Math.cos(ang_then);
			var y3 = rad_now * Math.sin(ang_then);

			this.vertices.push(x3);
			this.vertices.push(y3);
 			this.vertices.push(z_now); // vertice 3

 			ang_now += ang;
			ang_then += ang;

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
			this.normals.push(x2);
			this.normals.push(y2);
			this.normals.push(0);
			
			// normal a vertice 3
            this.normals.push(x3);
			this.normals.push(y3);
			this.normals.push(0);

			// coordenadas textura
			this.texCoords.push(tex_i, tex_j);
			this.texCoords.push(tex_i - tex_i_sub, tex_j);
			this.texCoords.push(tex_i, tex_j + tex_j_add);
			this.texCoords.push(tex_i - tex_i_sub, tex_j + tex_j_add);

			tex_i -= tex_i_sub;

		}
					
		ind_j += aux_j;
		tex_j += tex_j_add;
	
	}
 	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 
 };
