
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
	
    


    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	

};


XMLscene.prototype.initLights = function () {

    this.shader.bind();

var i = 0;
for(light in this.graph.lights){

	this.lights[i].setPosition(this.graph.lights[light].position.x, this.graph.lights[light].position.y, this.graph.lights[light].position.z, this.graph.lights[light].position.w);
	this.lights[i].setDiffuse(this.graph.lights[light].diffuse.r, this.graph.lights[light].diffuse.g, this.graph.lights[light].diffuse.b, this.graph.lights[light].diffuse.a);
	this.lights[i].setAmbient(this.graph.lights[light].ambient.r, this.graph.lights[light].ambient.g, this.graph.lights[light].ambient.b, this.graph.lights[light].ambient.a);
	this.lights[i].setSpecular(this.graph.lights[light].specular.r, this.graph.lights[light].specular.g, this.graph.lights[light].specular.b, this.graph.lights[light].specular.a);
	this.lights[i].setVisible(true);

	if(this.graph.lights[light].enable){
	this.lights[i].enable();
	}
 i++;
}
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};


// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop

XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(this.graph.illumina.background[0],this.graph.illumina.background[1],this.graph.illumina.background[2],this.graph.illumina.background[3]);
	// Lights

	this.initLights();

    // Illumination
   

		// Background
		var illuBackground = this.graph.illumina.background;
		this.gl.clearColor(illuBackground.r, illuBackground.g, illuBackground.b, illuBackground.a);

		// Ambient
		var illuAmbient = this.graph.illumina.ambient;
		this.setGlobalAmbientLight(illuAmbient.r, illuAmbient.g, illuAmbient.b, illuAmbient.a);

	// Axis

	this.axis=new CGFaxis(this, this.graph.initialsInformation.reference);


    //Textures
     
    if (this.graph.textures.length > 0)
        this.enableTextures(true);

    var textures = this.graph.textures;
    for (var i = 0 ; i < textures.length ; i++) {
        var temp = new addTexture(this, textures[i].id, textures[i].file, textures[i].amplif_factor);

        this.textures.push(temp);
    }

    // Materials
    
    var materials = this.graph.materials;
    for (i = 0 ; i < materials.length ; i++) {
        temp = new addMaterial(this, materials[i].id);
        temp.setShininess(materials[i].shininess);
        temp.setSpecular(materials[i].specular.r, materials[i].specular.g, materials[i].specular.b, materials[i].specular.a);
        temp.setDiffuse(materials[i].diffuse.r, materials[i].diffuse.g, materials[i].diffuse.b, materials[i].diffuse.a);
        temp.setAmbient(materials[i].ambient.r, materials[i].ambient.g, materials[i].ambient.b, materials[i].ambient.a);
        temp.setEmission(materials[i].emission.r, materials[i].emission.g, materials[i].emission.b, materials[i].emission.a);
     
        this.materials.push(temp);
    }

};

// Functions to add Textures, Materials

function addTexture(scene, id, path, amplif_factor) {
    CGFtexture.call(this, scene, path);
    this.id = id;
    this.amplif_factor = amplif_factor;
}
addTexture.prototype = Object.create(CGFtexture.prototype);
addTexture.prototype.constructor = addTexture;

function addMaterial(scene, id) {
    CGFappearance.call(this, scene);
    this.id = id;
}
addMaterial.prototype = Object.create(CGFappearance.prototype);
addMaterial.prototype.constructor = addMaterial;

// Display

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it

	if (this.graph.loadedOk)
	{
		for(var i = 0 ; i < this.lights.length ; i++){

		this.lights[i].update();
		}
		
		// Draw axis
		this.axis.display();


		this.setDefaultAppearance();
		
	};	

    this.shader.unbind();
};

