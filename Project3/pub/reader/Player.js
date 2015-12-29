/**
 * Player
 * @constructor
 */
function Player(scene, id, level, name){
	this.scene = scene;
	this.name = name;
	this.level = level;
	this.playerId = id;
	this.pieces = [];
};

Player.prototype = Object.create(CGFobject.prototype);

Player.prototype.constructor=Player;

Player.prototype.addPiece = function (piece) {
	this.pieces.push(piece);
};

Player.prototype.setPieces = function (pieces) {
	this.pieces = pieces.slice();

	var line = 0;
	var column = 0;

	// calculate initial position for each piece
	for(var i = 0 ; i < this.pieces.length ; i++){
		if(i % 9 == 0){
			line+=2;
			column = 0;
		}

		var matrx = mat4.create();
		mat4.identity(matrx);

		if(this.playerId=='player1'){
			//if(i>15)
			//	mat4.translate(matrx, matrx, vec3.fromValues(26 + line, 0.25, 3 + 2/3 - column));
			//else 
			mat4.translate(matrx, matrx, vec3.fromValues(26 + line, 0.25, 25 - column));
			mat4.rotateY(matrx, matrx, Math.PI/2);
		}else if(this.playerId=='player2'){
			mat4.translate(matrx, matrx, vec3.fromValues(-line, 0.25, 25 - column));
			mat4.rotateY(matrx, matrx, -Math.PI/2);
		}
		this.scene.pieces[this.pieces[i]].initialPosition = matrx;
		column+=3;
	}
};

Player.prototype.getPieces = function () {
	return this.pieces;
};

Player.prototype.play = function () {
	if(this.human)
		return false;

	return true;
};

Player.prototype.showPlayerPieces = function (){
	if (this.scene.turn != undefined) {
		var playerTurn = 'player' + this.scene.turn;
		if(playerTurn == this.playerId && this.level == 0) {
			for(var i=0; i<this.pieces.length; i++){
				if (!this.scene.pieces[this.pieces[i]].played) {
					this.scene.pushMatrix();
					this.scene.pieces[this.pieces[i]].setSelectable();
					this.scene.pieces[this.pieces[i]].display();
					this.scene.popMatrix();		
				}
			}
		}
	}
};
