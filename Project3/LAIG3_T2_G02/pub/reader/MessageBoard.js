/**
 *
 */
function MessageBoard(scene, deltaX, deltaY) {
    CGFobject.call(this,scene);

    this.deltaX = deltaX;
    this.deltaY = deltaY;

    this.appearance = new CGFappearance(this.scene);
    this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.appearance.setShininess(120);

    // font texture: 16 x 16 characters
    // http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
    this.fontTexture = new CGFtexture(this.scene, "textures/oolite-font.png");
    this.appearance.setTexture(this.fontTexture);

    // plane where texture character will be rendered
    this.plane= new Board(this.scene);

    // instatiate text shader
    this.textShader=new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");

    // set number of rows and columns in font texture
    this.textShader.setUniformsValues({'dims': [16, 16]});

    this.text = 'Dominup Game';
    this.result1 = undefined;
    this.result2 = undefined;
};

MessageBoard.prototype = Object.create(CGFobject.prototype);

MessageBoard.prototype.constructor=MessageBoard;

MessageBoard.prototype.getLocation = function (letter) {
    var line;
    var column;

   if(letter == '-'){
        line = 2;
        column = 13;
    }else if(letter == ':'){
        line = 3;
        column = 10;
    }else if(letter >= '0' && letter <= '9'){
        line = 3;
        column = parseInt(letter);
    }else if(letter >= 'A' && letter <= 'O'){
        line = 4;
        column = 1 + letter.charCodeAt(0) - 'A'.charCodeAt(0);
    }else if(letter >= 'P' && letter <= 'Z'){
        line = 5;
        column = letter.charCodeAt(0) - 'P'.charCodeAt(0);
    }else if(letter >= 'a' && letter <= 'o'){
        line = 6;
        column = 1 + letter.charCodeAt(0) - 'a'.charCodeAt(0);
    }else if(letter >= 'p' && letter <= 'z'){
        line = 7;
        column = letter.charCodeAt(0) - 'p'.charCodeAt(0);
    }else{
        line = 2;
        column = 0;
    }

    return [column, line];
};

MessageBoard.prototype.showString = function (text) {

    this.scene.pushMatrix();

    for(var i = 0 ; i < text.length ; i++){

      this.scene.activeShader.setUniformsValues({'charCoords': this.getLocation(text[i])});
      this.plane.display();

      this.scene.translate(0.8,0,0);
    }

    this.scene.popMatrix();
};

MessageBoard.prototype.display = function () {
    // activate shader for rendering text characters
    this.scene.setActiveShaderSimple(this.textShader);

    // activate texture containing the font
    this.appearance.apply();

    this.scene.pushMatrix();

        if(this.scene.state == 'PLAY'){
            this.showString(this.text);
            this.scene.translate(2,-1,0);
            if (this.scene.turn != undefined) {
                var playerTurn = 'player' + this.scene.turn;
                this.showString(this.scene.players[playerTurn].name);    
            }
        }
        else if(this.scene.state == 'OVER'){
            var winner = 'player' + this.scene.gameOver;
            this.showString('Congratulations ')
            this.scene.translate(2,-1,0);
            this.showString(this.scene.players[winner].name);
        }
        else if(this.scene.state == 'DONE'){
            this.showString('Game Saved ')
        }
        else if(this.scene.state == 'REVIEW'){

        }

    this.scene.popMatrix();

    this.scene.setActiveShaderSimple(this.scene.defaultShader);
};
