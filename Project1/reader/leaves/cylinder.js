/**
 * cylinder
 * @constructor
 */
 function cylinder(scene, args, s, t) {

 	CGFobject.call(this, scene);
	
	this.height = args[0];
	this.bottom = args[1];
	this.top = args[2];
	this.stacks = args[3];
	this.slices = args[4];

	this.s = s || 1;
	this.t = t || 1;

 	this.initBuffers();

};

 cylinder.prototype = Object.create(CGFobject.prototype);
 cylinder.prototype.constructor = cylinder;

 cylinder.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ang = 2 * Math.PI / this.slices;

	var ind_j = 0;
	var aux_j = 4 * this.slices;

	var rad = (this.top - this.bottom) / this.stacks;
	var rad_now = this.bottom;
	var rad_then = rad_now + rad;

	var z = this.height / this.stacks;
	var z_now = 0;
	var z_then = z_now + z;

	var tex_height = this.height / this.t;
	var tex_length = 2 * Math.PI * (this.bottom + (this.top - this.bottom) / 2)  / this.s;

	for (j = 0; j < this.stacks; j++) {
		
		var ang_now = 0;
		var ang_then = ang;
		var ind_i = 0;

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

			var x2 = rad_then * Math.cos(ang_now);
			var y2 = rad_then * Math.sin(ang_now);

			this.vertices.push(x2)
			this.vertices.push(y2);
			this.vertices.push(z_then); // vertice 2

			var x3 = rad_then * Math.cos(ang_then);
			var y3 = rad_then * Math.sin(ang_then);

			this.vertices.push(x3);
			this.vertices.push(y3);
 			this.vertices.push(z_then); // vertice 3

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
/*			this.texCoords.push(tex_length * (1 - i / this.slices), tex_height * j / this.stacks);
			this.texCoords.push(tex_length * (1 - (i + 1) / this.slices), tex_height * j / this.stacks);
			this.texCoords.push(tex_length * (1 - i / this.slices), tex_height * (j + 1) / this.stacks);
			this.texCoords.push(tex_length * (1 - (i + 1) / this.slices), tex_height * (j + 1) / this.stacks);*/

			this.texCoords.push(1 - i / this.slices, j / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
			this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);
		}
					
		rad_now += rad;
		rad_then += rad;
		z_now += z;
		z_then += z;
		ind_j += aux_j;
	
	}
 	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 
 };
