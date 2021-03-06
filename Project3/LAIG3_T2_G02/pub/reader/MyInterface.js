
/*
 * MyInterface
 * @constructor
 */
function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);

MyInterface.prototype.constructor = MyInterface;

/*
 * init
 * @param CGFapplication application
 */
MyInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	return true;
};

MyInterface.prototype.createMainMenu = function() {
	// Initial Gui with new/load game and game configurations

	this.mainMenu = new dat.GUI();

	// New game
	this.startGameMenu = this.mainMenu.addFolder("New/Load Game");
	this.startGameMenu.add(this, 'newGame').name("New Game");
	this.startGameMenu.add(this, 'loadGame').name("Load Game");
	this.startGameMenu.click = 1;

	// Game cofigurations
	this.gameConfigurations = this.mainMenu.addFolder("Game Configurations");
	this.gameConfigurations.add(this.scene, 'timeout', 0, 180).step(5).name("Timeout");
	this.gameEnvironment = this.gameConfigurations.addFolder("Game Scenes");
	this.gameEnvironment.add(this.scene, 'gameEnvironment', this.scene.gameEnvironments).name("Game Environment");
	this.gameLookFolder = this.gameConfigurations.addFolder("Global Appearance");
	this.gameLookFolder.add(this.scene, 'gameLook', this.scene.gameLooks).name("Game Look");
};

MyInterface.prototype.newGame = function() {
	
	if(this.gameMenu != undefined){
		this.scene.state = 'GAME_TYPE';
		this.gameMenu.close();
	}

	this.scene.gameType = this.scene.gameTypes[0];
		
	//TODO Avoid additional gui new games
	
	// Additional Gui to select game type 
	if(this.startGameMenu.click == 1){
	this.newGameMenu = new dat.GUI();
	this.newGameFolder = this.newGameMenu.addFolder("Start New Game");
	this.newGameFolder.add(this.scene, 'gameType', this.scene.gameTypes).name("Game Type");
	this.newGameFolder.open();
	this.startGameMenu.click++;
	}
	else {
			this.newGameMenu.close();
			this.mainMenu.close();
			this.createMainMenu();
	}

};

MyInterface.prototype.loadGame = function() {
	
	if(this.gameMenu != undefined){
		this.scene.state = 'LOAD_GAME';
		this.gameMenu.close();
	}

	//TODO Avoid additional gui load games
	
	this.newGameMenu = new dat.GUI();
	this.newGameFolder = this.newGameMenu.addFolder("Load Game");
	this.newGameFolder.add(this.scene, 'loadFile', this.scene.loadFiles).name("Load File");
	this.newGameFolder.open();
	this.scene.loadGame();
	
};

MyInterface.prototype.saveGame = function() {
	this.saveGameMenu = new dat.GUI();
	this.saveGameFolder = this.saveGameMenu.addFolder("Save Game");
	this.saveGameFolder.add(this.scene, 'saveFile', this.scene.saveFiles).name("Save File");
	this.saveGameFolder.open();
	this.scene.saveGame();
};


MyInterface.prototype.createGameMenu = function() {
	this.gameMenu = new dat.GUI();

	this.gameOptions = this.gameMenu.addFolder("Game menu");
	this.gameOptions.add(this.scene, 'pauseGame').name("Pause Game");
	this.gameOptions.add(this.scene, 'undoLastMove').name("Back");
	this.gameOptions.add(this.scene, 'cameraPosition', this.scene.cameraPositions).name("Change Camera");
	this.gameOptions.add(this.scene, 'reviewGame').name("Game Movie");
	this.gameOptions.add(this, 'saveGame').name("Save Game");

	this.gameOptions.open();
};

MyInterface.prototype.createReviewMenu = function() {
	this.reviewMenu = new dat.GUI();
	
	this.reviewOptions = this.reviewMenu.addFolder("Review menu");
	this.reviewOptions.add(this.scene, 'pauseReview').name("Pause Review");
	this.reviewOptions.add(this.scene, 'quitReview').name("Quit Review");
	this.reviewOptions.open();
}

MyInterface.prototype.hideGameMenu = function() {
	this.gameMenu.close();//destroy();
};

MyInterface.prototype.hideReviewMenu = function() {
	this.reviewMenu.close();
};

MyInterface.prototype.hideNewGameMenu = function() {
	this.newGameMenu.close();
};

MyInterface.prototype.showLevelPlayer = function(namePlayer){
	this.scene.gameLevel = this.scene.gameLevels[0];
	this.gameLevel = this.newGameMenu.addFolder('Choose Level for ' + namePlayer);
	this.gameLevel.add(this.scene, 'gameLevel', this.scene.gameLevels).name("Game Level");
	this.gameLevel.open();

	if(this.scene.state == "LEVELP2")
	{
		this.scene.enter = this.scene.enter[0];
		this.enterGame = this.newGameMenu.addFolder('Start the Game');
		this.enterGame.add(this.scene, 'enter', this.scene.enters).name("Start").onFinishChange(function(newValue) {
   			this.enter = newValue;	
		});;
		this.enterGame.open();
	}
};

MyInterface.prototype.showLoadFile = function(){
	this.loadFile = this.loadGameMenu.addFolder('Choose file');
	this.loadFile.open();
};

MyInterface.prototype.showSaveFile = function(){
	this.saveFile = this.saveGameMenu.addFolder('Choose file');
	this.saveFile.open();
};

// Treat player names /////////////////////////////////////////////

MyInterface.prototype.showNamePlayer = function(){
	
		this.nPlayer1 = this.newGameMenu.addFolder('Choose namePlayer1');
		this.nPlayer1.add(this.scene, 'namePlayer1').name("Name P1").onFinishChange(function(newValue) {
   		this.namePlayer1 = newValue;	
		});
		this.nPlayer1.open();

		this.scene.enter = this.scene.enter[0];
		this.enterGame = this.newGameMenu.addFolder('Start the Game');
		this.enterGame.add(this.scene, 'enter', this.scene.enters).name("Start").onFinishChange(function(newValue) {
   			this.enter = newValue;	
		});;
		this.enterGame.open();
};


MyInterface.prototype.showNamePlayers = function(){
	
		this.nPlayer1 = this.newGameMenu.addFolder('Choose namePlayer1');
		this.nPlayer1.add(this.scene, 'namePlayer1').name("Name P1").onFinishChange(function(newValue) {
   		this.namePlayer1 = newValue;	
        		
		});
		this.nPlayer1.open();
		
		this.nPlayer2 = this.newGameMenu.addFolder('Choose namePlayer2');
		this.nPlayer2.add(this.scene, 'namePlayer2').name("Name P2").onFinishChange(function(newValue) {
	   	this.namePlayer2 = newValue;	
		});
		this.nPlayer2.open();

		this.scene.enter = this.scene.enter[0];
		this.enterGame = this.newGameMenu.addFolder('Start the Game');
		this.enterGame.add(this.scene, 'enter', this.scene.enters).name("Start").onFinishChange(function(newValue) {
   			this.enter = newValue;	
		});;
		this.enterGame.open();
};