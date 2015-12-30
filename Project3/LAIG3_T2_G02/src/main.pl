/* -*- Mode:Prolog; coding:utf-8; -*- */

/*************/
/* libraries */
/*************/

/*:- use_module(library(file_systems)).*/
 
:-consult(dominup).
:-consult(display).
:-consult(utils).


/***********/
/* startup */
/***********/

/* asks the user if they want to play a new game or load a saved game */
newOrLoad(Option) :- 
        prompt(_, '1 - New Game , 2 - Load Game: ') ,
        getDigit(Optiont) , 
        (Optiont < 1 -> (write('Must be 1 or 2.') , nl , newOrLoad(Option)) ; 
         (Optiont > 2 -> (write('Must be 1 or 2.') , nl , newOrLoad(Option)) ;
          Option is Optiont)).

:- abolish(player/3).
:- dynamic player/3.
/* player (Number, Name, Type) */
/* Number is 1 or 2, randomly decided at the start of a new game */
/* Name is chosen by player if human, otherwise is Computer or Compute1 or Compute2 */
/* Type is 1 if Human, 2 if Easy, 3 if Hard */
        
/* asks the user if about the type of game (human vs human, human vs computer, computer vs computer) */
computerOrHuman(Option) :- 
        prompt(_, '1 - Human vs Human, 2 - Human vs Computer, 3 - Computer vs Computer : ') ,
        getDigit(Optiont) , 
        (Optiont < 1 -> (write('Must be 1, 2 or 3.') , nl , computerOrHuman(Option)) ; 
         (Optiont > 3 -> (write('Must be 1, 2 or 2.') , nl , computerOrHuman(Option)) ;
          Option is Optiont)).

/* asks the user if the computer artificial intelligence should be easy (random) or hard (greedy) */
easyOrHard(Option) :- prompt(_, '1 - Easy, 2 - Hard : ') , 
        getDigit(Optiont) , (Optiont < 1 -> (write('Must be 1 or 2.') , nl , computerOrHuman(Option)) ; 
                             (Optiont > 2 -> (write('Must be 1 or 2.') , nl , computerOrHuman(Option)) ;
                              Option is Optiont)).

/* asks the user for human player names and randomly chooses player numbers, creating the player predicates */
playerNames(CHOption, EHOption1, EHOption2) :- 
        CHOption == 1 ->
        (prompt(_, 'Name of one player: ') , 
         get8String(X1) , 
         (X1 = '' -> X = 'Player 1' ; X = X1),  
         prompt(_, 'Name of the other player: ') , 
         get8String(Y1) , 
         (Y1 = '' -> Y = 'Player 2' ; Y = Y1) , 
         nl , write('Hello ') ,  write(X) , write(' and ' ) , write(Y) , write('!') , nl ,
         (maybeRandom -> 
          (assert(player(1, X, 1)) , assert(player(2, Y, 1))) ; 
          (assert(player(1, Y, 1)) , assert(player(2, X, 1))))) ;
        (CHOption == 2 ->
         (prompt(_, 'Player name: ') , 
          get8String(X1) , 
          (X1 = '' -> X = 'Player' ; X = X1) , 
          nl , write('Hello ') , write(X) , write('!') , nl , 
          Y = 'Computer' ,
          (maybeRandom -> 
           (assert(player(1, X, 1)) , assert(player(2, Y, EHOption1))) ; 
           (assert(player(1, Y, EHOption1)) , assert(player(2, X, 1))))) ;
         (assert(player(1, 'Compute1', EHOption1)) , 
          assert(player(2, 'Compute2', EHOption2)))).

/* saves the current state of the game and stops it */
save_game :- 
        prompt(_, 'File name: ') , 
        getString(S) , 
        atom_concat(S, '.pl', Spl) , 
	atom_concat('saves/', Spl, SSpl) ,
	open(SSpl, write, Save) , 
	set_output(Save) ,
	write('/* -*- Mode:Prolog; coding:iso-8859-1; -*- */') ,
	nl , nl ,
	listing(player/3) , 
	listing(piece/4) , 
	listing(halfPiece/6) , 
	listing(lastPlay/4) ,  
	listing(turn/1) , 
	close(Save) ,
        playAgain.

/* loads a game state from a file */
load_game :- 
        prompt(_, 'File name: ') , 
        getString(S) , 
        atom_concat(S, '.pl', Spl) , 
	atom_concat('saves/', Spl, SSpl) ,
        (exists_file(SSpl) -> 
         reconsult(SSpl) ; 
         (print(S) , write(' is not a valid save file') , nl , load_game)).
      
/* starts a game */
/* if the game has been loaded proceeds to play the next turn
   otherwise, asks the user for initial setup and then calls playGame*/
startGame :- player(1, _, _) -> playTurn ;
             (cls , nl , write('Welcome to Dominup!!!') , nl , nl , newOrLoad(NLOption) , 
              (NLOption == 1 -> 
               (computerOrHuman(CHOption) ,
                (CHOption == 1 -> (playerNames(CHOption, _, _)) ;
                 (CHOption == 2 -> (easyOrHard(EHOptiont) , EHOption is EHOptiont + 1 , playerNames(CHOption, EHOption, _)) ;
                  (write('Choose level for Computer 1.') , nl , easyOrHard(EHOptiont1) , EHOption1 is EHOptiont1 + 1 ,
                   write('Choose level for Computer 2.') , nl , easyOrHard(EHOptiont2) , EHOption2 is EHOptiont2 + 1 ,
                   playerNames(CHOption, EHOption1, EHOption2) , prompt(_, 'Enter to continue.'))))) , sleep(1) , playGame) ;
               load_game , startGame).

playAgain :- 
        prompt(_, 'Play again (y/n)? ') , 
        getChar(C) ,
        (C == 'y' -> reconsult('src/main.pl') ; halt).

