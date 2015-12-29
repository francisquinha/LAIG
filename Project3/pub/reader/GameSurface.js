/**
 * GameSurface
 * @constructor
 */
function GameSurface(scene, sizeX, sizeY) {
	CGFobject.call(this, scene);

	this.sizeX = sizeX;
	this.sizeY = sizeY;

	this.surface = new plane(scene, sizeX);

	this.placedPieces = [];

	this.table = [];
	for(var n = 0 ; n < this.sizeY ; n++){
		this.table[n] = [];
		for(var m = 0 ; m < this.sizeX ; m++)
			this.table[n][m] = [8];
	}

	this.positions = [];
	this.heights = [];
	this.positionID = [];
	var hitBoxId = 200;
	for(var n = 0 ; n < this.sizeY ; n++)
		for(var m = 0 ; m < this.sizeX ; m++){
			this.positions[[m, n]] = new Patch(scene, 1, 1, 1, [[-0.5, 0, 0.5], [-0.5, 0, -0.5], [0.5, 0, 0.5], [0.5, 0,-0.5]]);
			this.heights[[m, n]] = 0;
			this.positionID[hitBoxId++] = [m,n];
		}
};

GameSurface.prototype = Object.create(CGFobject.prototype);
GameSurface.prototype.constructor=GameSurface;

GameSurface.prototype.movePatch = function (row, column, height) {
			this.heights[[row, column]] = height;
}


GameSurface.prototype.placePiece = function (position, piece) {
	this.placedPieces.push({ height: (this.table[position.aY][position.aX].length -1), coords: position, domino: piece });

	this.table[position.aY][position.aX].push(piece.valueL);
	this.table[position.bY][position.bX].push(piece.valueR);
};

GameSurface.prototype.unplacePiece = function (position, piece) {
	for(var i = 0 ; i < this.placedPieces.length ; i++)
		if(this.placedPieces[i].coords == position && this.placedPieces[i].domino == piece)
			this.placedPieces.splice(i,1);

	this.table[position.aY][position.aX].pop();
	this.table[position.bY][position.bX].pop();
};

GameSurface.prototype.getPosition = function (id) {
	return this.positionID[id];
}

GameSurface.prototype.getTable = function () {
		var plainTable = [];

		for(var n = 0 ; n < this.sizeY ; n++)
			for(var m = 0; m < this.sizeX ; m++){
				var content = [];
				plainTable[n][m] = content.push(this.table[n][m].pop());
				this.table[n][m].push(plainTable[n][m]);

				content.push(this.table[n][m].length - 1);
			}

		return plainTable;
};

GameSurface.prototype.display = function () {

	
	this.scene.pushMatrix();

		if(!this.scene.pickMode){
			this.scene.pushMatrix();
				this.scene.materials[this.scene.gameLook].setTexture(this.scene.textures[this.scene.gameLook]['gameSurface']);
				this.scene.materials[this.scene.gameLook].apply();
				this.scene.scale(this.sizeX, 1, this.sizeY);
				this.scene.translate(0.5, 0, 0.5, 1);
				this.surface.display();
		 	this.scene.popMatrix();
		}

		if(this.scene.pickMode ){
			
		 	var hitBoxId = 200;

			for(var n = 0 ; n < this.sizeY ; n++)
				for(var m = 0 ; m < this.sizeX ; m++){
					this.scene.pushMatrix();
						this.scene.registerForPick(hitBoxId++, this.positions[[m, n]]);	
						this.scene.translate(m, (this.table[n][m].length - 1) + 0.1, n, 1);
						this.scene.translate(0.5, this.heights[[m,n]], 0.5, 1); 
						this.positions[[m, n]].display();
					this.scene.popMatrix();
				}
		}

	// show pieces
	if(!this.scene.pickMode)
		for(var i = 0 ; i < this.placedPieces.length ; i++)
			drawPiece(this.placedPieces[i]);

	this.scene.popMatrix();
};

function drawPiece(piece){

	this.scene.pushMatrix();
		var rotAngle = 0;

		// if horizontal
		if(piece.coords.aY == piece.coords.bY){
			if(piece.coords.aX > piece.coords.bX)
				rotAngle=Math.PI;
		}else{	// if vertical
			if(piece.coords.aY < piece.coords.bY)
				rotAngle = Math.PI/2;
			else rotAngle = Math.PI/2;
		}

		this.scene.translate(piece.coords.aX, piece.height, piece.coords.aY, 1);
		this.scene.translate(0.5, 0, 0.5, 1);
		this.scene.rotate(rotAngle, 0, 1, 0);
		this.scene.pieces[piece.domino].display();
 	this.scene.popMatrix();

};
