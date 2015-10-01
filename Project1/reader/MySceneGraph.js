
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
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseInitials(rootElement);

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
	
	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
 /*
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};
*/

MySceneGraph.prototype.parseInitials=function(rootElement){
	// searching for tag initials
	
	console.log("INITIALS");
	
	var e = rootElement.getElementsByTagName('INITIALS');
	if(e == null) return "Tag initials is missing.";
	if(e.lenght != 1) return "There is more than one INITIALS tag.";
	var ini = e[0];
	
	// searching for tag frustum
	
	var e = ini.getElementsByTagName('frustum');
	if(e == null) return "frustum is missing.";
	if(e.lenght != 1) return "There is more than one frustum element.";
	var frustum = e[0];
	
	this.frustum=[];
	this.frustum['near']=this.reader.getFloat(frustum,'near',true);
	this.frustum['far']=this.reader.getFloat(frustum,'far',true);
	
	console.log("Frustum: near-this.frustum['near'], far-this.frustum['far']");
	
	// Geometric transformations
	// searching for tag translate
	
	var e = ini.getElementsByTagName('translate');
	if(e == null) return "translate is missing.";
	if(e.lenght != 1) return "There is more than one translate element.";
	var translation = e[0];
	
	this.translation=[];
	this.translation['x'] = this.reader.getFloat(translation,'x',true);
	this.translation['y'] = this.reader.getFloat(translation,'y',true);
	this.translation['z'] = this.reader.getFloat(translation,'z',true);
	
	console.log("Translation: x-this.translate['x'], y-this.translate['y'], z-this.translate['z']");
	
	// searching for tag rotation
	
	var e = ini.getElementsByTagName('rotation');
	if (e == null)  return "rotation is missing.";
	if (e.length != 3) return "There is more than three rotation elements.";

	this.rotation=[[],[],[]];
	for (var i=0; i<3; i++)
	{
		var rotation = e[i]; // falta analisar se os valores das variaveis sao de facto x, y, z!!!

		this.rotation[i]['axis']=this.reader.getString(rotation,'axis',true);
		
		this.rotation[i]['angle']=this.reader.getFloat(rotation,'angle',true);
		
		console.log("Rotation["+i+"] - axis" + this.rotation[i]['axis'] + ", angle" + this.rotation[i]['angle']);
	}
	
	// searching for tag scale
	
	var e = ini.getElementsByTagName('scale');
	if (e == null)  return "scale is missing.";
	if (e.length != 1) return "There is more than one scale element.";

	var scale = e[0];
	
	this.scale=[];
	this.scale['x'] = this.reader.getFloat(scale,'x',true);
	this.scale['y'] = this.reader.getFloat(scale,'y',true);
	this.scale['z'] = this.reader.getFloat(scale,'z',true);
	
	console.log("SCALE x-" + this.scale['x'] + "y-" + this.scale['y'] + "z-" + this.scale(['z']);

	// searching for tag reference
	
	var e = ini.getElementsByTagName('reference');
	if (e == null)  return "reference is missing.";
	if (e.length != 1) return "There is more than one reference element.";
	
	var refer = e[0];
	this.refer = this.reader.getFloat(reference,'length',true);
	
	console.log("Reference " + this.refer);
}
	
	MySceneGraph.prototype.parseIllumination = function(rootElement) {
	var ilu = rootElement.getElementsByTagName('ILLUMINATION');
	if(ilu == null) return "Illumination is missing.";

	if(ilu.length != 1) return "More than one illumination found.";

	var elements_Illu = ilu[0];

	
	// coefficient environment
	
	var environments = elements_Illu.getElementsByTagName("ambient");
	if(environments == null) return "Ambient is missing.";
	if(environments.length != 1) return "More than one ambient element.";

	var environment = environments[0];
	this. = [];
	this.environments["r"] = this.reader.getFloat(environment, "r", true);
	this.environments["g"] = this.reader.getFloat(environment, "g", true);
	this.environments["b"] = this.reader.getFloat(environment, "b", true);
	this.environments["a"] = this.reader.getFloat(environment, "a", true);

	console.log("Ambient: R="+this.environment["r"]+", G="+this.environment["g"]+", B="+this.environment["b"]+", A="+this.environment["a"]);

	// doubleside
	
	var doublesides = elements_Illu.getElementsByTagName("doubleside");
	if(doublesides == null) return "doubleside is missing.";
	if(doublesides.length != 1) return "More than one doubleside elements.";

	var doubleside = doublesides[0];
	this.doubleside = [];
	this.doubleside["value"] = this.reader.getBoolean(doubleside, "value", true);

	console.log("doubleside: " + this.doubleside["value"]);

	//background
	
	var backgrounds = elements_Illu.getElementsByTagName("background");
	if(backgrounds == null) return "backgrounds is missing.";
	if(backgrounds.length != 1) return "More than one backgrounds elements.";

	var background = backgrounds[0];
	this.background = [];
	this.background["r"] = this.reader.getFloat(background, "r", true);
	this.background["g"] = this.reader.getFloat(background, "g", true);
	this.background["b"] = this.reader.getFloat(background, "b", true);
	this.background["a"] = this.reader.getFloat(background, "a", true);

	console.log("BACKGROUND: R= "+this.background["r"]+", G="+this.background["g"]+", B="+this.background["b"]+", A="+this.background["a"]);
	
}

/*
Missing: lights and textures
*/
	
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


