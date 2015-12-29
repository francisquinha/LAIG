/*
 * DominupScene
 * @constructor
 */

function DominupScene() {
    CGFscene.call(this);
}

DominupScene.prototype = Object.create(CGFscene.prototype);
DominupScene.prototype.constructor = DominupScene;

DominupScene.prototype.setMyInterface = function(myInterface) {
	this.myInterface = myInterface;
	this.myInterface.createMainMenu();
}

DominupScene.prototype.init = function (application) {
  	CGFscene.prototype.init.call(this, application);

  	this.initCameras();
  	this.initLights();

  	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  	this.gl.clearDepth(100.0);
  	this.gl.enable(this.gl.DEPTH_TEST);
  	this.gl.enable(this.gl.CULL_FACE);
  	this.gl.depthFunc(this.gl.LEQUAL);
  	this.enableTextures(true);

  	this.matrix = mat4.create();
  	mat4.identity(this.matrix);

	this.setUpdatePeriod(20);
	this.setPickEnabled(true);

	this.initGame();
};

DominupScene.prototype.initLights = function () {
	this.lights[0].setPosition(5, 5, 5, 1);
  	this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
  	this.lights[0].update();
};

DominupScene.prototype.loadGame = function(){
	this.state = 'LOAD';
};

DominupScene.prototype.saveGame = function (){
	this.message.showString('You have successfully saved the game');
	console.log('save game');
};

DominupScene.prototype.newGame = function(){
	this.initGamePieces();
	this.initGameSurface();
//	this.initGamePlayers();
  	this.state = 'PLAY';
};

DominupScene.prototype.endGame = function(winner){
  this.message.showString('Congratulations ' + winner);
  console.log(winner); 
  this.myInterface.hideGameMenu();
};

DominupScene.prototype.quitReview = function(){
  this.myInterface.hideReviewMenu();
  if(!this.isGameOver()){
    this.state = 'PLAY';
    this.myInterface.createGameMenu();
  }
};

DominupScene.prototype.postGameRequest = function(requestString, onSuccess, onError) {
	var request = new XMLHttpRequest();
	request.open('POST', '../../game', true);
	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send('requestString='+encodeURIComponent(requestString));			
}

DominupScene.prototype.handleSetupStartReply = function(data){
	console.log(data.target.response);
	var response = JSON.parse(data.target.response);
	var message = response.message;
	var player_order = message.split(" / ");
	var id1 = player_order[0].split(" - ")[1];
	var id2 = player_order[1].split(" - ")[1];
	var distribution = response.distribution.split("[")[1].split("]")[0].split(",");
	var pieces1 = [];
	var pieces2 = [];
	var check;
	if (id1 == myScene.players['player1'].playerId) check = "1";
	else check = "2";
	var i = 0;
	for (id in myScene.pieces) {
		if (distribution[i] == check)
			pieces1.push(id);
		else pieces2.push(id);
		i++;
	}
	myScene.players['player1'].setPieces(pieces1);
	myScene.players['player2'].setPieces(pieces2);
	myScene.turn = parseInt(response.player);
	myScene.gameOver = parseInt(response.gameover);
	myScene.processBoard(response.board);
}

DominupScene.prototype.handleLoadReply = function(data){
	console.log(data.target.response);
	var response = JSON.parse(data.target.response);
	var message = response.message;
	var player_order = message.split(" / ");
	var name1 = player_order[0].split(" - ")[1];
	var name2 = player_order[1].split(" - ")[1];
	var level1 = parseInt(player_order[0].split(" - ")[2]) - 1;
	var level2 = parseInt(player_order[1].split(" - ")[2]) - 1;
	var distribution = response.distribution.split("[")[1].split("]")[0].split(",");
	var pieces1 = [];
	var pieces2 = [];
	myScene.players['player1'].name = name1;
	myScene.players['player2'].name = name2;
	myScene.players['player1'].level = level1;
	myScene.players['player2'].level = level2;
	var i = 0;
	for (id in myScene.pieces) {
		if (distribution[i] == "1")
			pieces1.push(id);
		else pieces2.push(id);
		i++;
	}
	myScene.players['player1'].setPieces(pieces1);
	myScene.players['player2'].setPieces(pieces2);
	myScene.turn = parseInt(response.player);
	myScene.gameOver = parseInt(response.gameover);
	myScene.processBoard(response.board);
}

DominupScene.prototype.processBoard = function(response_board) {
	if (response_board == "[]") return; 
	var board_string = response_board.split("[[")[1].split("]]")[0].split("],[");
	var board = [];
	var half_move1;
	var half_move2;
	var move;
	var i;
	var j;
	for (j = 0; j < board_string.length; j += 2 ) {
		move = [];
		half_move1 = board_string[j].split(",");
		half_move2 = board_string[j + 1].split(",");
		move.push(parseInt(half_move1[4]));
		move.push(parseInt(half_move2[4]));
		move.push(parseInt(half_move1[1]));
		move.push(parseInt(half_move1[2]));
		move.push(half_move1[5]);
		move.push(parseInt(half_move1[3]));
		board.push(move);
	}
	this.processMoves(board);
}

DominupScene.prototype.handlePlayReply = function(data){
	console.log(data.target.response);
	var response = JSON.parse(data.target.response);
	myScene.processBoard(response.board);
	myScene.turn = parseInt(response.player);
	myScene.gameOver = parseInt(response.gameover);
    // check if game over
    var winner;
    if((winner = myScene.gameOver)!=0) {
      	console.log('gameOver');
      	myScene.endGame(winner);
      	return null;
    }
    myScene.selectedPieceId = undefined;
	if (myScene.players['player' + myScene.turn].level != 0) {
		myScene.gameState = 'COMPUTER_PLAY';
      	myScene.playComputerRequest();		
	}
    myScene.gameState = 'SELECT_PIECE';
}

DominupScene.prototype.handleError = function(data){
	console.log(data.target.response);
}

DominupScene.prototype.setupStartRequest = function(new_load, computer_human, load_file, name1, name2, easy_hard1, easy_hard2) {
	var requestString = '[setupStartGameHTTP,' + new_load + ',' + computer_human + ',"' + load_file + '","' + name1 + '","' + name2 + '",' + easy_hard1 + ',' + easy_hard2 + ']';
	console.log(requestString);
	this.postGameRequest(requestString, this.handleSetupStartReply, this.handleError);
}

DominupScene.prototype.loadRequest = function(new_load, computer_human, load_file, name1, name2, easy_hard1, easy_hard2) {
	var requestString = '[setupStartGameHTTP,' + new_load + ',' + computer_human + ',"' + load_file + '","' + name1 + '","' + name2 + '",' + easy_hard1 + ',' + easy_hard2 + ']';
	console.log(requestString);
	this.postGameRequest(requestString, this.handleLoadReply, this.handleError);
}

DominupScene.prototype.playRequest = function(player, number1, number2, row, column, cardinal) {
	var requestString = '[playHTTP,' + player + ',' + number1 + ',' + number2 + ',' + row + ',' + column + ',' + cardinal + ']';
	console.log(requestString);
	this.postGameRequest(requestString, this.handlePlayReply, this.handleError);
}

DominupScene.prototype.playComputerRequest = function() {
	this.postGameRequest('[playComputerHTTP]', this.handlePlayReply, this.handleError);
}


DominupScene.prototype.processMove = function(piece, posA, posB, cardinal, level) {
	var matrx = mat4.create();
	mat4.identity(matrx);
	mat4.translate(matrx, matrx, vec3.fromValues(posA[0], -0.25 + level * 0.5, posA[1])); // number1 of piece in position posA with cardinal south
	if (cardinal == "w") {
		mat4.translate(matrx, matrx, vec3.fromValues(0.5, 0, 0)); 
		mat4.rotateY(matrx, matrx, Math.PI/2);
	}
	else if (cardinal == "n") {
		mat4.translate(matrx, matrx, vec3.fromValues(0, 0, 0.5)); 
		mat4.rotateY(matrx, matrx, Math.PI);		
	}
	else if (cardinal == "e") {
		mat4.translate(matrx, matrx, vec3.fromValues(0.5, 0, 1)); 
		mat4.rotateY(matrx, matrx, -Math.PI/2);
	}
	else {
		mat4.translate(matrx, matrx, vec3.fromValues(1, 0, 0.5)); 
	}
	piece.initialPosition = matrx;
	piece.played = true;
	this.gameSurface.movePatch(posA[0], posA[1], level * 0.5);
	this.gameSurface.movePatch(posB[0], posB[1], level * 0.5);
}

DominupScene.prototype.processMoves = function(moves_list) {
	var move;
	for (move in moves_list) {
		console.log(moves_list[move]);
		var piece;
		for(piece in this.pieces) {
    		if(this.pieces[piece].getValues()[0] == moves_list[move][0] && this.pieces[piece].getValues()[1] == moves_list[move][1]){
    			piece = this.pieces[piece];
	        	break;
    		}
      	}
      	var posA = [moves_list[move][2] - 1, moves_list[move][3] - 1];
		var posB;
		var cardinal = moves_list[move][4];
		if (cardinal == "n")
			posB = [posA[0] - 1, posA[1]];
		else if (cardinal == "s")
			posB = [posA[0] + 1, posA[1]];
		else if (cardinal == "w") 
			posB = [posA[0],posA[1] - 1];
		else if (cardinal == "e") 
			posB = [posA[0], posA[1] + 1];
		console.log(piece.getValues());
		console.log(posA);
		console.log(posB);
		var level = moves_list[move][5];
		this.processMove(piece, posA, posB, cardinal, level);
	}
}

DominupScene.prototype.startGame = function(){
	this.myInterface.createGameMenu();
	this.myInterface.hideNewGameMenu();
	this.state = 'START';
};

DominupScene.prototype.updateGameState = function(){
  	switch(this.state){
  		case 'LOAD':
  			if (this.loadFile != this.loadFiles[0]) {  			
  				if (this.loadFile == this.loadFiles[1]) {
  					this.load_file = 'saves/file1.pl';
   	     			this.startGame();
  				}
  				else if (this.loadFile == this.loadFiles[2]) {
  					this.load_file = 'saves/file2.pl';
   	     			this.startGame();
  				}
  				else if (this.loadFile == this.loadFiles[3]) {
  					this.load_file = 'saves/file3.pl';
   	     			this.startGame();
  				}
  				else if (this.loadFile == this.loadFiles[4]) {
  					this.load_file = 'saves/file4.pl';
   	     			this.startGame();
  				}
				this.players['player1'] = new Player(this, 'player1', 0, 'Player1');
	        	this.players['player2'] = new Player(this, 'player2', 0, 'Player2');
  			}
		case 'TYPE':
			this.load_file = 'saves/file1.pl';
			if(this.gameType == this.gameTypes[1]){
   				 //this.myInterface.showNamePlayer(2);   
   				this.players['player1'] = new Player(this, 'player1', 0, 'Player1');
          		this.players['player2'] = new Player(this, 'player2', 0, 'Player2');
    			this.startGame();			
			}

/*    		if(this.gameType == this.gameTypes[1]){
				//this.myInterface.showNamePlayer(2); 		
				this.state = 'NAMES';
			}
*/			else if(this.gameType == this.gameTypes[2]){
				this.state = 'LEVELP1';
				//this.myInterface.showNamePlayer(1);
				this.myInterface.showLevelPlayer('Computer');
			}
			else if(this.gameType == this.gameTypes[3]){
				this.state = 'LEVELP1';
				this.myInterface.showLevelPlayer('Computer 1');
			}
			break;

		case 'NAMES':
			//this.myInterface.showNamePlayer(2); 		
			this.players['player1'] = new Player(this, 'player1', 0, this.namePlayer1);
        	this.players['player2'] = new Player(this, 'player2', 0, this.namePlayer2);
			//this.startGame();
			break;

		case 'LEVELP1':
			if(this.gameLevel != this.gameLevels[0]){
          		var level;
          		if (this.gameLevel == this.gameLevels[1]) level = 1;
          		else level = 2;
				if(this.gameType == this.gameTypes[2]){
          			this.players['player1'] = new Player(this, 'player1', 0, this.namePlayer1);
          			this.players['player2'] = new Player(this, 'player2', level, 'Computer');
          			this.startGame();
				}
				else{
					this.players['player1'] = new Player(this, 'player1', level, 'Compute1');
					this.state='LEVELP2';
					this.myInterface.showLevelPlayer('Computer 2');
				}
			}
			break;
		
		case 'LEVELP2':
			if(this.gameLevel != this.gameLevels[0]){
          		var level;
          		if (this.gameLevel == this.gameLevels[1]) level = 1;
          		else level = 2;
		        this.players['player2'] = new Player(this, 'player2', level, 'Compute2');
				this.startGame();
			}
			break;
    	
    	case 'START':
      		this.newGame();
      		var game_type;
      		var new_load;
      		if (this.gameType == this.gameTypes[1]) {
      			game_type = 0;
      			new_load = 0;
      		}
      		else if (this.gameType == this.gameTypes[2]) {
      			game_type = 1;
      			new_load = 0;
      		}
      		else if (this.gameType == this.gameTypes[3]) {
      			game_type = 2;
      			new_load = 0;
      		}
      		else new_load = 1;
      		if (new_load == 0)
	   	     	this.setupStartRequest(0, game_type, this.load_file, this.players['player1'].playerId, this.players['player2'].playerId, this.players['player1'].level, this.players['player2'].level);
	   	    else 
	   	    	this.loadRequest(1, 0, this.load_file, 'p1', 'p2', 0, 0);
      		break;
    	
    	case 'PLAY':
      		this.updateCameraPosition();
      		break;
		
		default: break;
	}
};

DominupScene.prototype.update = function(currTime) {
	//this.clock.update(currTime);

  // update game environment
  /*if(this.gameEnvironment in this.environments)
    this.environments[this.gameEnvironment].update(currTime);

  if(this.cameraAnimation != undefined && this.cameraAnimation.isActive())
    this.cameraAnimation.update(currTime);
*/
	if(!this.pauseGame){
    	if(this.timeout != 0 && this.responseTime >= this.timeout * 1000){
      	// loose turn
    	}
    	else this.responseTime += currTime - this.timePaused;
	
	    for(pieceId in this.pieces)
        this.pieces[pieceId].update(currTime - this.timePaused);

		this.updateGameState();
	}
	else this.timePaused += (currTime - this.previousTime);

	this.previousTime = currTime;
}


DominupScene.prototype.initGame = function () {
  	this.timeout = 60;
  	this.message = new MessageBoard(this, 5,5);
	this.state = 'TYPE';
	this.moves = [];
  	this.players = [];
  	this.selectedPiece = [8, 8];
  	this.selectedPieceId = 5036;
  	this.posA = [26, 26];
  	this.posB = [26, 26];
	this.cardinal = "e";
	this.level = 0;

	this.pauseGame = false;
	this.timePaused = 0;
	this.previousTime;

  	// types of game
	this.gameTypes = ['(select one type)', 'Human vs Human', 'Human vs Computer', 'Computer vs Computer'];
	this.gameType = this.gameTypes[0];

	this.loadFiles = ['(choose load file)', 'File 1', 'File 2', 'File 3', 'File 4'];
	this.loadFile = this.loadFiles[0];

  	// game levels
	this.gameLevels = ['(select one level)', 'Easy', 'Hard'];
	this.gameLevel = this.gameLevels[0];

	// game players names
	this.namePlayer1 = 'nameP1';
	this.namePlayer2 = 'nameP2';

	this.initGameEnvironments();
  	this.initGameLooks();
};

DominupScene.prototype.initGameEnvironments = function () {

	this.gameEnvironments = ['default', 'env1', 'env2'];
	this.gameEnvironment = this.gameEnvironments[0];
	this.environments = [];
};

DominupScene.prototype.initGamePieces = function () {
	this.pieces = [];
	var piecesId = 5000;  // ID range for domino pieces

 	for(var i = 0 ; i < 8 ; i++)
		for(var j = i ; j < 8 ; j++){
			this.pieces[[i,j]] = new Piece(this, i, j);
			this.pieces[[i,j]].setId(piecesId++);
		}
};

DominupScene.prototype.initGameSurface = function () {
	this.gameSurfaceXX = 26;
	this.gameSurfaceYY = 26;
	this.gameSurface = new GameSurface(this, this.gameSurfaceXX, this.gameSurfaceYY);
	//this.gameSurface = new Board26(this,26);
};


DominupScene.prototype.initGamePlayers = function () {
	this.state = 'PLAY';
	this.players['player1'] = new Player(this, 'player1', 0, 'Player1');
	this.players['player2'] = new Player(this, 'player2', 0, 'Player2');
  	var initIds = [];
  	for(id in this.pieces)
    	initIds.push(id);
	var t1 = initIds.slice(0, 18);
	var t2 = initIds.slice(18, 36);
	this.players['player1'].setPieces(t1);
	this.players['player2'].setPieces(t2);
};


DominupScene.prototype.updateCameraPosition = function () {
  if(this.cameraPosition != this.currCameraPosition){
    console.log('camera Position Changed to ' + this.cameraPosition);
    console.log('camera Position Changed to ' + this.currCameraPosition);
    
    // TODO animations to camera
    switch (this.cameraPosition) {
      case 'start game':
      	break;
      case 'player1 view':
      	break;
      case 'player2 view':
      	break;
      case 'board view':
        break;
    }

    this.cameraAnimation.activate();
    this.currCameraPosition = this.cameraPosition;
  }
};


DominupScene.prototype.initCameras = function () {
 	this.cameraPositions = ['start game', 'player1 view', 'player2 view', 'board view'];
  	this.currCameraPosition = this.cameraPositions[0];
  	this.cameraPosition = this.cameraPositions[0];

  	this.cameraPositionsAngle = [];
  	this.cameraPositionsAngle['start game'] = 3*Math.PI/2;
  	this.cameraPositionsAngle['player1 view'] = Math.PI/2; 
  	this.cameraPositionsAngle['player2 view'] = Math.PI;
  	this.cameraPositionsAngle['board view'] = Math.PI;
  	

  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(50, 40, 50), vec3.fromValues(0, -10, 0));
  
  // create animation for camera
  this.cameraAnimation = undefined;
  
};


DominupScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.3, 0.3, 0.3, 1.0);
    this.setDiffuse(0.3, 0.3, 0.3, 1.0);
    this.setSpecular(0.3, 0.3, 0.3, 1.0);
    this.setShininess(1);
};


DominupScene.prototype.updateLights = function() {
	for (var i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}

DominupScene.prototype.initGameLooks = function () {
	this.gameLooks = ['colored', 'default'];//, 'other2'];
	this.gameLook = this.gameLooks[0];

	this.lookMaterials = [];
	this.lookMaterials['default'] = [];
	this.lookMaterials['default']['ambient'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['diffuse'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['specular'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['emission'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['shininess'] = 1;
	this.lookMaterials['colored'] = [];
	this.lookMaterials['colored']['ambient'] = [.5,.5,.5,.5];
	this.lookMaterials['colored']['diffuse'] = [.5,.5,.5,.5];
	this.lookMaterials['colored']['specular'] = [.5,.5,.5,.5];
	this.lookMaterials['colored']['emission'] = [.5,.5,.5,.5];
	this.lookMaterials['colored']['shininess'] = 1;


	this.lookMaterials['wood'] = this.lookMaterials['default'];
  	this.lookMaterials['marble'] = this.lookMaterials['default'];

	this.textures = [];
	this.materials = [];

	for(var i = 0 ; i < this.gameLooks.length ; i++){
		var look = this.gameLooks[i];

		this.textures[look] = [];

		for(var j = 0 ; j < 9 ; j++)
			 this.textures[look][j] = new CGFtexture(this, 'textures/' + look + '_' + j + '.png');

   		this.textures[look]['gameSurface'] = new CGFtexture(this, 'textures/' + look + 'gameSurface.png');

		this.materials[look] = new CGFappearance(this);
		this.materials[look].setAmbient( this.lookMaterials[look]['ambient'][0],
										 this.lookMaterials[look]['ambient'][1],
										 this.lookMaterials[look]['ambient'][2],
										 this.lookMaterials[look]['ambient'][3]);

		this.materials[look].setDiffuse( this.lookMaterials[look]['diffuse'][0],
										 this.lookMaterials[look]['diffuse'][1],
										 this.lookMaterials[look]['diffuse'][2],
										 this.lookMaterials[look]['diffuse'][3]);

		this.materials[look].setSpecular(this.lookMaterials[look]['specular'][0],
										 this.lookMaterials[look]['specular'][1],
										 this.lookMaterials[look]['specular'][2],
										 this.lookMaterials[look]['specular'][3]);

		this.materials[look].setEmission(this.lookMaterials[look]['emission'][0],
										 this.lookMaterials[look]['emission'][1],
										 this.lookMaterials[look]['emission'][2],
										 this.lookMaterials[look]['emission'][3]);

		this.materials[look].setShininess(this.lookMaterials[look]['shininess']);
		this.materials[look].setTextureWrap("REPEAT","REPEAT");
	}
};


DominupScene.prototype.pieceSelected = function (id){

	if(this.selectedPieceId!=undefined){
	   // do anitation to old piece
   	 for(piece in this.pieces)
    	 if(this.pieces[piece].getId() == this.selectedPieceId){
        	this.pieces[piece].unselected();
        	break;
      	}
	}

	this.selectedPieceId = id;
  	this.gameState = 'PIECE_SELECTED';

	// do animation to new piece
  for(piece in this.pieces)
   if(this.pieces[piece].getId()==id){
     this.selectedPiece=this.pieces[piece].getValues();
     this.pieces[piece].selected();
     console.log("pieceSelected " + piece);
     break;
   }
};

DominupScene.prototype.isGameOver = function (){
  for(playerId in this.players)
    if(this.players[playerId].length==0)
      return playerId;

  return null;
};

DominupScene.prototype.undoLastMove = function (){
  var lastPlay = this.moves.pop();

  // do animation to piece

  // return piece to player

  this.players[lastPlay['player']].addPiece(this.pieces[lastPlay['piece']].getValues());



};

DominupScene.prototype.reviewGame = function (){
  this.pauseReview = false;
  this.myInterface.hideGameMenu();
  this.myInterface.createReviewMenu();
  this.state = 'REVIEW';

  this.fullGame = this.moves.slice();

  console.log('review');
};

DominupScene.prototype.makeMove = function (){
	console.log("piece and location chosen, make move");
	console.log(this.selectedPiece);
    // set piece animation

    this.moves.push({player: this.turn, piece: this.selectedPieceId});

    // check if game over
    var winner;
    if((winner = this.gameOver)!=0) {
      console.log('gameOver');
      this.endGame(winner);
      return null;
    }


    this.selectedPieceId = undefined;
	var playerTurn = 'player' + this.turn;
	console.log(this.players[playerTurn]);
    if (!this.players[playerTurn].level != 0){
      	playComputerRequest();
    }
    else this.gameState = 'SELECT_PIECE';
};


DominupScene.prototype.checkPosition = function(){
	if (this.posA[0] - this.posB[0] == 1 && this.posA[1] == this.posB[1]) {
		this.cardinal = "n";
		return true;
	}
	else if (this.posA[0] - this.posB[0] == -1 && this.posA[1] == this.posB[1]) {
		this.cardinal = "s";
		return true;
	}
	else if (this.posA[0] == this.posB[0] && this.posA[1] - this.posB[1] == 1) {
		this.cardinal = "w";
		return true;
	}
	else if (this.posA[0] == this.posB[0] && this.posA[1] - this.posB[1] == -1) {
		this.cardinal = "e";
		return true;		
	}
	else return false;
}

DominupScene.prototype.pickHandler = function (id){
	if(this.pauseGame)
    	return;
	// if a piece was picked
	if(id >= 5000){
    	console.log("piecetouched " + id);
    	if(this.selectedPieceId == id){
      	// unselect piece
      	this.gameState='SELECT_PIECE';
      	for(piece in this.pieces)
       	if(this.pieces[piece].getId() == this.selectedPieceId){
	         this.pieces[piece].unselected();
	         break;
	       }
	      this.selectedPieceId = undefined;
	    }	
	    else this.pieceSelected(id);
	}
	else{
    console.log('position selected ' + this.gameSurface.getPosition(id));
  	// if a position was picked
		if(this.gameState == 'PIECE_SELECTED'){
			this.posA = this.gameSurface.getPosition(id);
      		this.gameState='SELECT_LOCATION_B';
    	}
    	else if(this.gameState == 'SELECT_LOCATION_B'){
			this.posB = this.gameSurface.getPosition(id);
			// check if valid combination
			var cardinal;
			if (!this.checkPosition())
        		this.posA = this.gameSurface.getPosition(id);
      		else {
      			this.playRequest(this.turn, this.selectedPiece[0], this.selectedPiece[1], this.posA[0] + 1, this.posA[1] + 1, this.cardinal);
      		}
		}
	}

};


DominupScene.prototype.logPicking = function (){
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj){
					var customId = this.pickResults[i][1];
					this.pickHandler(customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
};


DominupScene.prototype.display = function () {

  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
  this.gl.enable(this.gl.DEPTH_TEST);


  this.updateProjectionMatrix();
  this.loadIdentity();

  /*this.pushMatrix();
    this.statusBoard.display();
  this.popMatrix();*/

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
 
  if(this.cameraAnimation!=undefined)
    this.multMatrix(this.cameraAnimation.getCurrentTransformation());

	//this.setDefaultAppearance();
	this.updateLights();

	this.logPicking();
	this.clearPickRegistration();

 
    this.pushMatrix();
      this.translate(0,5,0);
      this.message.display();
    this.popMatrix();

	if(this.state == 'PLAY'){
   	  
   	  this.pushMatrix();
 
      this.translate(-5,0,-5);
      this.players['player1'].showPlayerPieces();
      this.players['player2'].showPlayerPieces();
      this.showPlayedPieces();
      this.gameSurface.display();
      
      this.popMatrix();
	}
};

DominupScene.prototype.showPlayedPieces = function (){
//	if (!this.pickMode) {
		for (var piece in this.pieces) {
			if (this.pieces[piece].played) {
				this.pushMatrix();
//				this.clearPickRegistration();
				this.pieces[piece].display();
				this.popMatrix();
			}
		}
//	}
};


