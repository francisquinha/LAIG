/**
 * Plane
 * @constructor
 */

function Plane(scene, nrDivs) {
   	CGFobject.call(this,scene);
    
    
	// nrDivs = 1 if not provided
	nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;

    this.nrDivs = nrDivs;
      	
	this.patchLength = 1.0 / nrDivs;
	   	
   	this.surface = null;
   	this.translations = [];

	this.appearance = new CGFappearance(this.scene);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);
	this.texture = new CGFtexture(this.scene, "scenes/monster/textures/texture.jpg");
	this.appearance.setTexture(this.texture);
	this.appearance.setTextureWrap ('REPEAT', 'REPEAT');
	
	 this.makeSurface("0", 1, // degree on U: 2 control vertexes U
                                         1, // degree on V: 2 control vertexes on V
                                        [0, 0, 1, 1], // knots for U
                                        [0, 0, 1, 1], // knots for V
                                        [       // U = 0
                                                [ // V = 0..1;
                                                         [-0.5, -0.5, 0.0, 1 ],
                                                         [-0.5,  0.5, 0.0, 1 ]
                                                       
                                                ],
                                                // U = 1
                                                [ // V = 0..1
                                                         [ 0.5, -0.5, 0.0, 1 ],
                                                         [ 0.5,  0.5, 0.0, 1 ]                                                   
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

Plane.prototype = Object.create(CGFscene.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes, translation) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	
	getSurfacePoint = function(u, v) {
	return nurbsSurface.getPoint(u, v);
	};

	this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.nrDivs, this.nrDivs);
	//var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.nrDivs, this.nrDivs);
	//this.surfaces.push(obj);	
	this.translations.push(translation[0]);
	this.translations.push(translation[1]);
	this.translations.push(translation[2]);
}

Plane.prototype.display = function () 
{	
	//this.appearance.apply();

	//for (i = 0; i < this.surfaces.length ; i++) {
		this.scene.pushMatrix();
	
		this.scene.translate(this.translations[0], this.translations[1], this.translations[2]);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.surface.display();
	//	this.surfaces[i].display();
		this.scene.popMatrix();
	//}
}
