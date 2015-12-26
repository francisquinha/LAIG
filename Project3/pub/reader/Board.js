
/** Represents a Board with nrDivs divisions along both axis, with center at (0,0) */
function Board(scene, nrDivs, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);

	// nrDivs = 1 if not provided
	nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;

	this.nrDivs = nrDivs;
	this.patchLength = 1.0 / nrDivs;

	this.minS = minS || 0;
	this.maxS = maxS || 1;

	this.minT = minT || 0;
	this.maxT = maxT || 1;

	this.patchLengthS = (this.maxS - this.minS) / this.nrDivs;
	this.patchLengthT = (this.maxT - this.minT) / this.nrDivs;

	this.initBuffers();
};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.initBuffers = function() {
	// Generate vertices, normals, and texCoords
	this.vertices = [];
	this.normals = [];
	this.texCoords = [];

	var yCoord = 0.5;

	for (var j = 0; j <= this.nrDivs; j++) {
		var xCoord = -0.5;

		for (var i = 0; i <= this.nrDivs; i++) {
			this.vertices.push(xCoord, yCoord, 0);

			this.normals.push(0, 0, 1);

			this.texCoords.push(this.minS + i * this.patchLengthS, this.minT + j * this.patchLengthT);

			xCoord += this.patchLength;
		}

		yCoord -= this.patchLength;
	}
	
	// Generating indices
	this.indices = [];
	var ind = 0;

	for (var j = 0; j < this.nrDivs; j++) {
		for (var i = 0; i <= this.nrDivs; i++) {
			this.indices.push(ind);
			this.indices.push(ind + this.nrDivs + 1);

			ind++;
		}

		if (j + 1 < this.nrDivs) {
			this.indices.push(ind + this.nrDivs);
			this.indices.push(ind);
		}
	}
	
	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};
