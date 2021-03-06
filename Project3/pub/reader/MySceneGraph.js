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
	
	this.types = ["plane","patch","terrain"];
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
	if (elems.length == 0) {
		console.warn("Warning: initial tag is missing!"); 
		elems =  rootElement.getElementsByTagName("*");
	} // tem e que terminar e acabar na mesma tag mal escrita
	var initials = elems[0]; 

	//Frustum
	
	this.initialsInformation.frustum = {};	
	var elems = initials.getElementsByTagName('frustum');
	
	if(elems.length == 0) {
		console.warn("Warning: frustum tag is missing!");
		this.initialsInformation.frustum['near'] = 0.1;
		this.initialsInformation.frustum['far'] = 500;
	}
	
	else {
		var frustum = elems[0];
	
		this.initialsInformation.frustum['near'] = this.reader.getFloat(frustum,'near',true);
		this.initialsInformation.frustum['far'] = this.reader.getFloat(frustum,'far',true);
		
		if (isNaN(this.initialsInformation.frustum['near'])) {
			console.warn("Warning: frustum near invalid. It must be a float."); 
			this.initialsInformation.frustum['near'] = 0.1;
		}
		if(isNaN(this.initialsInformation.frustum['far'])) {
			console.warn("Warning: frustum far invalid. It must be a float.") ; 
			this.initialsInformation.frustum['far'] = 500;
		}
	}
	
	
	//Translation
	
	this.initialsInformation.translate = {};
	elems = initials.getElementsByTagName('translation');
	if (elems.length == 0)  {
		console.warn("Warning: translation tag is missing!");
		this.initialsInformation.translate['x'] = 0;
		this.initialsInformation.translate['y'] = 0;
		this.initialsInformation.translate['z'] = 0;
	}
	else {
		var translate = elems[0];
	
		this.initialsInformation.translate['x'] = this.reader.getFloat(translate,'x',true);
		this.initialsInformation.translate['y'] = this.reader.getFloat(translate,'y',true);
		this.initialsInformation.translate['z'] = this.reader.getFloat(translate,'z',true);
	
		if(isNaN(this.initialsInformation.translate['x'])) {
			console.warn("Warning: value of the translation axis must be a float!"); 
			this.initialsInformation.translate['x'] = 0;
		}
		if(isNaN(this.initialsInformation.translate['y'])) {
			console.warn("Warning: value of the translation axis must be a float!"); 
			this.initialsInformation.translate['y'] = 0;
		}
		if(isNaN(this.initialsInformation.translate['z'])) {
			console.warn("Warning: value of the translation axis must be a float!"); 
			this.initialsInformation.translate['z'] = 0;
		}
	}
	
	//Rotation
	
	this.initialsInformation.rotation = {};

	elems = initials.getElementsByTagName('rotation');
	if (elems.length == 0)  {
		console.warn("Warning: rotation tag is missing!");
		this.initialsInformation.rotation['x'] = 0;
		this.initialsInformation.rotation['y'] = 0;
		this.initialsInformation.rotation['z'] = 0;
	}
	else if (elems.length != 3) {
		console.warn("Warning: there must be the 3 rotations - in x,y,z axis!");
		this.initialsInformation.rotation['x'] = 0;
		this.initialsInformation.rotation['y'] = 0;
		this.initialsInformation.rotation['z'] = 0;
	} 
	else {
		for(var i = 0 ; i < 3 ; i++)
		{
			this.initialsInformation.rotation[this.reader.getString(elems[i],'axis',true)] = this.reader.getFloat(elems[i],'angle',true);
		}
		
		if(isNaN(this.initialsInformation.rotation[this.reader.getString(elems[0],'axis',true)])){
			console.warn("Warning: value of the rotation in x axis must be a float!"); 
			this.initialsInformation.rotation['x'] = 0;
		} 
		if(isNaN(this.initialsInformation.rotation[this.reader.getString(elems[1],'axis',true)])) {
			console.warn("Warning: value of the rotation in y axis must be a float!"); 
			this.initialsInformation.rotation['y'] = 0;
		} 
		if(isNaN(this.initialsInformation.rotation[this.reader.getString(elems[2],'axis',true)])) {
			console.warn("Warning: value of the rotation in z axis must be a float!"); 
			this.initialsInformation.rotation['z'] = 0;
		} 
	
		//verifica se os eixos colocados sao de facto o x, o y e o z e se estao pela ordem devida
		if(this.reader.getString(elems[0],'axis',true) != "x") console.warn("Warning: value of the first rotation axis must be x!");
		if(this.reader.getString(elems[1],'axis',true) != "y") console.warn("Warning: value of the second rotation axis must be y!");
		if(this.reader.getString(elems[2],'axis',true) != "z") console.warn("Warning: value of the third rotation axis must be z!");

	}

	
	//Scale
	
	elems = initials.getElementsByTagName('scale');
	this.initialsInformation.scale = {};
	if (elems == undefined || elems.length == 0)  {
		console.warn("Warning: scale tag is missing!");
		this.initialsInformation.scale['sx'] = 1;
		this.initialsInformation.scale['sy'] = 1;
		this.initialsInformation.scale['sz'] = 1;
	}
	else {
		var scale = elems[0];

		this.initialsInformation.scale["sx"] = this.reader.getFloat(scale,'sx',true);
		this.initialsInformation.scale["sy"] = this.reader.getFloat(scale,'sy',true);
		this.initialsInformation.scale["sz"] = this.reader.getFloat(scale,'sz',true);
		
		if(isNaN(this.initialsInformation.scale["sx"])) {
			console.warn("Warning: value of the scale in x axis must be a float!"); 
			this.initialsInformation.scale['sx'] = 1;
		} 
		if(isNaN(this.initialsInformation.scale["sy"])) {
			console.warn("Warning: value of the scale in y axis must be a float!"); 
			this.initialsInformation.scale['sy'] = 1;
		}
		if(isNaN(this.initialsInformation.scale["sz"])) {
			console.warn("Warning: value of the scale in z axis must be a float!"); 
			this.initialsInformation.scale['sz'] = 1;
		}	
	}
	
	//Reference

	elems = initials.getElementsByTagName('reference');
		
	if (elems.length == 0)  {
		console.warn("Warning: reference tag is missing!");
	}

	var reference = elems[0];

	this.initialsInformation.reference = this.reader.getFloat(reference,'length',true);
	if(isNaN(this.initialsInformation.reference)) {
		console.warn("Warning: value of the reference axis must be a float!"); 
		this.initialsInformation.reference = 5;
	}
	
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
	
	for(var i = 0 ; i < animations.length ; i++){
		var currAnimation = {};
		var currControlPoints = [];

		currAnimation["id"]	= this.reader.getString(animations[i],"id",true);
		currAnimation["span"] = this.reader.getFloat(animations[i],"span",true);
		currAnimation["type"] = this.reader.getString(animations[i],"type",true);

		if(currAnimation["type"] == "linear")
		{
			var all_control_points = animations[i].getElementsByTagName("controlpoint");
		
			for(var j = 0 ; j < all_control_points.length ; j++)
			{
				var coord_x = this.reader.getFloat(all_control_points[j], "xx", true);
				var coord_y = this.reader.getFloat(all_control_points[j], "yy", true);
				var coord_z = this.reader.getFloat(all_control_points[j], "zz", true);
				if(isNaN(coord_x) || isNaN(coord_y) || isNaN(coord_z))
	                console.warn("xx = " + coord_x + ", yy = " + coord_y + ", zz = " + coord_z + ", at least one of those axis has no number!");
				
				var ctrlPoint = {};
				ctrlPoint["xx"] = coord_x;
				ctrlPoint["yy"] = coord_y;
				ctrlPoint["zz"] = coord_z;
						
				currControlPoints[j] = ctrlPoint;
			}
			currAnimation["control_points"] = currControlPoints;
		}
		else if(currAnimation["type"] == "circular"){
			
				var coords = this.reader.getString(animations[i],"center",true);
				currAnimation["center"]	= coords.trim().split(/\s+/);
				
				for(var j = 0 ; j < currAnimation['center'].length ; j++){
        		currAnimation['center'][j] = parseFloat(currAnimation['center'][j]);
				}
				
				currAnimation["radius"]	= parseFloat(this.reader.getString(animations[i],"radius",true));
				currAnimation["startang"] = parseFloat(this.reader.getString(animations[i],"startang",true));		
				currAnimation["rotang"]	= parseFloat(this.reader.getString(animations[i],"rotang",true));		
			}
		else if(currAnimation["type"] == "circularAxis"){
			
				var coords = this.reader.getString(animations[i],"center",true);
				currAnimation["center"]	= coords.trim().split(/\s+/);
				
				for(var j = 0 ; j < currAnimation['center'].length ; j++){
        		currAnimation['center'][j] = parseFloat(currAnimation['center'][j]);
				}
				
				currAnimation["radius"]	= parseFloat(this.reader.getString(animations[i],"radius",true));
				currAnimation["startang"] = parseFloat(this.reader.getString(animations[i],"startang",true));		
				currAnimation["rotang"]	= parseFloat(this.reader.getString(animations[i],"rotang",true));		

				coords = this.reader.getString(animations[i],"axis",true);
				currAnimation["axis"]	= coords.trim().split(/\s+/);
				for(var j = 0 ; j < currAnimation['axis'].length ; j++){
        		currAnimation['axis'][j] = parseFloat(currAnimation['axis'][j]);
				}
			}
			else console.error(currAnimation['type'] + " doesn't exist!");

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
	var ambients;
	var backgrounds;
	if(illuminations.length == 0) {
		console.warn("Warning: illumination tag is missing!");
	}
	else {
		// iluminationElems possui ambient e background
		var illuminationElems = illuminations[0];
		ambients = illuminationElems.getElementsByTagName("ambient");
		backgrounds = illuminationElems.getElementsByTagName("background");
	}

	// guarda todos os parametros de iluminacao
	
	this.illumina = {};

	//ambient
	if(ambients == undefined || ambients.length == 0) {
		console.warn("Warning: ambient tag does not exist!");
		this.illumina.ambient = {};
		this.illumina.ambient["r"] = 0.25;
		this.illumina.ambient["g"] = 0.25;
		this.illumina.ambient["b"] = 0.25;
		this.illumina.ambient["a"] = 1;
	}
	else {
		var ambient = ambients[0];
		this.illumina.ambient = {};
		this.illumina.ambient["r"] = this.reader.getFloat(ambient, "r", true);
		this.illumina.ambient["g"] = this.reader.getFloat(ambient, "g", true);
		this.illumina.ambient["b"] = this.reader.getFloat(ambient, "b", true);
		this.illumina.ambient["a"] = this.reader.getFloat(ambient, "a", true);
	}
	
	//background

	if(backgrounds == undefined || backgrounds.length == 0)
	{
		console.warn("Warning: ambient tag does not exist!");
		this.illumina.background = {};
		this.illumina.background["r"] = 0;
		this.illumina.background["g"] = 0;
		this.illumina.background["b"] = 0;
		this.illumina.background["a"] = 1;
	}
 	else{
		var background = backgrounds[0];
		this.illumina.background = {};
		this.illumina.background["r"] = this.reader.getFloat(background, "r", true);
		this.illumina.background["g"] = this.reader.getFloat(background, "g", true);
		this.illumina.background["b"] = this.reader.getFloat(background, "b", true);
		this.illumina.background["a"] = this.reader.getFloat(background, "a", true);
 	}
	console.log(this.illumina);
}

/*
 * Method that parses elements of Lights
 */
 
MySceneGraph.prototype.parseLights = function(rootElement) {
	console.log("\tLights\n");
	var lights = rootElement.getElementsByTagName("LIGHTS");
	if(lights.length == 0) console.warn("Warning: lights tag is missing!");
	else {
	var light = lights[0];
	
	var tempLight = light.getElementsByTagName("LIGHT");
	if(tempLight.length == 0) console.warn("Warning: no lights found!");

		this.lights = {};
	
		for(var i = 0 ; i < tempLight.length ; i++) {
			var currLight = {};
			
			currLight["id"] = this.reader.getString(tempLight[i],"id",true);
	
			var enables = tempLight[i].getElementsByTagName("enable");
			var enable = enables[0];
			currLight["enable"] = this.reader.getBoolean(enable, "value", true);
	
			//position
			var positions = tempLight[i].getElementsByTagName("position");
			var pos = positions[0];
			currLight["position"] = {};
			currLight["position"]["x"] = this.reader.getFloat(pos, "x", true);
			currLight["position"]["y"] = this.reader.getFloat(pos, "y", true);
			currLight["position"]["z"] = this.reader.getFloat(pos, "z", true);
			currLight["position"]["w"] = this.reader.getFloat(pos, "w", true);
	
			//Illumination components
			
			var ambients = tempLight[i].getElementsByTagName("ambient");
			var ambient = ambients[0];
			currLight["ambient"] = {};
			currLight["ambient"]["r"] = this.reader.getFloat(ambient, "r", true);
			currLight["ambient"]["g"] = this.reader.getFloat(ambient, "g", true);
			currLight["ambient"]["b"] = this.reader.getFloat(ambient, "b", true);
			currLight["ambient"]["a"] = this.reader.getFloat(ambient, "a", true);
			
			var diffuses = tempLight[i].getElementsByTagName("diffuse");
			var diff = diffuses[0];
			currLight["diffuse"] = {};
			currLight["diffuse"]["r"] = this.reader.getFloat(diff, "r", true);
			currLight["diffuse"]["g"] = this.reader.getFloat(diff, "g", true);
			currLight["diffuse"]["b"] = this.reader.getFloat(diff, "b", true);
			currLight["diffuse"]["a"] = this.reader.getFloat(diff, "a", true);
			
			var speculars = tempLight[i].getElementsByTagName("specular");
			var spec = speculars[0];
			currLight["specular"] = {};
			currLight["specular"]["r"] = this.reader.getFloat(spec, "r", true);
			currLight["specular"]["g"] = this.reader.getFloat(spec, "g", true);
			currLight["specular"]["b"] = this.reader.getFloat(spec, "b", true);
			currLight["specular"]["a"] = this.reader.getFloat(spec, "a", true);
	
			this.lights[currLight["id"]] = currLight;
		}
		console.log(this.lights);
	}
};
	
/*
 * Method that parses elements of Textures
 */
 
MySceneGraph.prototype.parseTextures = function(rootElement) {
	console.log("\tTextures\n");

	this.textures = {};

	var textures = rootElement.getElementsByTagName("TEXTURES");
	if(textures.length == 0) {
		console.warn("Warning: textures tag is missing!");
	}
	else {
		var all_textures = textures[0];

		var tag_texture = all_textures.getElementsByTagName("TEXTURE");
		if (tag_texture.length == 0) console.warn("Warning: no textures found!");

		for(var i = 0 ; i < tag_texture.length ; i++) {
			var currText = {};

			//Texture components		
			currText["id"] = this.reader.getString(tag_texture[i],"id",true);

			var path = tag_texture[i].getElementsByTagName("file"); // relative path to index file

			var file = path[0];

			currText["file"] = this.texture_path + this.reader.getString(file,"path",true);

			var amplifactor = tag_texture[i].getElementsByTagName("amplif_factor");
			if (amplifactor == undefined || amplifactor.length == 0) {
				console.warn("Warning: amplification factor for texture missing!");	
				currText["amplif_factor"]["s"] = 1;
				currText["amplif_factor"]["t"] = 1;
			}
			else {
				var ampli_factor = amplifactor[0];
				currText["amplif_factor"] = {};
				currText["amplif_factor"]["s"] = this.reader.getFloat(ampli_factor,"s",true);
				currText["amplif_factor"]["t"] = this.reader.getFloat(ampli_factor,"t",true);
			}

			this.textures[currText["id"]] = currText;
		}
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
	if(materials.length == 0) {
		console.warn("Warning: materials tag is missing!");
	}
	else {
		var all_materials = materials[0];
	
		var material = all_materials.getElementsByTagName("MATERIAL");
		if (material.length == 0) console.warn("Warning: no materials found!");
		else {
			for(var i = 0 ; i < material.length ; i++) {
				var currMaterial = {};

				//Material components

				currMaterial["id"] = this.reader.getString(material[i],"id",true);

				var shininess = material[i].getElementsByTagName("shininess");
				var valor = shininess[0];
				currMaterial["shininess"] = this.reader.getString(valor,"value",true);

				var speculars = material[i].getElementsByTagName("specular");
				var spec = speculars[0];

				currMaterial["specular"]={};
				currMaterial["specular"]["r"] = this.reader.getFloat(spec, "r", true);
				currMaterial["specular"]["g"] = this.reader.getFloat(spec, "g", true);
				currMaterial["specular"]["b"] = this.reader.getFloat(spec, "b", true);
				currMaterial["specular"]["a"] = this.reader.getFloat(spec, "a", true);

				var diffuses = material[i].getElementsByTagName("diffuse");
				var diff = diffuses[0];
				currMaterial["diffuse"] = {};
				currMaterial["diffuse"]["r"] = this.reader.getFloat(diff, "r", true);
				currMaterial["diffuse"]["g"] = this.reader.getFloat(diff, "g", true);
				currMaterial["diffuse"]["b"] = this.reader.getFloat(diff, "b", true);
				currMaterial["diffuse"]["a"] = this.reader.getFloat(diff, "a", true);

				var ambients = material[i].getElementsByTagName("ambient");
				var ambient = ambients[0];
				currMaterial["ambient"] = {};
				currMaterial["ambient"]["r"] = this.reader.getFloat(ambient, "r", true);
				currMaterial["ambient"]["g"] = this.reader.getFloat(ambient, "g", true);
				currMaterial["ambient"]["b"] = this.reader.getFloat(ambient, "b", true);
				currMaterial["ambient"]["a"] = this.reader.getFloat(ambient, "a", true);

				var emissions = material[i].getElementsByTagName("emission");
				var emission = emissions[0];
				currMaterial["emission"] = {};
				currMaterial["emission"]["r"] = this.reader.getFloat(emission, "r", true);
				currMaterial["emission"]["g"] = this.reader.getFloat(emission, "g", true);
				currMaterial["emission"]["b"] = this.reader.getFloat(emission, "b", true);
				currMaterial["emission"]["a"] = this.reader.getFloat(emission, "a", true);

				this.materials[currMaterial["id"]] = currMaterial;
			}
		}
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
			console.warn("Warning: translation " + translation_i + " has an error.");
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
    
	if(rotations["axis"] != "x" && rotations["axis"] != "y" && rotations["axis"] != "z"){
		console.warn("Warning: rotation with no good axis to rotate!");
    }
    
	rotations["angle"] = this.reader.getFloat(element, "angle", true);
    
	if(typeof(rotations["angle"]) != "number"){
        console.warn("Warning: rotation angle must be a number!");
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
                console.warn("Warning: scale " + scale_i + " has an error!");
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
    if(elems.length == 0) return "Leaves tag is missing.";
    if(elems.length != 1) return "More than one LEAVES tag found.";

	var all_leaves = elems[0];
	
    this.leaves = {}; // para guardar os nos folha
	
    for (var i = 0; i < all_leaves.children.length ; i++)
    {
        var leaf = all_leaves.children[i];

		var arrangedArgsLeaf = {};
    	var argsWithSpace;
		
    	arrangedArgsLeaf['type'] = this.reader.getString(leaf, 'type', true);
		if(this.findType(arrangedArgsLeaf['type'])){ // no caso de ser uma nova primitiva, faz parse à parte
			this.leaves[leaf.id] = this.parseNurbsandShaders(leaf, arrangedArgsLeaf['type']);
		}	
		else
		{
    	argsWithSpace = this.reader.getString(leaf, 'args', true);
    	arrangedArgsLeaf['args'] = argsWithSpace.trim().split(/\s+/);
    	for(var j = 0; j < arrangedArgsLeaf['args'].length; j++){
        	arrangedArgsLeaf['args'][j] = parseFloat(arrangedArgsLeaf['args'][j]);
    	}
    	this.leaves[leaf.id] = arrangedArgsLeaf;
		}
    }
	console.log(this.leaves);	
};


/*
 * Methods that parses Nodes
 */

MySceneGraph.prototype.parseNodes= function(rootElement) {
	console.log("\tNodes");
    var elems = rootElement.getElementsByTagName('NODES');
    if (elems.length == 0) {
        return "NODES tag is missing.";
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

    node['id'] = element.id;

var j = 0;
var tempAnimations = [];
var existAnimation = element.getElementsByTagName('ANIMATION');

for( ; j < existAnimation.length ; j++)
{
	tempAnimations[j] = existAnimation[j].id;
}

if(tempAnimations.length != 0)
	node['animation_ids'] = tempAnimations;

    node['material'] = this.reader.getString(element.children[j], 'id', true);
    node['texture'] = this.reader.getString(element.children[j+1], 'id', true);

    var transformations = []; // guardado em array, numero de transformacoes e variavel

var i = j + 2; // item seguinte as animacoes, material e textura do no

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
	console.error("XML Loading Error: " + message);	
	this.loadedOk=false;
};

MySceneGraph.prototype.findType = function(type){ 
	for (i = 0; i < this.types.length; i++)
        if (this.types[i] == type) return this.types[i];

    return null;
};

MySceneGraph.prototype.parseNurbsandShaders = function(leaf, type){ 
	tempArgs = {};
	tempArgs['type'] = type;
	if(type == "plane")
		{
			tempArgs['args'] = parseInt(this.reader.getString(leaf, 'parts', true));
		}
		else if(type == "patch"){
			    var temp = [];
                var order = this.reader.getInteger(leaf, 'order');   
                if (order < 1 || order > 3) return "Invalid order, must be 1,2 or 3";
                temp[0] = order;
         
                var leafPartsU = this.reader.getInteger(leaf, 'partsU');
                var leafPartsV = this.reader.getInteger(leaf, 'partsV');
              temp[1] = leafPartsU;
              temp[2] = leafPartsV;
                
                var updatedControlPoints = [];
                var reader_controlPoints = leaf.getElementsByTagName('controlpoint');
                for (var k = 0 ; k < reader_controlPoints.length ; k++) {
                    var tempControlPoint = [];
                    tempControlPoint[0] = this.reader.getFloat(reader_controlPoints[k], 'x');
                    tempControlPoint[1] = this.reader.getFloat(reader_controlPoints[k], 'y');
                    tempControlPoint[2] = this.reader.getFloat(reader_controlPoints[k], 'z');
                    tempControlPoint[3] = this.reader.getFloat(reader_controlPoints[k], 'w');
                    updatedControlPoints.push(tempControlPoint);
                }
                if (updatedControlPoints.length != (order + 1)*(order + 1)) {console.error(updatedControlPoints.length + " is an incorrect number of control points");}
				else {
					temp[3] = updatedControlPoints;
					tempArgs['args'] = temp;
				}
		}
		else if(type == "terrain"){
                var texture, heightmap;
                
                texture = this.texture_path + this.reader.getString(leaf, 'texture');
                heightmap = this.texture_path + this.reader.getString(leaf, 'heightmap');
                var temp = []; 
                temp[0] = texture;
                temp[1] = heightmap;
                tempArgs['args'] = temp;
		}
		return tempArgs;
};
