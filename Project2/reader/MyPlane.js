
/** Represents a MyPlane with nrDivs divisions along both axis, with center at (0,0) */
function MyPlane(scene, nrDivs, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);

	// nrDivs = 1 if not provided
	nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;

	this.nrDivs = nrDivs;

	this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;

	this.patchLength = 1.0 / nrDivs;

	this.initBuffers();
};

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.initBuffers = function() {
	/* example for nrDivs = 3 :
	(numbers represent index of point in vertices array)

	        y
        	^
	        |
	0    1  |  2    3
	        |
	4	 5	|  6    7
	--------|--------------> x
	8    9  |  10  11
	        |
	12  13  |  14  15    

	*/

	// Generate vertices and normals 
	this.vertices = [];
	this.normals = [];
	
	// Uncomment below to init texCoords
	this.texCoords = [];

	var zCoord = -0.5;

	var deltaS = this.maxS - this.minS;
	var deltaT = this.maxT - this.minT;

	for (var j = 0; j <= this.nrDivs; j++) 
	{
		var xCoord = -0.5;
		for (var i = 0; i <= this.nrDivs; i++) 
		{
			this.vertices.push(xCoord, 0, zCoord);
			
			// As this MyPlane is being drawn on the xy MyPlane, the normal to the MyPlane will be along the positive z axis.
			// So all the vertices will have the same normal, (0, 0, 1).
			
			this.normals.push(0,1,0);

			// texCoords should be computed here; uncomment and fill the blanks
			
			this.texCoords.push(i*deltaS / this.nrDivs + this.minS, j*deltaT / this.nrDivs + this.minT);

			xCoord += this.patchLength;
		}
		zCoord += this.patchLength;
	}
	
	// Generating indices
	/* for nrDivs = 3 output will be 
		[
			 0,  4, 1,  5,  2,  6,  3,  7, 
			    7,  4,
			 4,  8, 5,  9,  6, 10,  7, 11,
			   11,  8,
			 8, 12, 9, 13, 10, 14, 11, 15,
		]
	Interpreting this index list as a TRIANGLE_STRIP will draw rows of the MyPlane (with degenerate triangles in between. */

	this.indices = [];
	var ind=0;


	for (var j = 0; j < this.nrDivs; j++) 
	{
		for (var i = 0; i <= this.nrDivs; i++) 
		{
			this.indices.push(ind);
			this.indices.push(ind+this.nrDivs+1);

			ind++;
		}
		if (j+1 < this.nrDivs)
		{
			// Extra vertices to create degenerate triangles so that the strip can wrap on the next row
			// degenerate triangles will not generate fragments
			this.indices.push(ind+this.nrDivs);
			this.indices.push(ind);
		}
	}
	
	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;

/* Alternative with TRIANGLES instead of TRIANGLE_STRIP. More indices, but no degenerate triangles */
/*
	for (var j = 0; j < this.nrDivs; j++) 
	{
		for (var i = 0; i < this.nrDivs; i++) 
		{
			this.indices.push(ind, ind+this.nrDivs+1, ind+1);
			this.indices.push(ind+1, ind+this.nrDivs+1, ind+this.nrDivs+2 );

			ind++;
		}
		ind++;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
*/

	this.initGLBuffers();
};

