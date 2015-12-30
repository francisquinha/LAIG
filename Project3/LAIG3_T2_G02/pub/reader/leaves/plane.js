/**
 * plane
 * @constructor
 */

function plane(scene, nrDivs) {
   	CGFobject.call(this,scene);
    
	// nrDivs = 1 if not provided
	nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;

    this.nrDivs = nrDivs;
      	
	this.patchLength = 1.0 / nrDivs;
	   	
   	this.surface = null;
   	this.translations = [];

	this.testAppearance = new CGFappearance(this.scene);
	this.testAppearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.testAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.testAppearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.testAppearance.setShininess(120);
	this.texture = new CGFtexture(this.scene, "scenes/moon/textures/texture.jpg");
	this.testAppearance.setTexture(this.texture);
	this.testAppearance.setTextureWrap ('REPEAT', 'REPEAT');
	
	this.makeSurface("0", 1, // degree on U: 2 control vertexes U
                                         1, // degree on V: 2 control vertexes on V
                                        [0, 0, 1, 1], // knots for U
                                        [0, 0, 1, 1], // knots for V
                                        [       // U = 0
                                                [ // V = 0..1;
                                                         [-0.5, 0.0, 0.5, 1 ],
                                                         [-0.5,  0.0, -0.5, 1 ]
                                                       
                                                ],
                                                // U = 1
                                                [ // V = 0..1
                                                         [ 0.5, 0.0, 0.5, 1 ],
                                                         [ 0.5,  0.0, -0.5, 1 ]                                                   
                                                ]
                                        ],
					  //translation of surface 
					[0,0,0]);


	this.texCoords = [];
	for (var i = 0; j <= this.nrDivs; j++) 
	{
		for (var j = 0; i <= this.nrDivs; i++) 
		{
			this.texCoords.push(i * this.patchLength, j * this.patchLength);
		}
	}
}

plane.prototype = Object.create(CGFscene.prototype);
plane.prototype.constructor = plane;

plane.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes, translation) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	
	getSurfacePoint = function(u, v) {
	return nurbsSurface.getPoint(u, v);
	};

	this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.nrDivs, this.nrDivs);
	
	this.translations.push(translation[0]);
	this.translations.push(translation[1]);
	this.translations.push(translation[2]);
}

plane.prototype.display = function () 
{	
	//this.testAppearance.apply();
		this.scene.pushMatrix();
	
		this.scene.translate(this.translations[0], this.translations[1], this.translations[2]);
		this.surface.display();
	
		this.scene.popMatrix();
}
