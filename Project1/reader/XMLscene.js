var deg2rad = Math.PI / 180;

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

	this.textures = [];
    this.materials = [];
    this.leaves = [];
    this.nodes = [];
	//

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
    for (var i = 0; i < this.graph.materials.length ; i++) {
        if (this.materials[i].id == "default") {
            this.materials[i].apply();
            break;
        }
    }
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

	this.axis = new CGFaxis(this, this.graph.initialsInformation.reference);


    //Textures
	var i = 0;
    for(var texture in this.graph.textures)
	{
    this.textures[i] = texture;
	i++;
	//console.log(texture);
    }
    if(this.textures.length > 0)
		this.enableTextures(true);
console.log(this.textures[0]);
    
/*
    // Materials
    
    var materials = this.graph.materials;
    //console.log(materials.length);
    for (i = 0 ; i < materials.length ; i++) {
        temp = new addMaterial(this, materials[i].id);
        temp.setShininess(materials[i].shininess);
        temp.setSpecular(materials[i].specular.r, materials[i].specular.g, materials[i].specular.b, materials[i].specular.a);
        temp.setDiffuse(materials[i].diffuse.r, materials[i].diffuse.g, materials[i].diffuse.b, materials[i].diffuse.a);
        temp.setAmbient(materials[i].ambient.r, materials[i].ambient.g, materials[i].ambient.b, materials[i].ambient.a);
        temp.setEmission(materials[i].emission.r, materials[i].emission.g, materials[i].emission.b, materials[i].emission.a);
     
        this.materials.push(temp);
    }
*/

/*
    // Leaves

    this.processLeaves();

    // Nodes

    this.processNodes();
*/
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
		this.setDefaultAppearance();
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

		this.setDefaultAppearance();
		
	

		 for (i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            this.pushMatrix();
            node.material.setTexture(node.texture);
            if (node.texture != null) {
                node.primitive.updateTex(node.texture.amplif_factor.s, node.texture.amplif_factor.t);
            }
            node.material.apply();
            this.multMatrix(node.matrix);
            node.primitive.display();
            this.popMatrix();
        }
	};	

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
                this.rotate(r[i].angle * deg2rad, 1, 0, 0);
                break;
            case 'y':
                this.rotate(r[i].angle * deg2rad, 0, 1, 0);
                break;
            case 'z':
                this.rotate(r[i].angle * deg2rad, 0, 0, 1);
                break;
        }
    }
    this.scale(s.sx, s.sy, s.sz);
};

XMLscene.prototype.processLeaves = function() {
    for (var i = 0; i < this.graph.leaves.length; i++) {
        var leaf = this.graph.leaves[i];
        switch (leaf.type) {
            case "rectangle":
                var primitive = new rectangle(this, leaf.args);
                primitive.id = leaf.id;
                this.leaves.push(primitive);
                break;
            case "cylinder":
                primitive = new cylinder(this, leaf.args);
                primitive.id = leaf.id;
                this.leaves.push(primitive);
                break;
            case "sphere":
                primitive = new sphere(this, leaf.args);
                primitive.id = leaf.id;
                this.leaves.push(primitive);
                break;
            case "triangle":
                primitive = new triangle(this, leaf.args);
                primitive.id = leaf.id;
                this.leaves.push(primitive);
                break;
        }
    }
};
//////////////////////////////////////////////////////////////
XMLscene.prototype.processNodes = function() {
   var nodes_list = this.graph.nodes;
   var root_node = this.graph.findNode(this.graph.root_id);
   this.searchNode(root_node, root_node.material, root_node.texture, root_node.matrix);
};
//////////////////////////////////////////////////////////////
XMLscene.prototype.searchNode = function(node, currMaterial, currTexture, currMatrix) {
    var nextMat = node.material;
    if (node.material == "null") nextMat = currMaterial;

    var nextTex = node.texture;
    if (node.texture == "null") nextTex = currTexture;
    else if (node.texture == "clear") nextTex = null;

    var nextMatrix = mat4.create();
    mat4.multiply(nextMatrix, currMatrix, node.matrix);

    for (var i = 0; i < node.descendants.length; i++) {
        var nextNode = this.graph.findNode(node.descendants[i]);

        if (nextNode == null) {
            var temp = new GlobalNode(node.descendants[i]);
            temp.material = this.getMaterial(nextMat);
            temp.texture = this.getTexture(nextTex);
            temp.matrix = nextMatrix;
            temp.isLeaf = true;
            for (var j = 0; j < this.leaves.length; j++) {
                if (this.leaves[j].id == temp.id) {
                    temp.primitive = this.leaves[j];
                    break;
                }
            }
            this.nodes.push(aux);
            continue;
        }

        this.searchNode(nextNode, nextMat, nextTex, nextMatrix);
    }
};

//////////////////////////////////////////////////////////////
XMLscene.prototype.getMaterial = function(id) {
    if (id == null) return null;

    for (var i = 0; i < this.materials.length; i++)
        if (id == this.materials[i].id) return this.materials[i];

    return null;
};
//////////////////////////////////////////////////////////////
XMLscene.prototype.getTexture = function(id) {
    if (id == null) return null;

    for (var i = 0; i < this.textures.length; i++)
        if (id == this.textures[i].id) return this.textures[i];

    return null;
};
//////////////////////////////////////////////////////////////
function addMaterial(scene, id) {
    CGFappearance.call(this, scene);
    this.id = id;
}
addMaterial.prototype = Object.create(CGFappearance.prototype);
addMaterial.prototype.constructor = addMaterial;
/////////////////////////////////////////////////////////////7
function addTexture(scene, id, file, amplif_factor) {
    CGFtexture.call(this, scene, file);
    this.id = id;
    this.amplif_factor = amplif_factor;
}
addTexture.prototype = Object.create(CGFtexture.prototype);
addTexture.prototype.constructor = addTexture;
/////////////////////////////////////////////////////////////7
function GlobalNode(id) {
    this.id = id;
    this.material = null;
    this.texture = null;
    this.matrix = null;
    this.primitive = null;
}

