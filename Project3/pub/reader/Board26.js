/**
 * Board26
 * @constructor
 */
 function Board26(scene, size) {
 	CGFobject.call(this,scene);
	this.objects = [];
	this.size=size;
	
 	this.initBuffers();
 };

 Board26.prototype = Object.create(CGFobject.prototype);
 Board26.prototype.constructor = Board26;

 Board26.prototype.initBuffers = function() {

	for(var i = 0; i < this.size ; i++){
	for(var j = 0 ; j < this.size ; j++){
		var temp = new CGFplane(this.scene);
		this.objects.push(temp);
	}

}
 };
Board26.prototype.display = function() {

for (i = 0; i<this.objects.length; i++) {
		this.scene.registerForPick(i+1, this.objects[i]);
		if(i % this.size == 0 && i > 0)
			this.scene.translate(-13, 0, 0.5);	
		this.scene.pushMatrix();
		
		
		this.scene.translate(i*0.5, 0, 0);
		this.scene.scale(0.5,1,0.5);
		this.objects[i].display();
		this.scene.popMatrix();
	}

};