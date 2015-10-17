/**
 * sphere
 * @constructor
 */
 function sphere(scene, args, s, t) {
 	CGFobject.call(this,scene);
	
	this.radius = args[0];
	this.stacks = args[1];
	this.slices = args[2];

	this.s = s || 1;
	this.t = t || 1;

 	this.initBuffers();
 };

 sphere.prototype = Object.create(CGFobject.prototype);
 sphere.prototype.constructor = sphere;

 sphere.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ang_0 = 2 * Math.PI / this.slices;
	var ang_1 = Math.PI / this.stacks;

	var ang_1_now = 0;
	var ang_1_then = ang_1;
	var ind_j = 0;
	var aux_j = 4 * this.slices;

	var tex_height = Math.PI * this.radius / this.t;
	var tex_length = 2 * Math.PI * this.radius / this.s;
	
	for (j = 0; j < this.stacks; j++) {
		
		var ang_0_now = 0;
		var ind_i = 0;

		for (i = 0; i < this.slices; i++) {

			var x0 = this.radius * Math.sin(ang_1_now) * Math.cos(ang_0_now);
			var y0 = this.radius * Math.cos(ang_1_now);
			var z0 = this.radius * Math.sin(ang_1_now) * Math.sin(ang_0_now);

			var x2 = this.radius * Math.sin(ang_1_then) * Math.cos(ang_0_now);
			var y2 = this.radius * Math.cos(ang_1_then);
			var z2 = this.radius * Math.sin(ang_1_then) * Math.sin(ang_0_now);

			ang_0_now += ang_0;

			var x1 = this.radius * Math.sin(ang_1_now) * Math.cos(ang_0_now);
			var y1 = this.radius * Math.cos(ang_1_now);
			var z1 = this.radius * Math.sin(ang_1_now) * Math.sin(ang_0_now);

			var x3 = this.radius * Math.sin(ang_1_then) * Math.cos(ang_0_now);
			var y3 = this.radius * Math.cos(ang_1_then);
			var z3 = this.radius * Math.sin(ang_1_then) * Math.sin(ang_0_now);

			this.vertices.push(x0);
			this.vertices.push(y0);
			this.vertices.push(z0); // vertice 0

			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(z1); // vertice 1

			this.vertices.push(x2)
			this.vertices.push(y2);
			this.vertices.push(z2); // vertice 2

			this.vertices.push(x3);
			this.vertices.push(y3);
 			this.vertices.push(z3); // vertice 3

 			var ind_i_j = ind_i + ind_j;

			this.indices.push(ind_i_j); 	// 0
			this.indices.push(ind_i_j + 1); // 1
			this.indices.push(ind_i_j + 2); // 2

			this.indices.push(ind_i_j + 3); // 3
			this.indices.push(ind_i_j + 2); // 2
			this.indices.push(ind_i_j + 1); // 1

			ind_i += 4;

			// normal a vertice 0
			this.normals.push(x0);
			this.normals.push(y0);
			this.normals.push(z0);
			
			// normal a vertice 1
            this.normals.push(x1);
			this.normals.push(y1);
			this.normals.push(z1);

			// normal a vertice 2
			this.normals.push(x2);
			this.normals.push(y2);
			this.normals.push(z2);
			
			// normal a vertice 3
            this.normals.push(x3);
			this.normals.push(y3);
			this.normals.push(z3);

			// coordenadas textura
/*			this.texCoords.push(tex_length * (1 - i / this.slices), tex_height * j / this.stacks);
			this.texCoords.push(tex_length * (1 - (i + 1) / this.slices), tex_height * j / this.stacks);
			this.texCoords.push(tex_length * (1 - i / this.slices), tex_height * (j + 1) / this.stacks);
			this.texCoords.push(tex_length * (1 - (i + 1) / this.slices), tex_height * (j + 1) / this.stacks);*/

			this.texCoords.push(1 - i / this.slices, j / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
			this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);

		}
					
		ang_1_now += ang_1;
		ang_1_then += ang_1;
		ind_j += aux_j;

	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 	
 };
