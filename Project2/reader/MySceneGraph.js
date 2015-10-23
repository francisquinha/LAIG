function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	// Path to textures
	 
	this.path = "scenes/" + filename;
	this.reader.open(this.path, this);
	this.texture_path = this.path.substring(0, this.path.lastIndexOf("/")) + "/";	
}


/*
 * Callback to be executed after successful reading
 */
 
MySceneGraph.prototype.onXMLReady=function() 
{
	
	console.log("XML Loaded");
	
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Calls for different functions to parse the various blocks
	
	var error = this.parseInitials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseAnimations(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseIllumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	var error = this.parseTextures(rootElement);
	
		if (error != null) {
		this.onXMLError(error);
		return;
	}	

	
	var error = this.parseMaterials(rootElement);
	
		if (error != null) {
		this.onXMLError(error);
		return;
	}

	var error = this.parseLeaves(rootElement);
	
		if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseNodes(rootElement);
	
		if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
	
};

/*
 * Method that parses elements of Initials 
 */
 
MySceneGraph.prototype.parseInitials= function(rootElement) {
	
	console.log("\tInitials\n");

	this.initialsInformation = {}; // guarda todos os parametros de initials
	
	var elems =  rootElement.getElementsByTagName('INITIALS');

	// elems =  rootElement.getElementsByTagName("*"); procura tudo dentro de uma tag qualquer, se nao soubermos qual é a próxima que vem porque falhou a leitura
	var initials = elems[0]; 

	//Frustum
	
	var elems = initials.getElementsByTagName('frustum');
	if(elems.length == 0) {
	}
	
	
	
	
	//Translation
	
	this.initialsInformation.translate = {};
	
	
	//Rotation
	
	this.initialsInformation.rotation = {};



	
	//Scale
	
	elems = initials.getElementsByTagName('scale');
	this.initialsInformation.scale = {};

	//Reference

	elems = initials.getElementsByTagName('reference');
		

	var reference = elems[0];

	this.initialsInformation.reference = this.reader.getFloat(reference,'length',true);
	
	console.log(this.initialsInformation);
};

/*
 * Method that parses elements of Animation
 */

MySceneGraph.prototype.parseAnimations = function(rootElement) {
	
	console.log("\tAnimations\n");
	this.animations = {};

	var tag_animations = rootElement.getElementsByTagName('ANIMATIONS');
	if(tag_animations.length == 0) console.warn("No tag animations");
	else if(tag_animations.length > 1) return "More than one animations tag found";

	var all_animations = tag_animations[0];
	
	var animations = all_animations.getElementsByTagName("ANIMATION");
	if(animations.length == 0) console.warn("No animations");
	
	var currAnimation = {};
	
	var currControlPoints = [];
	for(var i = 0 ; i < animations.length ; i++){
		
		currAnimation["type"] = this.reader.getString(animations[i],"type",true);

		if(currAnimation["type"] == "linear")
		{
			currAnimation["id"]	= this.reader.getString(animations[i],"id",true);
			currAnimation["span"] = parseInt(this.reader.getString(animations[i],"span",true));
			var all_control_points = animations[i].getElementsByTagName("controlpoint");
			for(var j = 0 ; j < all_control_points.length ; j++)
			{
				var coord_x = this.reader.getFloat(all_control_points[j], "xx", true);
				var coord_y = this.reader.getFloat(all_control_points[j], "yy", true);
				var coord_z = this.reader.getFloat(all_control_points[j], "zz", true);

				if(isNaN(coord_x) || isNaN(coord_y) || isNaN(coord_z))
	                console.warn("xx = " + coord_x + ", yy = " + coord_y + ", zz = " + coord_z + ", at least one of those axis has no number!");
				
				currControlPoints["xx"] = coord_x;
				currControlPoints["yy"] = coord_y;
				currControlPoints["zz"] = coord_z;

				currAnimation["control_points"] = currControlPoints;
			}
		}
		else if(currAnimation["type"] == "circular")
			{
				currAnimation["id"]	= this.reader.getString(animations[i],"id",true);
				currAnimation["span"] = parseInt(this.reader.getString(animations[i],"span",true));
				
				var coords = this.reader.getString(animations[i],"center",true);
				currAnimation["center"]	= coords.trim().split(/\s+/);
				
				for(var j = 0 ; j < currAnimation['center'].length ; j++){
        		currAnimation['center'][j] = parseFloat(currAnimation['center'][j]);
				}
				
				currAnimation["radius"]	= parseFloat(this.reader.getString(animations[i],"radius",true));
				currAnimation["startang"] = parseFloat(this.reader.getString(animations[i],"startang",true));		
				currAnimation["rotang"]	= parseFloat(this.reader.getString(animations[i],"rotang",true));		
			}

		this.animations[currAnimation["id"]] = currAnimation;
	}

	console.log(this.animations);
};

/*
 * Method that parses elements of Illumination
 */
	
MySceneGraph.prototype.parseIllumination = function(rootElement) {
	console.log("\tIllumination\n");
	var illuminations = rootElement.getElementsByTagName('ILLUMINATION');

	// guarda todos os parametros de iluminacao
	
	this.illumina = {};

	//ambient
	}
	}
	
	//background

	{
	}
 	else{
 	}
	console.log(this.illumina);
}

/*
 * Method that parses elements of Lights
 */
 
MySceneGraph.prototype.parseLights = function(rootElement) {
	console.log("\tLights\n");
	var lights = rootElement.getElementsByTagName("LIGHTS");
	var light = lights[0];
	
	var tempLight = light.getElementsByTagName("LIGHT");
	}
};
	
/*
 * Method that parses elements of Textures
 */
 
MySceneGraph.prototype.parseTextures = function(rootElement) {
	console.log("\tTextures\n");
	var textures = rootElement.getElementsByTagName("TEXTURES");







	}
	console.log(this.textures);
};
	
/*
 * Method that parses elements of Materials
 */

MySceneGraph.prototype.parseMaterials = function(rootElement) {
	
	console.log("\tMaterials\n");
	
	this.materials = {};	
	
	var materials = rootElement.getElementsByTagName("MATERIALS");

	}
	console.log(this.materials);
};

/*
 * Methods that parses Geometric Transformations on Nodes
 */

/*
 * Translations
 */

MySceneGraph.prototype.parseTranslation = function(element) {
	
    var translations = [];
    
	translations["x"] = this.reader.getFloat(element, "x", true);
    translations["y"] = this.reader.getFloat(element, "y", true);
    translations["z"] = this.reader.getFloat(element, "z", true);
    
	for(var translation_i in translations){
    if(translations.hasOwnProperty(translation_i))
    {
		if(typeof(translations[translation_i]) != "number")
    }	
    }
    
	translations["type"] = "translation";
    
	return translations;
};

/*
 * Rotations
 */

MySceneGraph.prototype.parseRotation = function(element) {
  
	var rotations = [];
    
	rotations["axis"] = this.reader.getString(element, "axis", true);
    
    }
    
	rotations["angle"] = this.reader.getFloat(element, "angle", true);
    
	if(typeof(rotations["angle"]) != "number"){
    }
    
	rotations["type"] = "rotation";
    
	return rotations;
};
	
/*
 * Scales
 */

MySceneGraph.prototype.parseScale = function(element) {

    var scales = [];

    scales["sx"] = this.reader.getFloat(element, "sx", true);
    scales["sy"] = this.reader.getFloat(element, "sy", true);
    scales["sz"] = this.reader.getFloat(element, "sz", true);
    
	for(var scale_i in scales){
    
    if(scales.hasOwnProperty(scale_i)){
		if(typeof(scales[scale_i]) != "number")
        }
    }
    
	scales["type"] = "scale";
    
	return scales;

};

/*
 * Methods that parses Leaves
 */

MySceneGraph.prototype.parseLeaves = function(rootElement) {
		
	console.log("\tLeaves");
	
    var elems = rootElement.getElementsByTagName('LEAVES');

	var all_leaves = elems[0];
	
    this.leaves = {}; // para guardar os nos folha
	
    for (var i = 0; i < all_leaves.children.length ; i++)
    {
        var leaf = all_leaves.children[i];

		var arrangedArgsLeaf = {};
    	var argsWithSpace;

    	arrangedArgsLeaf['type'] = this.reader.getString(leaf, 'type', true);
    	argsWithSpace = this.reader.getString(leaf, 'args', true);
    	arrangedArgsLeaf['args'] = argsWithSpace.trim().split(/\s+/);
    	
    	for(var j = 0; j < arrangedArgsLeaf['args'].length; j++){
        	arrangedArgsLeaf['args'][j] = parseFloat(arrangedArgsLeaf['args'][j]);
    	}
    	this.leaves[leaf.id] = arrangedArgsLeaf;
    }
	console.log(this.leaves);	
};

/*
 * Methods that parses Nodes
 */

MySceneGraph.prototype.parseNodes= function(rootElement) {
	
	console.log("\tNodes");

    var elems = rootElement.getElementsByTagName('NODES');

    }

    if (elems.length != 1) {
        return "More than one NODES tag found.";
    }

    this.nodes = {};

    this.nodes['root_id'] = elems[0].children[0].id;
    var nNodes = elems[0].children.length;
    for (var i = 1 ; i < nNodes ; i++)
    {
        var element = elems[0].children[i];

        this.nodes[element.id] = this.parseNode(element);
    }
	 
	console.log(this.nodes);

};

MySceneGraph.prototype.parseNode = function(element) {

    var node = {};

    node['id'] =element.id;

    node['material'] = this.reader.getString(element.children[0], 'id', true);
    node['texture'] = this.reader.getString(element.children[1], 'id', true);

    var transformations = []; // guardado em array, numero de transformacoes e variavel

var i = 2; // item seguinte ao material e textura do no

    for( ; i < element.children.length ; i++){
     
	if(element.children[i].tagName === 'TRANSLATION'){
            transformations.push(this.parseTranslation(element.children[i]));
        }
		else if(element.children[i].tagName === 'ROTATION'){
            transformations.push(this.parseRotation(element.children[i]));
        }
		else if(element.children[i].tagName === 'SCALE'){
            transformations.push(this.parseScale(element.children[i]));
        } 
         else break; // caso nao tenha transformacoes de qualquer tipo avança para o parse dos descendentes
    }      

	node['transformations'] = transformations;
	node['descendants'] = this.parseDescendants(element.children[i]);
	node.primitives = [];
	node.matrices = [];
	node.materials = [];
	node.textures = [];	
        
   return node;
};

MySceneGraph.prototype.parseDescendants = function(element) {

    var descendants = [];

    for(var i = 0; i < element.children.length ; i++){
      descendants.push(this.reader.getString(element.children[i],'id', true));
    }
    
    return descendants;
};


/*
 * Callback to be executed on any read error
 */ 
 
MySceneGraph.prototype.onXMLError=function (message) {
	this.loadedOk=false;
};


MySceneGraph.prototype.findNode = function(id) {
    for (i = 0; i < this.nodes.length; i++)
        if (this.nodes[i].id == id) return this.nodes[i];

    return null;
};