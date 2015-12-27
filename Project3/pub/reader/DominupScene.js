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
  console.log('load game');
};

DominupScene.prototype.saveGame = function (){
	console.log('save game');
};

DominupScene.prototype.newGame = function(){
  	this.turn = 'player1'; //TODO change to player name
	this.initGamePieces();
	this.initGameSurface();
//	this.initGamePlayers();
};

DominupScene.prototype.endGame = function(winner){
  console.log(winner); // TODO show in MessageBoard
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

DominupScene.prototype.handleReply = function(data){
	console.log(data.target.response);
	var response = JSON.parse(data.target.response);
	var message = response.message;
	var player_order = message.split(" / ");
	var id1 = player_order[0].split(" - ")[1];
	console.log(id1);
	var id2 = player_order[1].split(" - ")[1];
	console.log(id2);
	var distribution = response.distribution.split("[")[1].split("]")[0].split(",");
	console.log(distribution);
	var pieces1;
	var pieces2;
	var check;
	console.log(this.players);
	if (id1 == this.players['player1'].playerId) check = "1";
	else check = "2";
	for (var i = 0; i < 36; i++) {
		if (distribution[i] == check)
			pieces1.push(i);
		else pieces2.push(i);
	}
	this.players['player1'].setPieces(pieces1);
	this.players['player2'].setPieces(pieces2);
}

DominupScene.prototype.handleError = function(data){
	console.log(data.target.response);
}

DominupScene.prototype.setupStartRequest = function(new_load, computer_human, load_file, name1, name2, easy_hard1, easy_hard2) {
	var requestString = '[setupStartGameHTTP,' + new_load + ',' + computer_human + ',"' + load_file + '","' + name1 + '","' + name2 + '",' + easy_hard1 + ',' + easy_hard2 + ']';
	console.log(requestString);
	this.postGameRequest(requestString, this.handleReply, this.handleError);
}

DominupScene.prototype.playRequest = function(player, number1, number2, row, column, cardinal) {
	var requestString = '[playHTTP,' + v_player + ',' + v_number1 + ',' + v_number2 + ',' + v_row + ',' + v_column + ',' + v_cardinal + ']';
	console.log(requestString);
	this.postGameRequest(requestString, this.handleReply, this.handleError);
}

DominupScene.prototype.startGame = function(){
	this.myInterface.createGameMenu();
	this.myInterface.hideNewGameMenu();
	this.state = 'START';
};

DominupScene.prototype.updateGameState = function(){
  	switch(this.state){
		case 'TYPE':
			if(this.gameType == this.gameTypes[1]){
				this.players['player1'] = new Player(this, 'player1', 0, 'Player1');
	        	this.players['player2'] = new Player(this, 'player2', 0, 'Player2');
   	     		this.setupStartRequest(0, 0, 'saves/angie_hard.pl', this.players['player1'].playerId, this.players['player2'].playerId, this.players['player1'].level, this.players['player2'].level);
   	     		this.startGame();
			}
			else if(this.gameType == this.gameTypes[2]){
				this.state = 'LEVELP1';
				this.myInterface.showLevelPlayer('Computer');
			}
			else if(this.gameType == this.gameTypes[3]){
				this.state = 'LEVELP1';
				this.myInterface.showLevelPlayer('Computer 1');
			}
			break;

		case 'LEVELP1':
			if(this.gameLevel != this.gameLevels[0]){
          		var level;
          		if (this.gameLevel == this.gameLevels[1]) level = 1;
          		else level = 2;
				if(this.gameType == this.gameTypes[2]){
          			this.players['player1'] = new Player(this, 'player1', 0, 'Player');
          			this.players['player2'] = new Player(this, 'player2', level, 'Computer');
    	    		this.setupStartRequest(0, 1, 'saves/angie_hard.pl', this.players['player1'].playerId, this.players['player2'].playerId, this.players['player1'].level, this.players['player2'].level);
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
    	    	this.setupStartRequest(0, 2, 'saves/angie_hard.pl', this.players['player1'].playerId, this.players['player2'].playerId, this.players['player1'].level, this.players['player2'].level);
				this.startGame();
			}
			break;
    	
    	case 'START':
      		this.newGame();
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
  if(this.gameEnvironment in this.environments)
    this.environments[this.gameEnvironment].update(currTime);

  if(this.cameraAnimation != undefined && this.cameraAnimation.isActive())
    this.cameraAnimation.update(currTime);

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

	this.pauseGame = false;
	this.timePaused = 0;
	this.previousTime;

  	// types of game
	this.gameTypes = ['(select one type)', 'Human vs Human', 'Human vs Computer', 'Computer vs Computer'];
	this.gameType = this.gameTypes[0];

  	// game levels
	this.gameLevels = ['(select one level)', 'Easy', 'Hard'];
	this.gameLevel = this.gameLevels[0];
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
	var piecesId = 500;  // ID range for domino pieces

 	for(var i = 0 ; i < 8 ; i++)
		for(var j = i ; j < 8 ; j++){
			this.pieces[[i,j]] = new Piece(this, i, j);
			this.pieces[[i,j]].setId(piecesId++);
		}
};

DominupScene.prototype.initGameSurface = function () {
	/*this.gameSurfaceXX = 26;
	this.gameSurfaceYY = 26;
	this.gameSurface = new GameSurface(this, this.gameSurfaceXX, this.gameSurfaceYY);*/
	this.gameSurface = new Board26(this,26);
};


DominupScene.prototype.initGamePlayers = function () {

  this.state = 'PLAY';


  this.players['player1'] = new Player(this, 'player1');
  this.players['player2'] = new Player(this, 'player2');
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
  	

  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
  
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
	this.gameLooks = ['default']//, 'other1', 'other2'];
	this.gameLook = this.gameLooks[0];

	this.lookMaterials = [];
	this.lookMaterials['default'] = [];
	this.lookMaterials['default']['ambient'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['diffuse'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['specular'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['emission'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['shininess'] = 1;


	this.lookMaterials['wood'] = this.lookMaterials['default'];
  	this.lookMaterials['marble'] = this.lookMaterials['default'];

	this.textures = [];
	this.materials = [];

	for(var i = 0 ; i < this.gameLooks.length ; i++){
		var look = this.gameLooks[i];

		this.textures[look] = [];

		for(var j = 0 ; j < 8 ; j++)
			 this.textures[look][j] = new CGFtexture(this, 'textures/' + look + '_' + j + '.png');

   		this.textures[look]['gameSurface'] = new CGFtexture(this, 'textures/' + look + 'gameSurface.jpg');

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

    // set piece animation

    this.moves.push({player: this.turn, piece: this.selectedPieceId});

    // check if game over
    var winner;
    if((winner = this.isGameOver())!=null) {
      console.log('gameOver');
      this.endGame(winner);
      return null;
    }


    this.turn = (this.turn == 'player1') ? 'player2' : 'player1';
    this.selectedPieceId = undefined;


    if(!this.players[this.turn].human){
      this.players[this.turn].makeMove();
      this.makeMove();
    }
    else this.gameState = 'SELECT_PIECE';
};


function checkPosition(posA, posB){
  if((Math.abs(posA[0] - posB[0]) == 1 && posA[1] == posB[1]) || (posA[0] == posB[0] && Math.abs(posA[1] - posB[1]) == 1))
      return true;
  else return false;
}

DominupScene.prototype.pickHandler = function (id){
  if(this.pauseGame)
    return;

	// if a piece was picked
	if(id >= 500){
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
    console.log('position selected' + this.gameSurface.getPosition(id));

  	// if a position was picked
		if(this.gameState == 'PIECE_SELECTED'){
			this.posA = this.gameSurface.getPosition(id);
      this.gameState='SELECT_LOCATION_B';
    	}
    	else if(this.gameState == 'SELECT_LOCATION_B'){
				this.posB = this.gameSurface.getPosition(id);

      // check if valid combination
      if(!checkPosition(this.posA, this.posB))
        this.posA = this.gameSurface.getPosition(id);
      else this.makeMove();
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
      this.gameSurface.display();
      
      this.popMatrix();
	}
};
