/*
 * DominupScene
 * @constructor
 */


function deg2rad(degrees) {
	return degrees * Math.PI / 180;
}


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

/*DominupScene.prototype.initLights = function () {
	this.lights[0].setPosition(5, 5, 5, 1);
  	this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
  	this.lights[0].update();
};*/

DominupScene.prototype.initLights = function () {

	this.lights = [];
	this.lights_ids = []; // para cada id guarda-se a informação da lampada estar on/off 
	
	var i = 0;
	for(light in this.graph.lights){

		var temp_id = this.graph.lights[light].id;
 		var temp = new CGFlight(this, i); 

		temp.setPosition(this.graph.lights[light].position.x, this.graph.lights[light].position.y, this.graph.lights[light].position.z, this.graph.lights[light].position.w);
		temp.setDiffuse(this.graph.lights[light].diffuse.r, this.graph.lights[light].diffuse.g, this.graph.lights[light].diffuse.b, this.graph.lights[light].diffuse.a);
		temp.setAmbient(this.graph.lights[light].ambient.r, this.graph.lights[light].ambient.g, this.graph.lights[light].ambient.b, this.graph.lights[light].ambient.a);
		temp.setSpecular(this.graph.lights[light].specular.r, this.graph.lights[light].specular.g, this.graph.lights[light].specular.b, this.graph.lights[light].specular.a);
		temp.setVisible(true);

		if(this.graph.lights[light].enable){
			temp.enable();
		}
		else {
			temp.disable();
		}
		this.lights[i] = temp; // adiciona luz da CGF 
		this.lights[i].ident = temp_id;	
		this.lights_ids[temp_id] = temp.enabled; 
 		i++;
	}
};

DominupScene.prototype.loadGame = function(){
	this.state = 'LOAD';
};

DominupScene.prototype.saveGame = function (){
	this.state = 'SAVE';
};

DominupScene.prototype.newGame = function(){
	this.initGamePieces();
	this.initGameSurface();
  	this.state = 'PLAY';
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
	var name1 = player_order[0].split(" - ")[1];
	var name2 = player_order[1].split(" - ")[1];
	var level1 = parseInt(player_order[0].split(" - ")[2]) - 1;
	var level2 = parseInt(player_order[1].split(" - ")[2]) - 1;
	myScene.players['player1'].name = name1;
	myScene.players['player2'].name = name2;
	myScene.players['player1'].level = level1;
	myScene.players['player2'].level = level2;
	var distribution = response.distribution.split("[")[1].split("]")[0].split(",");
	var pieces1 = [];
	var pieces2 = [];
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
    if(myScene.gameOver != 0) {
      	myScene.state = 'OVER';
      	myScene.myInterface.hideGameMenu();
      	return;
    }
    myScene.selectedPieceId = undefined;
	if (myScene.players['player' + myScene.turn].level != 0) {
		myScene.gameState = 'COMPUTER_PLAY';
      	myScene.playComputerRequest();		
	}
    myScene.gameState = 'SELECT_PIECE';
}

DominupScene.prototype.handleSetupStartReply = function(data){
	console.log(data.target.response);
	var response = JSON.parse(data.target.response);
	var message = response.message;
	var player_order = message.split(" / ");
	var name1 = player_order[0].split(" - ")[1];
	var name2 = player_order[1].split(" - ")[1];
	var level1 = parseInt(player_order[0].split(" - ")[2]) - 1;
	var level2 = parseInt(player_order[1].split(" - ")[2]) - 1;
	myScene.players['player1'].name = name1;
	myScene.players['player2'].name = name2;
	myScene.players['player1'].level = level1;
	myScene.players['player2'].level = level2;
	var distribution = response.distribution.split("[")[1].split("]")[0].split(",");
	var pieces1 = [];
	var pieces2 = [];
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
    if(myScene.gameOver != 0) {
      	myScene.state = 'OVER';
      	myScene.myInterface.hideGameMenu();
      	return;
    }
    myScene.selectedPieceId = undefined;
	if (myScene.players['player' + myScene.turn].level != 0) {
		myScene.gameState = 'COMPUTER_PLAY';
      	myScene.playComputerRequest();		
	}
    myScene.gameState = 'SELECT_PIECE';
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
    if(myScene.gameOver != 0) {
      	myScene.state = 'OVER';
      	myScene.myInterface.hideGameMenu();
      	return;
    }
    myScene.selectedPieceId = undefined;
	if (myScene.players['player' + myScene.turn].level != 0) {
		myScene.gameState = 'COMPUTER_PLAY';
      	myScene.playComputerRequest();		
	}
    myScene.gameState = 'SELECT_PIECE';
}

DominupScene.prototype.handleSaveReply = function(data){
	console.log(data.target.response);
}

DominupScene.prototype.handleError = function(data){
	console.log(data.target.response);
}

DominupScene.prototype.setupStartRequest = function(new_load, computer_human, load_file, name1, name2, easy_hard1, easy_hard2) {
	var requestString = '[setupStartGameHTTP,' + new_load + ',' + computer_human + ',"' + load_file + '","' + name1 + '","' + name2 + '",' + easy_hard1 + ',' + easy_hard2 + ']';
	console.log(requestString);
	this.postGameRequest(requestString, this.handleSetupStartReply, this.handleError);
}

DominupScene.prototype.playRequest = function(player, number1, number2, row, column, cardinal) {
	var requestString = '[playHTTP,' + player + ',' + number1 + ',' + number2 + ',' + row + ',' + column + ',' + cardinal + ']';
	console.log(requestString);
	this.postGameRequest(requestString, this.handlePlayReply, this.handleError);
}

DominupScene.prototype.playComputerRequest = function() {
	var requestString = '[playComputerHTTP]';
	console.log(requestString);
	this.postGameRequest(requestString, this.handlePlayReply, this.handleError);
}

DominupScene.prototype.saveRequest = function(save_file) {
	var requestString = '[saveHTTP,"' + save_file + '"]';
	console.log(requestString);
	this.postGameRequest(requestString, this.handleSaveReply, this.handleError);
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
  		case 'SAVE':
  			if (this.saveFile != this.saveFiles[0]) {  			
  				if (this.saveFile == this.saveFiles[1]) {
  					this.save_file = 'saves/file1.pl';
  				}
  				else if (this.saveFile == this.saveFiles[2]) {
  					this.save_file = 'saves/file2.pl';
  				}
  				else if (this.saveFile == this.saveFiles[3]) {
  					this.save_file = 'saves/file3.pl';
  				}
  				else if (this.saveFile == this.saveFiles[4]) {
  					this.save_file = 'saves/file4.pl';
  				}
	   	   		this.saveRequest(this.save_file);
  				this.state = 'DONE';
  			}
  			break;
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
				this.players['player1'] = new Player(this, 'player1', 0, this.namePlayer1);
	        	this.players['player2'] = new Player(this, 'player2', 0, this.namePlayer2);
  			}
  			break;
		case 'TYPE':
			if(this.gameType == this.gameTypes[1]){
				this.state = "NAMES";
				this.myInterface.showNamePlayers(); 	
   				//this.players['player1'] = new Player(this, 'player1', 0, this.namePlayer1);
          		//this.players['player2'] = new Player(this, 'player2', 0, this.namePlayer2);
    			//this.startGame();			
			}
			else if(this.gameType == this.gameTypes[2]){
				this.state = 'LEVELP1';
				this.myInterface.showLevelPlayer('Computer');
				this.myInterface.showNamePlayer();
				
			}
			else if(this.gameType == this.gameTypes[3]){
				this.state = 'LEVELP1';
				this.myInterface.showLevelPlayer('Computer 1');
			}
			break;

		case 'NAMES':
			//this.myInterface.showNamePlayer(); 		
			this.players['player1'] = new Player(this, 'player1', 0, this.namePlayer1);
        	this.players['player2'] = new Player(this, 'player2', 0, this.namePlayer2);
			if(this.enter == "Yes"){
				console.log(this.namePlayer1);
				console.log(this.namePlayer2);
				this.startGame();
			}
			break;

		case 'LEVELP1':
			if(this.gameLevel != this.gameLevels[0]){
          		var level;
          		if (this.gameLevel == this.gameLevels[1]) level = 1;
          		else level = 2;
				if(this.gameType == this.gameTypes[2]){
          			this.players['player1'] = new Player(this, 'player1', 0, this.namePlayer1);
          			this.players['player2'] = new Player(this, 'player2', level, 'Computer');
          			if(this.enter == "Yes"){
          			this.startGame();
          			}
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
				if(this.enter == "Yes"){
          			this.startGame();
          		}
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
	   	     	this.setupStartRequest(0, game_type, 'saves/file1.pl', this.players['player1'].name, this.players['player2'].name, this.players['player1'].level + 1, this.players['player2'].level + 1);
	   	    else {
	   	    	this.setupStartRequest(1, 0, this.load_file, 'p1', 'p2', 0, 0);
	   	    }
      		break;
    	
    	case 'PLAY':
      		this.updateCameraPosition();
      		break;
		
		default: break;
	}
};

DominupScene.prototype.update = function(currTime) {
	if(!this.pauseGame){
    	if(this.timeout != 0 && this.responseTime >= this.timeout * 1000){
      	// loose turn
    	}
    	else this.responseTime += currTime - this.timePaused;
	
		this.updateGameState();
	}
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
	this.turn = 2;
	this.pauseGame = false;
	this.timePaused = 0;
	this.previousTime;

  	// types of game
	this.gameTypes = ['(select one type)', 'Human vs Human', 'Human vs Computer', 'Computer vs Computer'];
	this.gameType = this.gameTypes[0];

	this.enters = ["Start Now?", "Yes"];
	this.enter = this.enters[0];
		
	// load files
	this.loadFiles = ['(choose file)', 'File 1', 'File 2', 'File 3', 'File 4'];
	this.loadFile = this.loadFiles[0];

	// load files
	this.saveFiles = ['(choose file)', 'File 1', 'File 2', 'File 3', 'File 4'];
	this.saveFile = this.saveFiles[0];

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
};

DominupScene.prototype.updateCameraPosition = function () {
  if(this.cameraPosition != this.currCameraPosition){
    console.log('camera Position ' + this.cameraPosition);
    console.log('Currcamera Position ' + this.currCameraPosition);
    
    switch (this.currCameraPosition) {
      case 'start game':
      	this.pushMatrix();
      		//this.cleanCamera(this.cameraPositionsAngle[this.currCameraPosition]);
      		this.camera.orbit(0,1,0,this.cameraPositionsAngle[this.cameraPosition]);
      	this.popMatrix();
      	break;
      case 'player1 view':
      	this.pushMatrix();
      		//this.cleanCamera(this.cameraPositionsAngle[this.currCameraPosition]);
      		this.camera.orbit(0,1,0,this.cameraPositionsAngle[this.cameraPosition]);
      	this.popMatrix();
      	break;
      case 'player2 view':
       	this.pushMatrix();
      		//this.cleanCamera(this.cameraPositionsAngle[this.currCameraPosition]);
      		this.camera.orbit(0,1,0,this.cameraPositionsAngle[this.cameraPosition]);
      	this.popMatrix();
     	break;
      case 'board view':
      	this.pushMatrix();
      		this.camera.setTarget([0,-40,0]);
      		this.camera.zoom([0,1,0,1]);	
      	this.popMatrix();
        break;
    }

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
  
};


DominupScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.3, 0.3, 0.3, 1.0);
    this.setDiffuse(0.3, 0.3, 0.3, 1.0);
    this.setSpecular(0.3, 0.3, 0.3, 1.0);
    this.setShininess(1);
};

DominupScene.prototype.cleanCamera = function (angle) {
	this.camera.orbit(0,1,0,-angle);
}

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

DominupScene.prototype.undoLastMove = function (){
	var lastPlay = this.moves.pop();
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

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	//this.setDefaultAppearance();
	this.updateLights();

	this.logPicking();
	this.clearPickRegistration();

 
    this.pushMatrix();
      this.translate(4,5,-5);
      this.message.display();
    this.popMatrix();

	if(this.state == 'PLAY' || this.state == 'OVER' || this.state == 'SAVE' || this.state == 'DONE'){
   	  
		this.pushMatrix();
 
      		this.translate(-5,0,-5);
      		var playerturn = 'player' + this.turn;
      		var other = 3 - this.turn;
      		var playerother = 'player' + other;
      		var levelturn = this.players[playerturn].level;
      		var levelother = this.players[playerother].level;
      		if (levelturn == 0)
      			this.players[playerturn].showPlayerPieces();
      		else if (levelother == 0)
      			this.players[playerother].showPlayerPieces();
      		else {
      			this.players[playerturn].showPlayerPieces();
      			this.players[playerother].showPlayerPieces();
      		}
      		this.showPlayedPieces();
      		this.gameSurface.display();
      
      	this.popMatrix();
	}
	if (this.graph.loadedOk) {	

		this.initialTransform();

		for(var i = 0 ; i < this.lights.length ; i++){
			this.lights[i].update();
		}
		
		// Draw axis
		if (this.graph.initialsInformation.reference > 0) {
			this.axis.display();
		}	

		var root_node = this.graph.nodes[this.graph.nodes['root_id']];
		this.displayNode(root_node);

	}	
};

DominupScene.prototype.showPlayedPieces = function (){
	for (var piece in this.pieces) {
		if (this.pieces[piece].played) {
			this.pushMatrix();
			this.pieces[piece].display();
			this.popMatrix();
		}
	}
};


// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop

DominupScene.prototype.onGraphLoaded = function () 
{
	// Lights

	this.initLights();

	// Frustum
    this.camera.near = this.graph.initialsInformation.frustum.near;
    this.camera.far = this.graph.initialsInformation.frustum.far;
	
    // Illumination
   
		// Background
		var illuBackground = this.graph.illumina.background;
		this.gl.clearColor(illuBackground.r, illuBackground.g, illuBackground.b, illuBackground.a);

		// Ambient
		var illuAmbient = this.graph.illumina.ambient;
		this.setGlobalAmbientLight(illuAmbient.r, illuAmbient.g, illuAmbient.b, illuAmbient.a);

	// Axis
	if (this.graph.initialsInformation.reference > 0) 
		this.axis = new CGFaxis(this, this.graph.initialsInformation.reference);

    //Textures
    this.textures["null"] = new CGFtexture(this, 'texture.png');
    this.textures["null"].amplif_factor = new Object();
    this.textures["null"].amplif_factor.s = 1;
    this.textures["null"].amplif_factor.t = 1;
    this.textures["null"].file = 'texture.png';

    for(var texture_id in this.graph.textures) {
    	var path = this.graph.textures[texture_id].file;
	    this.textures[texture_id] = new CGFtexture(this, path);
    	this.textures[texture_id].amplif_factor = this.graph.textures[texture_id].amplif_factor;
    	this.textures[texture_id].file = path;
	}
	this.enableTextures(true);

	// Nodes
	var root_node = this.graph.nodes[this.graph.nodes['root_id']];
	this.processNode(root_node);

};

DominupScene.prototype.initialTransform = function() {
    var init = this.graph.initialsInformation;
    var t = init.translate;
    var s = init.scale;
    var r = init.rotation;

    this.translate(t.x, t.y, t.z);
    this.rotate(deg2rad(r.x), 1, 0, 0);
    this.rotate(deg2rad(r.y), 0, 1, 0);
    this.rotate(deg2rad(r.z), 0, 0, 1);
    this.scale(s.sx, s.sy, s.sz);
};

DominupScene.prototype.displayNode = function(node) {
	this.pushMatrix();
	this.applyTransformations(node);
	if (node.animations != undefined) {
		this.applyAnimations(node);
	}
	if (node.primitives != undefined) {
		for (i = 0; i < node.primitives.length; i++) {
			node.materials[i].apply();
			if (node.primitives[i] != undefined)
				node.primitives[i].display();
	  	}
	}i
	for (var i in node.descendants) {
		new_node_id = node.descendants[i];
		new_node = this.graph.nodes[new_node_id];
		if (new_node != undefined)
			this.displayNode(new_node);
	}
	this.popMatrix();
};

DominupScene.prototype.applyTransformations = function(node) {
	for (j = 0; j < node.transformations.length ; j++) {
		var transformation = node.transformations[j];
		switch (transformation.type) {
			case "scale":
				this.scale(transformation.sx, transformation.sy, transformation.sz);
				break;
			case "rotation":
				switch(transformation.axis) {
					case "x":
						this.rotate(deg2rad(transformation.angle), 1, 0, 0);
						break;
					case "y":
						this.rotate(deg2rad(transformation.angle), 0, 1, 0);
						break;
					case "z":
						this.rotate(deg2rad(transformation.angle), 0, 0, 1);
						break;
				}
				break;
			case "translation":
				this.translate(transformation.x, transformation.y, transformation.z);
				break;
		}
	}
}

DominupScene.prototype.applyAnimations = function(node) {
	var animation;
	if (node.current_anim < node.animations.length)
		animation = node.animations[node.current_anim];
	else
		animation = node.animations[node.animations.length - 1];
	animation.apply();
}

DominupScene.prototype.processLeaf = function(leaf, texture_id) {
	var s = 1;
	var t = 1;
	if (texture_id != "clear") {
		var texture = this.textures[texture_id];
		if (texture != undefined) {
			s = texture.amplif_factor.s;
			t = texture.amplif_factor.t;			
		}
	}
	var primitive;
	switch (leaf.type) {
		case "rectangle":
			primitive = new rectangle(this, leaf.args, s, t);
			break;
		case "cylinder":
			primitive = new cylinder(this, leaf.args, s, t);
			break;
		case "sphere":
			primitive = new sphere(this, leaf.args, s, t);
			break;
		case "triangle":
			primitive = new triangle(this, leaf.args, s, t);
			break;
		case "plane":		
			primitive = new plane(this, leaf.args);
			break;
		case "patch":		
			primitive = new patch(this, leaf.args);
			break;
		case "terrain":		
			primitive = new terrain(this, leaf.args);
			break;
	}
	return primitive;  
};

DominupScene.prototype.processNode = function(node) {
	var new_node_id;
	var new_node;
	var leaf;
	for (var i in node.descendants) {
		new_node_id = node.descendants[i];
		new_node = this.graph.nodes[new_node_id];
		if (new_node == undefined) {
			leaf = this.graph.leaves[new_node_id];
			if (leaf == undefined) {
				console.warn('Warning: Node ' + new_node_id + ' is not defined!\n')
			}
			else {
				node.primitives.push(this.processLeaf(leaf, node.texture));
				var material_info = this.graph.materials[node.material];
				var material;
				if (node.material == "null" || material_info == undefined) {
					console.warn('Warning: Material ' + node.material + ' is not defined!\n');
					material = new CGFappearance(this);
					material.setShininess(1);
					material.setSpecular(1, 1, 1, 1);
					material.setDiffuse(1, 1, 1, 1);
					material.setAmbient(1, 1, 1, 1);
					material.setEmission(0, 0, 0, 1);
					material.setTextureWrap('REPEAT', 'REPEAT');
				}
				else {
					material = new CGFappearance(this);
					material.setShininess(material_info.shininess);
					material.setSpecular(material_info.specular.r, material_info.specular.g, material_info.specular.b, material_info.specular.a);
					material.setDiffuse(material_info.diffuse.r, material_info.diffuse.g, material_info.diffuse.b, material_info.diffuse.a);
					material.setAmbient(material_info.ambient.r, material_info.ambient.g, material_info.ambient.b, material_info.ambient.a);
					material.setEmission(material_info.emission.r, material_info.emission.g, material_info.emission.b, material_info.emission.a);
				}
				var texture_id = node.texture;
				if (texture_id != "clear") {
					var texture = this.textures[texture_id];
					if (texture_id == "null" || texture == undefined) {
						console.warn('Warning: Texture ' + texture_id + ' is not defined!\n');
						texture = this.textures["null"];
					}
					material.setTexture(texture);			
				}
				node.materials.push(material);
			}
		}		
		else {
			if (new_node.material == "null")
				new_node.material = node.material;
			if (new_node.texture == "null") 				
				new_node.texture = node.texture;
			if (new_node.animation_ids != undefined) {
				new_node.animations = [];
				new_node.current_anim = 0;
				for (j = 0; j < new_node.animation_ids.length ; j++) {
					var animation_id = new_node.animation_ids[j];
					var animation_stuff = this.graph.animations[animation_id];
					var animation;
					switch (animation_stuff.type) {
						case "linear":
							animation = new LinearAnimation(this, animation_stuff.span, animation_stuff.control_points);
							break;
						case "circular":
							animation = new CircularAnimation(this, animation_stuff.span, animation_stuff.radius, animation_stuff.center, animation_stuff.startang, animation_stuff.rotang);
							break;
						case "circularAxis":
							animation = new CircularAxisAnimation(this, animation_stuff.span, animation_stuff.radius, animation_stuff.center, animation_stuff.startang, animation_stuff.rotang, animation_stuff.axis);
							break;
					}
					new_node.animations.push(animation);
				}
				this.animation_nodes.push(new_node);
			}
			this.processNode(new_node);
		}		
	}
};


