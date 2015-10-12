function addTexture(scene, id, path, amplif_factor) {
    CGFtexture.call(this, scene, path);
    this.id = id;
    this.amplif_factor = amplif_factor;
}
addTexture.prototype = Object.create(CGFtexture.prototype);
addTexture.prototype.constructor = addTexture;
