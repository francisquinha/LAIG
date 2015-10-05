function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
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

	var error = this.parseIlumination(rootElement);

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

	/*var error = this.parseMaterials(rootElement);
	
		if (error != null) {
		this.onXMLError(error);
		return;
	}	
*/
	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
	
};



/*
 * Method that parses elements of Initials block and stores information in a specific data structure
 */
 
MySceneGraph.prototype.parseInitials= function(rootElement) {
	
	console.log("INITIALS: \n");

	this.initialsInformation={};
	
	var elems =  rootElement.getElementsByTagName('INITIALS');
	if(elems == null) return "initials tag is missing.";
	if(elems.length != 1) return "More than one initials tag found.";
	var initials = elems[0];

	
	//Frustum
	
	elems = initials.getElementsByTagName('frustum');
	if(elems == null) return "frustum tag is missing.";
	if(elems.length != 1) return "More than one frustum tag found.";

	var frustum = elems[0];

	this.initialsInformation.frustum={};
	
	this.initialsInformation.frustum['near'] = this.reader.getFloat(frustum,'near',true);
	this.initialsInformation.frustum['far'] = this.reader.getFloat(frustum,'far',true);
	
	if(isNaN(this.initialsInformation.frustum['near'])) return "frustum near invalid. It must be a float.";
	if(isNaN(this.initialsInformation.frustum['far'])) return "frustum far invalid. It must be a float";
	
	
	//Translation
	
	elems = initials.getElementsByTagName('translation');
	if (elems == null)  return "translation tag is missing!";
	if (elems.length != 1) return "More than one translation tag found.";

	var translate = elems[0];

	this.initialsInformation.translate={};
	this.initialsInformation.translate['x']=this.reader.getFloat(translate,'x',true);
	this.initialsInformation.translate['y']=this.reader.getFloat(translate,'y',true);
	this.initialsInformation.translate['z']=this.reader.getFloat(translate,'z',true);
	
	if(isNaN(this.initialsInformation.translate['x'])) return "value of translation in x axis invalid. It mus be a float.";
	if(isNaN(this.initialsInformation.translate['y'])) return "value of translation in y axis invalid. It mus be a float.";
	if(isNaN(this.initialsInformation.translate['z'])) return "value of translation in z axis invalid. It mus be a float.";

	
	//Rotation
	
	elems = initials.getElementsByTagName('rotation');
	if (elems == null)  return "rotation tag is missing.";
	if (elems.length != 3) return "Invalid number of rotations It must be 3.";

	this.initialsInformation.rotation={};
	for (var i=0; i<3; i++)
	{
		
		this.initialsInformation.rotation[this.reader.getString(elems[i],'axis',true)] = this.reader.getFloat(elems[i],'angle',true);
	}
	
	if(isNaN(this.initialsInformation.rotation[this.reader.getString(elems[0],'axis',true)])) return "value of angle rotation in x axis invalid. It must be a float.";
	if(isNaN(this.initialsInformation.rotation[this.reader.getString(elems[1],'axis',true)])) return "value of angle rotation in y axis invalid. It must be a float.";
	if(isNaN(this.initialsInformation.rotation[this.reader.getString(elems[2],'axis',true)])) return "value of angle rotation in z axis invalid. It must be a float.";

	
	if(this.reader.getString(elems[0],'axis',true) != "x") return "value of the first axis invalid. It must be x."
	if(this.reader.getString(elems[1],'axis',true) != "y")	return "value of the first axis invalid. It must be y."
	if(this.reader.getString(elems[2],'axis',true) != "z")	return "value of the first axis invalid. It must be z.!"

	
	//Scale
	
	elems = initials.getElementsByTagName('scale');
	if (elems == null)  return "Scale tag is missing!";
	if (elems.length != 1) return "More than one scale tag found.";

	var scale = elems[0];

	this.initialsInformation.scale={};
	this.initialsInformation.scale['sx']=this.reader.getFloat(scale,'sx',true);
	this.initialsInformation.scale['sy']=this.reader.getFloat(scale,'sy',true);
	this.initialsInformation.scale['sz']=this.reader.getFloat(scale,'sz',true);
	
	if(isNaN(this.initialsInformation.scale['sx'])) return "value of scale in x axis invalid. It must be a float.";
	if(isNaN(this.initialsInformation.scale['sy'])) return "value of scale in y axis invalid. It must be a float.";
	if(isNaN(this.initialsInformation.scale['sz'])) return "value of scale in z axis invalid. It must be a float.";

	

	//Reference

	elems = initials.getElementsByTagName('reference');
	if (elems == null)  return "reference tag is missing!";
	if (elems.length != 1) return "More than one reference tag found.";

	var reference = elems[0];

	this.initialsInformation.reference=this.reader.getFloat(reference,'length',true);

	if(isNaN(this.initialsInformation.reference)) return "value of reference invalid. It must be a float.";
	
	console.log(this.initialsInformation);
};

/*
 * Method that parses elements of Ilumination block and stores information in a specific data structure
 */
	
MySceneGraph.prototype.parseIlumination = function(rootElement) {
	
	var iluminations = rootElement.getElementsByTagName('ILLUMINATION');
	if(iluminations == null) return "Illumination tag is missing!";
	if(iluminations.length != 1) return "More than one illumination tag found.";


	//gets each ilumination element*/
	var iluminationElems = iluminations[0];

	//ambient
	var ambients = iluminationElems.getElementsByTagName("ambient");
	if(ambients == null) return "ambient values missing";
	if(ambients.length != 1) return "0 or more ambient elements were found!";

	var ambient = ambients[0];
	this.ambient = [];
	this.ambient["r"] = this.reader.getFloat(ambient, "r", true);
	this.ambient["g"] = this.reader.getFloat(ambient, "g", true);
	this.ambient["b"] = this.reader.getFloat(ambient, "b", true);
	this.ambient["a"] = this.reader.getFloat(ambient, "a", true);

	console.log("AMBIENT: TEST R(20.0) = "+this.ambient["r"]+" | G(56.0) = "+this.ambient["g"]+" | B(80.0) = "+this.ambient["b"]+" | A(0.25) = "+this.ambient["a"]);

	//doubleside
	var doublesides = iluminationElems.getElementsByTagName("doubleside");
	if(doublesides == null) return "doubleside values missing";
	if(doublesides.length != 1) return "0 or more doubleside	 elements were found!";

	var doubleside = doublesides[0];
	this.doubleside = [];
	this.doubleside["value"] = this.reader.getBoolean(doubleside, "value", true);

	console.log("DOUBLESIDE: TEST VALUE(0) "+this.doubleside["value"]);

	//background
	var backgrounds = iluminationElems.getElementsByTagName("background");
	if(backgrounds == null) return "backgrounds values missing";
	if(backgrounds.length != 1) return "0 or more backgrounds were found!";

	var background = backgrounds[0];
	this.background = [];
	this.background["r"] = this.reader.getFloat(background, "r", true);
	this.background["g"] = this.reader.getFloat(background, "g", true);
	this.background["b"] = this.reader.getFloat(background, "b", true);
	this.background["a"] = this.reader.getFloat(background, "a", true);

	console.log("BACKGROUND: TEST R(20.0) = "+this.background["r"]+" | G(19.0) = "+this.background["g"]+" | B(21.0) = "+this.background["b"]+" | A(1) = "+this.background["a"]);
	
}



/*
 * Method that parses elements of Lights block and stores information in a specific data structure
 */
 
MySceneGraph.prototype.parseLights = function(rootElement) {
	var lights = rootElement.getElementsByTagName("LIGHTS");
	if(lights == null) return "light values missing";
	if(lights.length != 1) return "0 or more lights were found";

	var first_lights = lights[0];

	var ids = [];

	//LIGHT
	var light = first_lights.getElementsByTagName("LIGHT");
	if(light == null) return "light values missing";
	if(light.length < 1) return "0 light elements were found";

	this.lights=[];
	for(var i=0; i<light.length; i++) {
		var currLight = [];
		var iterLight = light[i];

		//stores ids
		currLight["id"] = this.reader.getString(iterLight,"id",true);

		//enable/disable
		var enables = iterLight.getElementsByTagName("enable");
		var enable = enables[0];
		currLight["enable"] = this.reader.getBoolean(enable, "value", true);


		//light position
		var positions = iterLight.getElementsByTagName("position");
		var position = positions[0];
		currLight["position"] = [];
		currLight["position"]["x"] = this.reader.getFloat(position, "x", true);
		currLight["position"]["y"] = this.reader.getFloat(position, "y", true);
		currLight["position"]["z"] = this.reader.getFloat(position, "z", true);
		currLight["position"]["w"] = this.reader.getFloat(position, "w", true);

		//ambient component
		var ambients = iterLight.getElementsByTagName("ambient");
		var ambient = ambients[0];
		currLight["ambient"] = [];
		currLight["ambient"]["r"] = this.reader.getFloat(ambient, "r", true);
		currLight["ambient"]["g"] = this.reader.getFloat(ambient, "g", true);
		currLight["ambient"]["b"] = this.reader.getFloat(ambient, "b", true);
		currLight["ambient"]["a"] = this.reader.getFloat(ambient, "a", true);

		//diffuse component
		var diffuses = iterLight.getElementsByTagName("diffuse");
		var diffuse = diffuses[0];
		currLight["diffuse"] = [];
		currLight["diffuse"]["r"] = this.reader.getFloat(diffuse, "r", true);
		currLight["diffuse"]["g"] = this.reader.getFloat(diffuse, "g", true);
		currLight["diffuse"]["b"] = this.reader.getFloat(diffuse, "b", true);
		currLight["diffuse"]["a"] = this.reader.getFloat(diffuse, "a", true);

		//specular component
		var speculars = iterLight.getElementsByTagName("specular");
		var specular = speculars[0];
		currLight["specular"] = [];
		currLight["specular"]["r"] = this.reader.getFloat(specular, "r", true);
		currLight["specular"]["g"] = this.reader.getFloat(specular, "g", true);
		currLight["specular"]["b"] = this.reader.getFloat(specular, "b", true);
		currLight["specular"]["a"] = this.reader.getFloat(specular, "a", true);

		this.lights[i]=currLight;
	}

	for(var i=0; i<this.lights.length; i++) {
		console.log("LIGHT["+i+"]: "+this.lights[i]["id"]);
		console.log("->ENABLE/DISABLE : TEST = "+this.lights[i]["enable"]);
		console.log("->POSITION : TEST(X, Y, Z, W) = ("+this.lights[i]["position"]["x"]+", "+this.lights[i]["position"]["y"]+", "+this.lights[i]["position"]["z"]+", "+this.lights[i]["position"]["w"]+")");
		console.log("->LIGHT AMBIENT COMPONENT : TEST(R, G, B, A) = ("+this.lights[i]["ambient"]["r"]+", "+this.lights[i]["ambient"]["g"]+", "+this.lights[i]["ambient"]["b"]+", "+this.lights[i]["ambient"]["a"]+")");
		console.log("->LIGHT DIFFUSE COMPONENT : TEST(R, G, B, A) = ("+this.lights[i]["diffuse"]["r"]+", "+this.lights[i]["diffuse"]["g"]+", "+this.lights[i]["diffuse"]["b"]+", "+this.lights[i]["diffuse"]["a"]+")");
		console.log("->LIGHT SPECULAR COMPONENT : TEST(R, G, B, A) = ("+this.lights[i]["specular"]["r"]+", "+this.lights[i]["specular"]["g"]+", "+this.lights[i]["specular"]["b"]+", "+this.lights[i]["specular"]["a"]+")");	
	}
};
	


/*
 * Method that parses elements of Lights block and stores information in a specific data structure
 */
 
MySceneGraph.prototype.parseTextures = function(rootElement) {
	var textures = rootElement.getElementsByTagName("TEXTURES");
	if(textures == null) return "Textures element missing!";
	if(textures.length != 1) return "More than one 'TEXTURES' element found. Expected only one!";

	var first_textures = textures[0];

	var ids = [];

	//Texture
	
	var texture = first_textures.getElementsByTagName("TEXTURE");
	if(texture == null) return "light values missing";
	if(texture.length < 1) return "0 light elements were found";

	this.textures=[];
	for(var i=0; i<texture.length; i++) {
		var currText = [];
		var iterText = texture[i];

		//stores ids
		currText["id"] = this.reader.getString(iterText,"id",true);

		//path
		var path = iterText.getElementsByTagName("file");
		var file = path[0];
		currText["file"] = this.reader.getString(file,"path",true);

		//amplif_factor

		var amplif_factor = iterText.getElementsByTagName("amplif_factor");
		var factor = amplif_factor[0];
		
		this.factor=[];
		this.factor['s']=this.reader.getFloat(factor,'s',true);
		this.factor['t']=this.reader.getFloat(factor,'t',true);
	
		this.textures[i]=currText;
	}

	for(var i=0; i<this.textures.length; i++) {
		console.log("TEXTURES["+i+"]: "+this.textures[i]["id"]);
		console.log("->FILE PATH = "+this.textures[i]["file"]);
		console.log("->AMPLIF. FACTOR = s = "+this.factor['s']);
		
	}
};
	
	
/*
 * Callback to be executed on any read error
 */ 
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


