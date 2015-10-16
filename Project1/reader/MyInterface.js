/**
 * MyInterface
 * @constructor
 */

function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);

};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 
/*
	// pause/resume watch
	this.gui.add(this.scene, 'pauseWatch').name('Pause clock');	
	

	// change window mode
	var nameGui = this.gui.add(this.scene, 'openWindow').name('Close window').onChange(
		function(){
			if(this.object.changeWindow)
			nameGui.name('Close window');
			else nameGui.name('Open window');

	});
*/
	// lights on/off
	// add a group of controls (and open/expand by defult)
	//var gui_lights = this.gui.addFolder("Lights");
	//gui_lights.open();
    
	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;
	
    //gui_lights.add(this.scene, 'centerLight').name('Center light');

var folder = this.gui.addFolder("Lights");
folder.open();
/*
--------
 Angela: comentei isto porque estava a dar erro 
--------
folder.add(this.scene, 'rightBoardLight').name("First").onChange(function(value){
		this.object.createBoxes(value);
	});
*/

//	lights.add(this.scene, 'rightBoardLight').name('Right board light');
//	lights.add(this.scene, 'leftBoardLight').name('Left board light');
//	lights.add(this.scene, 'windowLight').name('Window light');
	
	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters
/*	
	this.gui.add(this.scene, 'speedRobot', 0, 3).name('Robot speed').onChange(function(value){
		this.object.changeSpeedRobot(value)
	});

	// Colors	
	this.gui.addColor(this.scene, 'changeColor').name('Robot body color').listen().onChange(function(value){
	changeColor = value;
	this.object.changeColorRobot(value);
	});

	// change robot appearance
	this.gui.add(this.scene, 'currRobotAppearance', { Robot1: 0, Robot2: 1, Robot3: 2, Robot4: 3}).name('Robot').onChange(
		function(value){
			currRobotAppearance = value;
			this.object.changeTextures(value);
	});
*/	
	return true;
};


/**
 * processKeyboard
 * @param event {Event}
 */

/*
 
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);
	
	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.which || event.keyCode)
	{
		case (97):// only works for 'a', as it is
	      {this.scene.rotateLeft(); break;}
		case (100):	//  d
		  {this.scene.rotateRight(); break;}
		case (115):	//  s
		  {this.scene.translateBack(); break;}
		case (119):	//  w
		  {this.scene.translateForward(); break;}
		case (111):	//  o
		  {this.scene.helloArm(); break;}
	};
};

*/