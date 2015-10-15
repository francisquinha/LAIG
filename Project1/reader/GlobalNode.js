/**
 * node
 * @constructor
 */
function GlobalNode(identifier) {
 	CGFscene.call(this,scene);
	
 };

GlobalNode.prototype = Object.create(CGFobject.prototype);
GlobalNode.prototype.constructor = GlobalNode;
