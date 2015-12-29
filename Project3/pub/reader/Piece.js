
function Piece(scene, halfL, halfR) {
    CGFobject.call(this,scene);

    this.halfL = halfL;
    this.halfR = halfR;
    this.id = -1;

    this.animation = null;
    this.initialPosition = mat4.create();
    this.played = false;
		mat4.identity(this.initialPosition);
    //this.currentMatrix = initialPosition;

    this.rectangle = new rectangle(this.scene, [0, 1, 1 ,0]);
};

Piece.prototype.setId = function(newId) {
    this.id=newId;
};

Piece.prototype.getId = function() {
    return this.id;
};

Piece.prototype.selected = function() {
    
};

Piece.prototype.unselected = function() {
    
    // criar e iniciar animacao de volta
};

Piece.prototype.setSelectable = function() {
    this.scene.registerForPick(this.id, this);
};

Piece.prototype.getValues = function() {
    return [this.halfL, this.halfR];
};

Piece.prototype.display = function() {
  this.scene.pushMatrix();

  if(this.animation!=undefined)
    this.scene.multMatrix(this.animation.getCurrentTransformation());

  this.scene.multMatrix(this.initialPosition);

    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.makeHalfPiece(this.halfL);
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0, 0);
        this.makeHalfPiece(this.halfR);
    this.scene.popMatrix();
    
  this.scene.popMatrix();
};

Piece.prototype.makeHalfPiece = function (value){
    this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5, 0);
        this.centerSide();
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.centerSide();
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.centerSide();
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0, 0.25, 0, 0);
        this.centerTop(value);
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0, -0.25, 0, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.centerBottom();
    this.scene.popMatrix();
};

Piece.prototype.centerSide = function(){
    this.material = this.scene.materials[this.scene.gameLook];
    this.material.setTexture(this.scene.textures[this.scene.gameLook][8]);
    this.material.apply();
    this.scene.translate(-0.5, -0.25, 0, 0);
    this.scene.scale(1, 0.5, 1);
    this.rectangle.display();
};

Piece.prototype.centerTop = function(value){
    if(value != null){
        this.material = this.scene.materials[this.scene.gameLook];
        this.material.setTexture(this.scene.textures[this.scene.gameLook][value]);
        this.material.apply();
    } else {
        this.material = this.scene.materials[this.scene.gameLook];
        this.material.setTexture(this.scene.textures[this.scene.gameLook][8]);
        this.material.apply();
    }
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(-0.5, -0.5, 0, 0);
    this.rectangle.display();
    this.material.setTexture(this.scene.textures[this.scene.gameLook][8]);
    this.material.apply();
};

Piece.prototype.centerBottom = function(value){
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(-0.5, -0.5, 0, 0);
    this.rectangle.display();
};

Piece.prototype.setInitialPosition = function(side, x, z){
    this.side = side;
    var matrx = mat4.create();
    mat4.identity(matrx);
    if(this.side == 'player2')
        mat4.rotateY(matrx, matrx, Math.PI);
    var vectr = vec3.fromValues(x, z, 0.25);
    mat4.translate(matrx, matrx, vectr);
    this.initialPosition = matrx;
};

Piece.prototype.update = function(curTime){
  if(this.animation!=undefined)
    this.animation.update();
};

Piece.prototype.animationOnMovement = function(time, center, radius, angStart, angRot){
  //
}
