function cube(scene, args) {
	CGFobject.call(this,scene);
	this.x_left = args[0];
	this.y_top = args[1];
	this.z_back = args[2];
	this.x_right = args[3];
	this.y_bottom = args[4];
	this.z_front = args[5];
	this.initBuffers();
};

cube.prototype = Object.create(CGFobject.prototype);
cube.prototype.constructor=cube;

cube.prototype.initBuffers = function () {
	this.vertices = [
            this.x_left, this.y_bottom, this.z_front, // 0
            this.x_right, this.y_bottom, this.z_front, // 1
            this.x_left, this.y_top, this.z_front, // 2
            this.x_right, this.y_top, this.z_front, // 3
            this.x_left, this.y_bottom, this.z_back, // 4
            this.x_right, this.y_bottom, this.z_back, // 5
            this.x_left, this.y_top, this.z_back, // 6
            this.x_right, this.y_top, this.z_back, // 7
			];

	this.indices = [
            0, 1, 2, // frente
			3, 2, 1, // frente
			1, 5, 3, // direita
			3, 5, 7, // direita
			3, 7, 6, // cima
			2, 3, 6, // cima
			2, 6, 4, // esquerda
			0, 2, 4, // esquerda
			0, 4, 1, // baixo
			1, 4, 5, // baixo
			6, 5, 4, // tras
			5, 6, 7  // tras
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
