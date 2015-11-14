/**
 * terrain
 * @constructor
 */

function terrain(scene, args) {
    CGFObject.call(this,scene);
    

    this.terrainShader = new CGFshader(scene.gl, "shaders/texture1.vert", "shaders/texture1.frag");
 }
 
 terrain.prototype = Object.create(CGFobject.prototype);
 terrain.prototype.constructor = terrain;
 

terrain.prototype.display = function() {
    
};