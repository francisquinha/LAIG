
function deg2rad(degrees) {
	return degrees * Math.PI / 180;
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

	this.textures = new Map();
	this.animation_nodes = [];

	this.setUpdatePeriod(20);

};


XMLscene.prototype.initLights = function () {

	this.lights = [];
	this.lights_ids = []; // para cada id guarda-se a informação da lampada estar on/off 
	
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
		else {
			temp.disable();
		}
		this.lights[i] = temp; // adiciona luz da CGF 
		this.lights[i].ident = temp_id;	
		this.lights_ids[temp_id] = temp.enabled; 
 		i++;
	}

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
    this.textures["null"] = new CGFtexture(this, 'texture.png');
    this.textures["null"].amplif_factor = new Object();
    this.textures["null"].amplif_factor.s = 1;
    this.textures["null"].amplif_factor.t = 1;
    this.textures["null"].file = 'texture.png';

    for(var texture_id in this.graph.textures) {
    	var path = this.graph.textures[texture_id].file;
	    this.textures[texture_id] = new CGFtexture(this, path);
    	this.textures[texture_id].amplif_factor = this.graph.textures[texture_id].amplif_factor;
    	this.textures[texture_id].file = path;
	}
	this.enableTextures(true);

	// Nodes
	var root_node = this.graph.nodes[this.graph.nodes['root_id']];
	this.processNode(root_node);

};

// Display

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
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

	if (this.graph.loadedOk) {	

		this.initialTransform();

		for(var i = 0 ; i < this.lights.length ; i++){
			this.lights[i].update();
		}
		
		// Draw axis
		if (this.graph.initialsInformation.reference > 0) {
			this.axis.display();
		}	

		var root_node = this.graph.nodes[this.graph.nodes['root_id']];
		this.displayNode(root_node);

	}	

};

XMLscene.prototype.initialTransform = function() {
    var init = this.graph.initialsInformation;
    var t = init.translate;
    var s = init.scale;
    var r = init.rotation;

    this.translate(t.x, t.y, t.z);
    this.rotate(deg2rad(r.x), 1, 0, 0);
    this.rotate(deg2rad(r.y), 0, 1, 0);
    this.rotate(deg2rad(r.z), 0, 0, 1);
    this.scale(s.sx, s.sy, s.sz);
};

XMLscene.prototype.displayNode = function(node) {
	this.pushMatrix();
	this.applyTransformations(node);
	if (node.animations != undefined) {
		this.applyAnimations(node);
	}
	if (node.primitives != undefined) {
		for (i = 0; i < node.primitives.length; i++) {
			node.materials[i].apply();
			if (node.primitives[i] != undefined)
				node.primitives[i].display();
	  	}
	}i
	for (var i in node.descendants) {
		new_node_id = node.descendants[i];
		new_node = this.graph.nodes[new_node_id];
		if (new_node != undefined)
			this.displayNode(new_node);
	}
	this.popMatrix();
};

XMLscene.prototype.applyTransformations = function(node) {
	for (j = 0; j < node.transformations.length ; j++) {
		var transformation = node.transformations[j];
		switch (transformation.type) {
			case "scale":
				this.scale(transformation.sx, transformation.sy, transformation.sz);
				break;
			case "rotation":
				switch(transformation.axis) {
					case "x":
						this.rotate(deg2rad(transformation.angle), 1, 0, 0);
						break;
					case "y":
						this.rotate(deg2rad(transformation.angle), 0, 1, 0);
						break;
					case "z":
						this.rotate(deg2rad(transformation.angle), 0, 0, 1);
						break;
				}
				break;
			case "translation":
				this.translate(transformation.x, transformation.y, transformation.z);
				break;
		}
	}
}

XMLscene.prototype.applyAnimations = function(node) {
	var animation;
	if (node.current_anim < node.animations.length)
		animation = node.animations[node.current_anim];
	else
		animation = node.animations[node.animations.length - 1];
	animation.apply();
}

XMLscene.prototype.processLeaf = function(leaf, texture_id) {
	var s = 1;
	var t = 1;
	if (texture_id != "clear") {
		var texture = this.textures[texture_id];
		if (texture != undefined) {
			s = texture.amplif_factor.s;
			t = texture.amplif_factor.t;			
		}
	}
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
		case "plane":		
			primitive = new plane(this, leaf.args);
			break;
		case "patch":		
			primitive = new patch(this, leaf.args);
			break;
		case "terrain":		
			console.log(leaf.args);
			//primitive = new terrain(this, leaf.args);
			break;
	}
	return primitive;  
};

XMLscene.prototype.processNode = function(node) {
	var new_node_id;
	var new_node;
	var leaf;
	for (var i in node.descendants) {
		new_node_id = node.descendants[i];
		new_node = this.graph.nodes[new_node_id];
		if (new_node == undefined) {
			leaf = this.graph.leaves[new_node_id];
			if (leaf == undefined) {
				console.warn('Warning: Node ' + new_node_id + ' is not defined!\n')
			}
			else {
				node.primitives.push(this.processLeaf(leaf, node.texture));
				var material_info = this.graph.materials[node.material];
				console.log(material_info);
				var material;
				if (node.material == "null" || material_info == undefined) {
					console.warn('Warning: Material ' + node.material + ' is not defined!\n');
					material = new CGFappearance(this);
					material.setShininess(1);
					material.setSpecular(1, 1, 1, 1);
					material.setDiffuse(1, 1, 1, 1);
					material.setAmbient(1, 1, 1, 1);
					material.setEmission(0, 0, 0, 1);
					material.setTextureWrap('REPEAT', 'REPEAT');
				}
				else {
					material = new CGFappearance(this);
					material.setShininess(material_info.shininess);
					material.setSpecular(material_info.specular.r, material_info.specular.g, material_info.specular.b, material_info.specular.a);
					material.setDiffuse(material_info.diffuse.r, material_info.diffuse.g, material_info.diffuse.b, material_info.diffuse.a);
					material.setAmbient(material_info.ambient.r, material_info.ambient.g, material_info.ambient.b, material_info.ambient.a);
					material.setEmission(material_info.emission.r, material_info.emission.g, material_info.emission.b, material_info.emission.a);
				}
				var texture_id = node.texture;
				if (texture_id != "clear") {
					var texture = this.textures[texture_id];
					if (texture_id == "null" || texture == undefined) {
						console.warn('Warning: Texture ' + texture_id + ' is not defined!\n');
						texture = this.textures["null"];
					}
					material.setTexture(texture);			
				}
				node.materials.push(material);
				console.log(node);				
			}
		}		
		else {
			if (new_node.material == "null")
				new_node.material = node.material;
			if (new_node.texture == "null") 				
				new_node.texture = node.texture;
			if (new_node.animation_ids != undefined) {
				new_node.animations = [];
				new_node.current_anim = 0;
				for (j = 0; j < new_node.animation_ids.length ; j++) {
					var animation_id = new_node.animation_ids[j];
					var animation_stuff = this.graph.animations[animation_id];
					var animation;
					switch (animation_stuff.type) {
						case "linear":
							animation = new LinearAnimation(this, animation_stuff.span, animation_stuff.control_points);
							break;
						case "circular":
							animation = new CircularAnimation(this, animation_stuff.span, animation_stuff.radius, animation_stuff.center, animation_stuff.startang, animation_stuff.rotang);
							break;
					}
					new_node.animations.push(animation);
				}
				this.animation_nodes.push(new_node);
			}
			this.processNode(new_node);
		}		
	}
};

XMLscene.prototype.changeLightProperty = function(id, turned_on) {
    for (var i = 0; i < this.lights.length; i++) 
    {
        if (id == this.lights[i].ident) {
            if(turned_on)
            this.lights[i].enable();
            else this.lights[i].disable();
            break;
        }
    }
};

XMLscene.prototype.update = function(time) {
    for (var i = 0; i < this.animation_nodes.length; i++) {
    	var node = this.animation_nodes[i];
    	if (node.current_anim < node.animations.length) {
			var animation = node.animations[node.current_anim];
    		if (animation.update(time) == 1) {
    			this.animation_nodes[i].current_anim++;
    		}	
    	}
    }
};
