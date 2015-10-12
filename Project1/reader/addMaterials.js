function addMaterial(scene, id) {
    CGFappearance.call(this, scene);
    this.id = id;
}
addMaterial.prototype = Object.create(CGFappearance.prototype);
addMaterial.prototype.constructor = addMaterial;