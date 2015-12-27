
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

	// Game settings
	this.gameSettings = this.mainMenu.addFolder("Game Configurations");
	this.gameSettings.add(this.scene, 'timeout', 0, 180).step(5).name("Timeout");
	this.gameEnvironment = this.gameSettings.addFolder("Game Scenes");
	this.gameEnvironment.add(this.scene, 'gameEnvironment', this.scene.gameEnvironments).name("Game Environment");
	this.gameLookFolder = this.gameSettings.addFolder("Global Appearance");
	this.gameLookFolder.add(this.scene, 'gameLook', this.scene.gameLooks).name("Game Look");
};

MyInterface.prototype.newGame = function() {
	
	if(this.gameMenu != undefined){
		this.scene.state = 'GAME_TYPE';
		this.gameMenu.destroy();
	}

	this.scene.gameType = this.scene.gameTypes[0];
		
	//TODO Avoid additional gui new games
	
	// Additional Gui to select game type 
	this.newGameMenu = new dat.GUI();
	this.newGameFolder = this.newGameMenu.addFolder("Start New Game");
	this.newGameFolder.add(this.scene, 'gameType', this.scene.gameTypes).name("Game Type");
	this.newGameFolder.open();
	
	/*if(this.scene.gameType == this.scene.gameTypes[1]){
		this.requestNamePlayer(2);
	}
	else if(this.scene.gameType == this.scene.gameTypes[2]){
		this.requestNamePlayer(1);
	}
	*/
};

MyInterface.prototype.loadGame = function() {
	
	if(this.gameMenu != undefined){
		this.scene.state = 'LOAD_GAME';
		this.gameMenu.destroy();
	}

	//TODO Avoid additional gui load games
	
	this.newGameMenu = new dat.GUI();
	this.newGameFolder = this.newGameMenu.addFolder("Load Game");
	this.newGameFolder.add(this.scene, 'loadFile', this.scene.loadFiles).name("Load File");
	this.newGameFolder.open();
	this.scene.loadGame();
	
	/*if(this.scene.gameType == this.scene.gameTypes[1]){
		this.requestNamePlayer(2);
	}
	else if(this.scene.gameType == this.scene.gameTypes[2]){
		this.requestNamePlayer(1);
	}
	*/
};

// Treat player names /////////////////////////////////////////////

var FizzyText = function() {
  this.namePlayer1 = 'namePlayer1'; 
  this.namePlayer2 = 'namePlayer2';
};

MyInterface.prototype.requestNamePlayer = function(numberOfPlayers) {

	var text = new FizzyText();

	this.newGameFolder.add(text, 'namePlayer1');
	if(numberOfPlayers == 2)
		this.newGameFolder.add(text, 'namePlayer2');
};

/////////////////////////////////////////////////////////////////////

MyInterface.prototype.createGameMenu = function() {
	this.gameMenu = new dat.GUI();

	this.gameOptions = this.gameMenu.addFolder("Game menu");
	this.gameOptions.add(this.scene, 'pauseGame').name("Pause Game");
	this.gameOptions.add(this.scene, 'undoLastMove').name("Back");
	this.gameOptions.add(this.scene, 'cameraPosition', this.scene.cameraPositions).name("Change Camera");
	this.gameOptions.add(this.scene, 'reviewGame').name("Game Movie");
	this.gameOptions.add(this.scene, 'saveGame').name("Save Game");

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
	this.gameMenu.destroy();
};

MyInterface.prototype.hideReviewMenu = function() {
	this.reviewMenu.destroy();
};

MyInterface.prototype.hideNewGameMenu = function() {
	this.newGameMenu.destroy();
};

MyInterface.prototype.showLevelPlayer = function(namePlayer){
	this.scene.gameLevel = this.scene.gameLevels[0];
	this.gameLevel = this.newGameMenu.addFolder('Choose Level for ' + namePlayer);
	this.gameLevel.add(this.scene, 'gameLevel', this.scene.gameLevels).name("Game Level");
	this.gameLevel.open();
};

MyInterface.prototype.showLoadFile = function(){
	this.loadFile = this.loadGameMenu.addFolder('Choose file');
	this.loadFile.open();
};