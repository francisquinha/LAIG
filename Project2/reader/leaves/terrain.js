/**
 * terrain
 * @constructor
 */

function terrain(scene, args) {
    CGFobject.call(this,scene);
    this.args = args || ["null", "null"];

    this.materialTerrain = new CGFappearance(scene);
    this.materialTerrain.setAmbient(0.5,0.5,0.5,1);
    this.materialTerrain.setDiffuse(0.5,0.5,0.5,1);
    this.materialTerrain.setSpecular(0.5,0.5,0.5,1);
    this.materialTerrain.setShininess(1);
    this.textureTerrain = new CGFtexture(scene, this.args[0]);
    this.heightmapTerrain = new CGFtexture(scene, this.args[1]);
    this.materialTerrain.setTexture(this.textureTerrain);
    //this.materialTerrain.setTextureWrap('REPEAT', 'REPEAT'); // parece-me desnecessario

    this.myShader = new CGFshader(scene.gl, "scenes/monster/shaders/myShader.vert", "scenes/monster/shaders/myShader.frag");
    this.myShader.setUniformsValues({uSampler2: 1});
    this.myShader.setUniformsValues({scale: 0.2});
    
    this.plane = new Plane(scene, 200);
 }
 
terrain.prototype = Object.create(CGFobject.prototype);
terrain.prototype.constructor = terrain;
 
terrain.prototype.display = function() {
    this.materialTerrain.apply();
    this.scene.setActiveShader(this.myShader);

    this.scene.pushMatrix();
    
    this.heightmapTerrain.bind(1);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);

    this.scene.popMatrix();
};