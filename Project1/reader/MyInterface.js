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
	application.interface = this;
	this.gui = new dat.GUI();

	return true;
};

MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
    scene.interface = this;
};


MyInterface.prototype.create_gui_checkboxes = function() {
    var lights_group = this.gui.addFolder("Lights");
    lights_group.open();

    var realScene = this;

    for (enable_element in this.scene.lights_ids) {
        lights_group.add(this.scene.lights_ids, enable_element).onChange(function(value) {
            realScene.scene.changeLightProperty(this.property, value);
        });
    }
};
