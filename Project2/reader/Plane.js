/**
 * Plane
 * @constructor
 */

function Plane(scene, nrDivs) {
   	CGFobject.call(this,scene);
    this.nrDivs = nrDivs;
      	
   	this.surfaces = [];
   	this.translations = [];

	this.appearance = new CGFappearance(this);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);
	//this.texture = new CGFtexture(this, "scenes/monster/textures/texture.jpg");
	//this.appearance.setTexture(this.texture);
	//this.appearance.setTextureWrap('REPEAT', 'REPEAT');
}

Plane.prototype = Object.create(CGFscene.prototype);
Plane.prototype.constructor = Plane;


Plane.prototype.init = function () {
	CGFscene.prototype.init.call(this, application);

    this.setUpdatePeriod(500);
	
	this.makeSurface("0", 1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							 vec4.fromValues ( -2.0, -2.0, 0.0, 1 ),
							 vec4.fromValues ( -2.0,  2.0, 0.0, 1 )
							
						],
						// U = 1
						[ // V = 0..1
							 vec4.fromValues ( 2.0, -2.0, 0.0, 1 ),
							 vec4.fromValues ( 2.0,  2.0, 0.0, 1 )							 
						]
					], // translation of surface 
					[-7.5,0,0]);

/*	this.makeSurface("1", 2, // degree on U: 3 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 0, 1, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							 vec4.fromValues ( -1.5, -1.5, 0.0, 1 ),
							 vec4.fromValues ( -1.5,  1.5, 0.0, 1 )
							
						],
						// U = 1
						[ // V = 0..1
							 vec4.fromValues ( 0, -1.5, 3.0, 1 ),
							 vec4.fromValues ( 0,  1.5, 3.0, 1 )							 
						],
						// U = 2
						[ // V = 0..1							 
							 vec4.fromValues ( 1.5, -1.5, 0.0, 1 ),
							 vec4.fromValues ( 1.5,  1.5, 0.0, 1 )
						]
					], // translation of surface 
					[-2.5,0,0]);

	this.makeSurface("2", 2, // degree on U: 3 control vertexes U
					 3, // degree on V: 4 control vertexes on V
					[0, 0, 0, 1, 1, 1], // knots for U
					[0, 0, 0, 0, 1, 1, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..3;
							 vec4.fromValues ( -1.5, -1.5, 0.0, 1 ),
							 vec4.fromValues ( -2.0, -2.0, 2.0, 1 ),
							 vec4.fromValues ( -2.0,  2.0, 2.0, 1 ),
							 vec4.fromValues ( -1.5,  1.5, 0.0, 1 )
							
						],
						// U = 1
						[ // V = 0..3
							 vec4.fromValues ( 0, 0, 3.0, 1 ),
							 vec4.fromValues ( 0, -2.0, 3.0, 5 ),
							 vec4.fromValues ( 0,  2.0, 3.0, 5 ),
							 vec4.fromValues ( 0,  0, 3.0, 1 )							 
						],
						// U = 2
						[ // V = 0..3							 
							 vec4.fromValues ( 1.5, -1.5, 0.0, 1 ),
							 vec4.fromValues ( 2.0, -2.0, 2.0, 1 ),
							 vec4.fromValues ( 2.0,  2.0, 2.0, 1 ),
							 vec4.fromValues ( 1.5,  1.5, 0.0, 1 )
						]
					], // translation of surface 
					[2.5,0,0]);

	this.makeSurface("3", 2, // degree on U: 3 control vertexes U
					3, // degree on V: 4 control vertexes on V
					[0, 0, 0, 1, 1, 1], // knots for U
					[0, 0, 0, 0, 1, 1, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..3;
							 vec4.fromValues ( -2.0, -2.0, 1.0, 1 ),
							 vec4.fromValues ( -2.0, -1.0, -2.0, 1 ),
							 vec4.fromValues ( -2.0, 1.0, 5.0, 1 ),
							 vec4.fromValues ( -2.0, 2.0, -1.0, 1 )
						],
						// U = 1
						[ // V = 0..3
							 vec4.fromValues ( 0, -2.0, 0, 1 ),
							 vec4.fromValues ( 0, -1.0, -1.0, 5 ),
							 vec4.fromValues ( 0, 1.0, 1.5, 5 ),
							 vec4.fromValues ( 0, 2.0, 0, 1 )
						],
						// U = 2
						[ // V = 0..3
							 vec4.fromValues ( 2.0, -2.0, -1.0, 1 ),
							 vec4.fromValues ( 2.0, -1.0, 2.0, 1 ),
							 vec4.fromValues ( 2.0, 1.0, -5.0, 1 ),
							 vec4.fromValues ( 2.0, 2.0, 1.0, 1 )
						]
					], // translation of surface 
					[7.5,0,0]);
*/
	//this.shader.unbind();
};

Plane.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes, translation) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this, getSurfacePoint, 20, 20 );
	this.surfaces.push(obj);	
	this.translations.push(translation);
}

Plane.prototype.display = function () 
{	
	//this.appearance.apply();
	for (i = 0; i < this.surfaces.length ; i++) {
		this.pushMatrix();
	
		this.translate(this.translations[i][0], this.translations[i][1], this.translations[i][2]);

		this.surfaces[i].display();
		this.popMatrix();
	}
}
