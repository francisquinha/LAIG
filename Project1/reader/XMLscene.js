
var stackMatrix = [];
var stackMaterial = [];
var stackTexture = [];

var trf_matrix = mat4.create();		// create matrix

function deg2rad(degrees) {
	return degrees * Math.PI / 180;
}

function pushMatrixStack(someMatrix) {
	var copy = mat4.create();
	mat4.copy(copy, someMatrix);
	stackMatrix.push(copy);
}

function popMatrixStack() {
	if (stackMatrix.length == 0) {
	    throw "Invalid popMatrix!";
	}
	return stackMatrix.pop();
}

function checkMatrixStack() {
	var matrix = popMatrixStack();
	pushMatrixStack(matrix);
	return matrix;
}

function pushMaterialStack(someMaterial) {
	stackMaterial.push(someMaterial);
}

function popMaterialStack() {
	if (stackMatrix.length == 0) {
	    throw "Invalid popMaterial!";
	}
	return stackMaterial.pop();
}

function checkMaterialStack() {
	var material = stackMaterial.pop();
	pushMaterialStack(material);
	return material;
}

function pushTextureStack(someTexture) {
	stackTexture.push(someTexture);
}

function popTextureStack() {
	if (stackTexture.length == 0) {
	    throw "Invalid popMatrix!";
	}
	return stackTexture.pop();
}

function checkTextureStack() {
	var texture = popTextureStack();
	pushTextureStack(texture);
	return texture;
}


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

    //

	this.textures = new Map();
    this.materials = new Map();
    this.leaves = [];
    this.nodes = [];
	//


};

XMLscene.prototype.initLights = function () {

	this.lights = [];
	this.lights_ids = []; // para cada id guarda-se a informação da lampada estar on/off 
	
    this.shader.bind();

var i = 0;
for(light in this.graph.lights){

	var temp_id = this.graph.lights[light].id;
 	var temp = new CGFlight(this, i); 

	temp.setPosition(this.graph.lights[light].position.x, this.graph.lights[light].position.y, this.graph.lights[light].position.z, this.graph.lights[light].position.w);
	temp.setDiffuse(this.graph.lights[light].diffuse.r, this.graph.lights[light].diffuse.g, this.graph.lights[light].diffuse.b, this.graph.lights[light].diffuse.a);
	temp.setAmbient(this.graph.lights[light].ambient.r, this.graph.lights[light].ambient.g, this.graph.lights[light].ambient.b, this.graph.lights[light].ambient.a);
	temp.setSpecular(this.graph.lights[light].specular.r, this.graph.lights[light].specular.g, this.graph.lights[light].specular.b, this.graph.lights[light].specular.a);
	temp.setVisible(true);

	if(this.graph.lights[light].enable){
	temp.enable();
	}
	this.lights[i] = temp; // adiciona luz da CGF 
	this.lights[i].id = temp_id;	
	this.lights_ids[temp_id] = temp.enabled; 
 i++;
}
    this.shader.unbind();

    this.interface.create_gui_checkboxes();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
	this.materials["default"].apply();
};


// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop

XMLscene.prototype.onGraphLoaded = function () 
{
	// Lights

	this.initLights();

	

	// Frustum
    this.camera.near = this.graph.initialsInformation.frustum.near;
    this.camera.far = this.graph.initialsInformation.frustum.far;

	//this.gl.clearColor(this.graph.illumina.background[0],this.graph.illumina.background[1],this.graph.illumina.background[2],this.graph.illumina.background[3]);
	
    // Illumination
   

		// Background
		var illuBackground = this.graph.illumina.background;
		this.gl.clearColor(illuBackground.r, illuBackground.g, illuBackground.b, illuBackground.a);

		// Ambient
		var illuAmbient = this.graph.illumina.ambient;
		this.setGlobalAmbientLight(illuAmbient.r, illuAmbient.g, illuAmbient.b, illuAmbient.a);

	// Axis

	if (this.graph.initialsInformation.reference > 0) 
		this.axis = new CGFaxis(this, this.graph.initialsInformation.reference);

    //Textures
	var texture = this.graph.textures[texture_id];
    for(var texture_id in this.graph.textures)
	{
    this.textures[texture_id] = new CGFtexture(this, this.graph.textures[texture_id].file);
    this.textures[texture_id].amplif_factor = this.graph.textures[texture_id].amplif_factor;
    this.textures[texture_id].file = this.graph.textures[texture_id].file;

    console.log(this.textures[texture_id].amplif_factor);
    }

    
	this.enableTextures(true);

	//console.log(this.textures['yellow'].file);
		
    // Materials

	var material;
	for(var material_id in this.graph.materials)
	{
	material = this.graph.materials[material_id];
	
    this.materials[material_id] = new CGFappearance(this);
    this.materials[material_id].setShininess(material.shininess);
    this.materials[material_id].setSpecular(material.specular.r, material.specular.g, material.specular.b, material.specular.a);
    this.materials[material_id].setDiffuse(material.diffuse.r, material.diffuse.g, material.diffuse.b, material.diffuse.a);
    this.materials[material_id].setAmbient(material.ambient.r, material.ambient.g, material.ambient.b, material.ambient.a);
    this.materials[material_id].setEmission(material.emission.r, material.emission.g, material.emission.b, material.emission.a);
    }

 /*   this.defaultMaterial = new CGFappearance(this);
    this.materials["default"] = this.defaultMaterial;
    this.defaultTexture = new CGFtexture(this, "scenes/monster/textures/blue.jpg");
    this.defaultMaterial.setTexture(this.defaultTexture);
   */ 

	//console.log(this.materials['branco_brilhante'].file);

    // Nodes

    this.processNodes();

};

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
		//
		//this.setDefaultAppearance();
		//

		for(var i = 0 ; i < this.lights.length ; i++){
		this.lights[i].update();
		}
		
		// Draw axis
		if(this.axis.length > 0)
		{
			this.initialAxis();
			this.axis.display();
		}	
		
	
	    for (node_id in this.graph.nodes) {
	    	var node = this.graph.nodes[node_id];
	    	if (node.primitives != undefined) {
	    		
	    		for (i = 0; i < node.primitives.length; i++) {
					this.pushMatrix();
						node.materials[i].apply();
						this.multMatrix(node.matrices[i]);
						//console.log(node.materials[i]);
						
						node.primitives[i].display();
					this.popMatrix();
	    		}
	    	}
	    }
	}	

    this.shader.unbind();
};

XMLscene.prototype.initialAxis = function() {
    var init = this.graph.initialsInformation;
    var t = init.translate;
    var s = init.scale;
    var r = init.rotation;

    this.translate(t.x, t.y, t.z);
    for (var i = 0; i < r.length; i++) {
        switch (r[i].axis) {
            case 'x':
                this.rotate(deg2rad(r[i].angle), 1, 0, 0);
                break;
            case 'y':
                this.rotate(deg2rad(r[i].angle), 0, 1, 0);
                break;
            case 'z':
                this.rotate(deg2rad(r[i].angle), 0, 0, 1);
                break;
        }
    }
    this.scale(s.sx, s.sy, s.sz);
};


XMLscene.prototype.processLeaf = function(leaf) {
	
	var texture = stackTexture[stackTexture.length - 1];
	var s = texture.amplif_factor.s;
	var t = texture.amplif_factor.t;

	var primitive;

	switch (leaf.type) {
		case "rectangle":
			primitive = new rectangle(this, leaf.args, s, t);
			break;
		case "cylinder":
			primitive = new cylinder(this, leaf.args, s, t);
			break;
		case "sphere":
			primitive = new sphere(this, leaf.args, s, t);
			break;
		case "triangle":
			primitive = new triangle(this, leaf.args, s, t);
			break;
	}

	return primitive;
	   
};


XMLscene.prototype.processNodes = function() {
	mat4.identity(trf_matrix); 		// set matrix to identity
	pushMatrixStack(trf_matrix);	// place in stack
	//console.log('push ' + trf_matrix);

	var material = this.materials["default"];
	stackMaterial.push(material);

	var texture = this.textures["default"];
	stackTexture.push(texture);

	var root_id = this.graph.nodes['root'];
	var root_node = this.graph.nodes[root_id];

	//console.log('root ' + root_node);

	this.processNode(root_node);
//	stackMatrix.pop();
//	stackMaterial.pop();
//	stackTexture.pop();

	console.log('-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-');
	console.log('-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-');
	console.log('-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-');
	
};

XMLscene.prototype.preprocessNode = function(node) {
	var transform = mat4.create();
	mat4.identity(transform);
	for (j = 0; j < node.transformations.length ; j++) {
		var transformation = node.transformations[j];
		switch (transformation.type) {
			case "scale":
				mat4.scale(transform, transform, [transformation.sx, transformation.sy, transformation.sz]);
				break;
			case "rotation":
				switch(transformation.axis) {
					case "x":
						mat4.rotate(transform, transform, deg2rad(transformation.angle), [1, 0, 0]);
						break;
					case "y":
						mat4.rotate(transform, transform, deg2rad(transformation.angle), [0, 1, 0]);
						break;
					case "z":
						mat4.rotate(transform, transform, deg2rad(transformation.angle), [0, 0, 1]);
						break;
				}
				break;
			case "translation":
				mat4.translate(transform, transform, [transformation.x, transformation.y, transformation.z]);
				break;
		}
	}
	node.transformation = transform;
}


XMLscene.prototype.processNode = function(node) {
	this.preprocessNode(node);

//	var trf_matrix = popMatrixStack(); //stackMatrix[stackMatrix.length - 1];
//	if (node.descendants.length > 1)
//	pushMatrixStack(trf_matrix);
//	console.log('trf_ini ' + trf_matrix);
/*	for (j = node.transformations.length - 1; j >= 0 ; j--) {
		var transformation = node.transformations[j];
		switch (transformation.type) {
			case "scale":
				mat4.scale(trf_matrix, trf_matrix, [transformation.sx, transformation.sy, transformation.sz]);
				break;
			case "rotation":
				switch(transformation.axis) {
					case "x":
						mat4.rotate(trf_matrix, trf_matrix, deg2rad(transformation.angle), [1, 0, 0]);
						break;
					case "y":
						mat4.rotate(trf_matrix, trf_matrix, deg2rad(transformation.angle), [0, 1, 0]);
						break;
					case "z":
						mat4.rotate(trf_matrix, trf_matrix, deg2rad(transformation.angle), [0, 0, 1]);
						break;
				}
				break;
			case "translation":
				mat4.translate(trf_matrix, trf_matrix, [transformation.x, transformation.y, transformation.z]);
				break;
		}
	}
	*/
//	console.log(node);
//	console.log('transformation ' + node.transformation);
	mat4.multiply(trf_matrix, trf_matrix, node.transformation);
//	console.log('matrix ' + trf_matrix);
//	if (node.descendants.length > 1) {
		pushMatrixStack(trf_matrix);
//		console.log('push ' + trf_matrix);
//	}
	if (node.material == "null") {
		var material = checkMaterialStack();
		pushMaterialStack(material);
	}
	else
		pushMaterialStack(this.materials[node.material]);

	if (node.texture == "null") {
		var texture = checkTextureStack();
		pushTextureStack(texture);
	}
	else if (node.texture == "clear")
	 	pushTextureStack("clear");
	else
		pushTextureStack(this.textures[node.texture]);
	
	var new_node_id;
	var new_node;
	var leaf;
	for (var i in node.descendants) {
//		console.log('child ' + i)
		if (i > 0) {
			trf_matrix = checkMatrixStack();
//			console.log('check ' + trf_matrix);
		}
		new_node_id = node.descendants[i];
		new_node = this.graph.nodes[new_node_id];
		if (new_node == undefined) {
			leaf = this.graph.leaves[new_node_id];
			node.primitives.push(this.processLeaf(leaf));
			node.matrices.push(trf_matrix);
			var material = checkMaterialStack();
			var texture = checkTextureStack();
			material.loadTexture(texture.file);
			node.materials.push(material);
//    		node.materials.push(stackMaterial[stackMaterial.length - 1]);
//			node.textures.push(stackTexture[stackTexture.length - 1]);
			console.log(node);
			console.log(texture.file);
		}		
		else this.processNode(new_node);		
	}
	popMatrixStack();
	stackMaterial.pop();
	stackTexture.pop();	
};

XMLscene.prototype.changeLightProperty = function(id, turned_on) {
    for (var i = 0; i < this.lights.length; i++) 
    {
        if (id == this.lights[i].id) {
            if(turned_on)
            this.lights[i].enable();
            else this.lights[i].disable();
            break;
        }
    }
};