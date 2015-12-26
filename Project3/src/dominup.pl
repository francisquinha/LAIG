/* -*- Mode:Prolog; coding:utf-8; -*- */

/*********************/
/* distribute pieces */
/*********************/

:- abolish(piece/4).
:- dynamic piece/4.
/* piece(Number1, Number2, Player, Played). */
/* each piece has 2 numbers, 
   the player it belongs to (1 or 2) 
   and a toggle that tells if it has been played (0 if no, 1 if yes) */

/* random distribution of game pieces among players */
distributePieces(N1, N2, NI1, NI2) :- 
        (N1 >=  7 -> assert(piece(N1, N2, 1, 0)) ;                      /* player 1 always gets piece 7 │ 7 */
         (N2 > 7 -> (N21 is N1 + 1 , N11 is N1 + 1 ,                    /* recursively advance to next piece */
                     distributePieces(N11, N21, NI1, NI2)) ;            /* if x │ 7 has been done, do x+1 │ x+1 */
          (NI1 == 17 -> assert(piece(N1, N2, 2, 0)) ,                   /* if player 1 has 17 pieces all other */
                        NI21 is NI2 + 1 , N21 is N2 + 1 ,               /* pieces go to player 2, except 7 | 7 */
                        distributePieces(N1, N21, NI1, NI21) ;          /* as we saw above */
           (NI2 == 18 -> assert(piece(N1, N2, 1, 0)) ,                  /* if player 2 has 18 pieces all other */
                         NI11 is NI1 + 1 , N21 is N2 + 1 ,              /* pieces go to player 1 */
                         distributePieces(N1, N21, NI11, NI2) ;
            (maybeRandom -> (assert(piece(N1, N2, 1, 0)) ,              /* otherwise, maybe atribute this piece to player 1 */
                             NI11 is NI1 + 1 , N21 is N2 + 1 ,          /* and advance to the next piece */
                             distributePieces(N1, N21, NI11, NI2)) ;    /* using the recursive function */
             (assert(piece(N1, N2, 2, 0)) ,                             /* or maybe atribute this piece to player 2 */
              NI21 is NI2 + 1, N21 is N2 + 1 ,                          /* and advance to the next piece */
              distributePieces(N1, N21, NI1, NI21))))))).               /* using the recursive function */

/* fixed distribution of pieces used in test phase, no longer needed for game to run */
testDistribute :-
        assert(piece(0, 1, 1, 0)) ,
        assert(piece(0, 3, 1, 0)) , 
        assert(piece(0, 4, 1, 0)) , 
        assert(piece(0, 6, 1, 0)) , 
        assert(piece(1, 1, 1, 0)) , 
        assert(piece(1, 2, 1, 0)) , 
        assert(piece(1, 4, 1, 0)) , 
        assert(piece(1, 5, 1, 0)) , 
        assert(piece(1, 7, 1, 0)) , 
        assert(piece(2, 2, 1, 0)) , 
        assert(piece(2, 3, 1, 0)) , 
        assert(piece(2, 6, 1, 0)) , 
        assert(piece(3, 3, 1, 0)) , 
        assert(piece(3, 7, 1, 0)) , 
        assert(piece(4, 5, 1, 0)) , 
        assert(piece(5, 6, 1, 0)) , 
        assert(piece(6, 7, 1, 0)) ,
        assert(piece(7, 7, 1, 0)) ,
        assert(piece(0, 0, 2, 0)) ,
        assert(piece(0, 2, 2, 0)) , 
        assert(piece(0, 5, 2, 0)) , 
        assert(piece(0, 7, 2, 0)) , 
        assert(piece(1, 3, 2, 0)) , 
        assert(piece(1, 6, 2, 0)) , 
        assert(piece(2, 4, 2, 0)) , 
        assert(piece(2, 5, 2, 0)) , 
        assert(piece(2, 7, 2, 0)) , 
        assert(piece(3, 4, 2, 0)) , 
        assert(piece(3, 5, 2, 0)) , 
        assert(piece(3, 6, 2, 0)) , 
        assert(piece(4, 4, 2, 0)) , 
        assert(piece(4, 6, 2, 0)) , 
        assert(piece(4, 7, 2, 0)) , 
        assert(piece(5, 5, 2, 0)) , 
        assert(piece(5, 7, 2, 0)) , 
        assert(piece(6, 6, 2, 0)) .


/**************/
/* play piece */
/**************/

:- abolish(halfPiece/6).
:- dynamic halfPiece/6.
/* halfPiece(Play, Line, Column, Level, Number, Cardinal). */
/* each halPiece has a position in the board (line, column and level), 
   a number and the cardinal corresponding to its other half */

/* predicate used to obtain the position of the other half of a piece, 
   given the position and cardinal of one half */
getOtherHalf(X1, Y1, n, X2, Y2, s) :- X2 is X1 - 1, Y2 is Y1. 
getOtherHalf(X1, Y1, e, X2, Y2, w) :- X2 is X1 , Y2 is Y1 + 1. 
getOtherHalf(X1, Y1, s, X2, Y2, n) :- X2 is X1 + 1, Y2 is Y1. 
getOtherHalf(X1, Y1, w, X2, Y2, e) :- X2 is X1 , Y2 is Y1 - 1.

:- abolish(lastPlay/4).
:- dynamic lastPlay/4.
/* lastPlay(Number1, Number2, Order, Player). */
/* each lastPlay has the numbers of a piece played in the last player's turn, 
   the order it was played in and the player's number */

/* predicate used to get a players turn piece order */
getLastPlayOrder(I, 0) :- not(lastPlay(_, _, _, I)).    /* if there is no lastPlay from that player */
getLastPlayOrder(I, O) :-                               /* otherwise, the order is O if */
        lastPlay(_, _, O, I) ,                          /* there is a lastPlay of order O from that player */
        O1 is O + 1 , 
        not(lastPlay(_, _, O1, I)).                     /* and there is no lastPlay of order O + 1 from that player */

retractLastPlay(I) :- retractLastPlay(I, 1).
retractLastPlay(I, O) :- retract(lastPlay(_, _, O, I)) -> (O1 is O + 1 , retractLastPlay(I, O1)) ; !.
        
/* playPiece(Number1, Number2, Player, Line, Column, Cardinal). */
/* to play a piece we need its numbers, the player holding that piece 
   and the position for the smaller half of the piece (line, column and cardinal) */

/* predicate used to play a piece */
playPiece(N1, N2, I, X1, Y1, C1, L) :-                          /* L is output */
        checkPlay(N1, N2, I, X1, Y1, C1, X2, Y2, C2, L) ->      /* check if this play is valid */
        (L1 is L + 1 ,                                          /* the new level is 1 above the current level */
         getPlayNumber(LP) ,
         P is LP + 1 ,
         assert(halfPiece(P, X1, Y1, L1, N1, C1)) ,             /* create first halfPiece */
         assert(halfPiece(P, X2, Y2, L1, N2, C2)) ,             /* create second halfPiece */
         retract(piece(N1, N2, I, 0)) ,                         /* remove piece from player's hand */
         assert(piece(N1, N2, I, 1)) ,                          /* place piece back but marked as played */
         getLastPlayOrder(I, O) ,                               /* determine the order of play of the last piece */
         O1 is O + 1 ,                                          /* compute order of play of this piece */
         assert(lastPlay(N1, N2, O1, I))) ;                     /* add piece as played in the last turn by this player */
        fail.                                                   /* if checkPlay fails, fail and do nothing */

getPlayNumber(P) :- 
        halfPiece(P, _, _, _, _, _) ,
        P1 is P + 1 ,
        not(halfPiece(P1, _, _, _, _, _)).
        
/* predicate used to check if a play is valid */
checkPlay(N1, N2, I, X1, Y1, C1, X2, Y2, C2, L) :-              /* X2, Y2, C2 and L are output */
        getTopLevel(X1, Y1, L) ,                                /* find the current level of the position X1, Y1 */
        getOtherHalf(X1, Y1, C1, X2, Y2, C2) ,                  /* compute the position of the other half given X1, Y1 and C1 */
        checkInsideBoard(X1, Y1, X2, Y2) ,                      /* verify that the piece will be place inside the board */
        checkPlayerPiece(N1, N2, I) ,                           /* verify that the player holds the piece and it has not been played yet */
        checkLevelStable(L, X2, Y2) ,                           /* verify that the other half has the same level */
        (L == 0 ->                                              /* if the current level is 0 */
         checkNoClimbs(I) ,                                     /* verify that the player has no more climb moves */
         checkExpandOrthogonal(X1, Y1, C1, X2, Y2, C2) ;        /* and check that this expansion is orthogonal to another piece on the board */
         checkClimbNumbers(N1, X1, Y1, N2, X2, Y2, L)).         /* otherwise verify that the climb is on correct numbers */

/* predicate used to check if the piece is inside the board */
checkInsideBoard(X1, Y1, X2, Y2) :- 
        check1InsideBoard(X1) ,                                 /* simply check each coordinate */
        check1InsideBoard(Y1) , 
        check1InsideBoard(X2) , 
        check1InsideBoard(Y2).

/* predicate used to check if a given coordinate is inside the board */
check1InsideBoard(Z) :- Z < 1 -> fail ; (Z > 26 -> fail ; true).

/* predicate used to check if the piece belongs to the player and has not been played */
checkPlayerPiece(N1, N2, I) :- piece(N1, N2, I, 0).

/* predicate used to check if the other half has the same level */
checkLevelStable(L, X2, Y2) :- getTopLevel(X2, Y2, L).

/* predicate used to check if the numbers for a climb placement are correct */
checkClimbNumbers(N1, X1, Y1, N2, X2, Y2, L) :- halfPiece(_, X1, Y1, L, N1, _) , halfPiece(_, X2, Y2, L, N2, _).

/* predicate used to check if the expand placement is orthogonal to some piece on the board */
checkExpandOrthogonal(X1, Y1, C1, X2, Y2, C2) :- 
        checkHalfOrthogonal(X1, Y1, C1) ;                       /* succeeds if at least one half has an orthogonal piece */
        checkHalfOrthogonal(X2, Y2, C2).

/* predicate used to check if a piece half has an orthogonal on the board */
checkHalfOrthogonal(X, Y, C) :- 
        checkNorthOrthogonal(X, Y, C) ;                         /* succeeds if at least one cardinal has an orthogonal piece*/
        checkEastOrthogonal(X, Y, C) ; 
        checkSouthOrthogonal(X, Y, C) ; 
        checkWestOrthogonal(X, Y, C).

/* predicate used to check if a piece half has an orthogonal on the North */
checkNorthOrthogonal(X, Y, C) :-
        X1 is X - 1 ,                                           /* North line is this line minus 1 */
        (member(C, [e, w]) ->                                   /* if C is East or West */
         halfPiece(_, X1, Y, 1, _, n) ;                         /* North half piece must have cardinal North */
         (C == s ->                                             /* alternatively, if C is South */
          (halfPiece(_, X1, Y, 1, _, e) ;                       /* North half piece can have cardinal East */
           halfPiece(_, X1, Y, 1, _, w))                        /* or West */
         ; fail)).                                              /* in all other cases, fail */

/* predicate used to check if a piece half has an orthogonal on the East */
checkEastOrthogonal(X, Y, C) :-                                 /* very similar to North case */
        Y1 is Y + 1 , 
        (member(C, [s, n]) -> 
         halfPiece(_, X, Y1, 1, _, e) ;
         (C == w -> 
          (halfPiece(_, X, Y1, 1, _, n) ; 
           halfPiece(_, X, Y1, 1, _, s)) ; 
          fail)).

/* predicate used to check if a piece half has an orthogonal on the South */
checkSouthOrthogonal(X, Y, C) :-                                /* very similar to North case */
        X1 is X + 1 , 
        (member(C, [w, e]) -> 
         halfPiece(_, X1, Y, 1, _, s) ;
         (C == n -> 
          (halfPiece(_, X1, Y, 1, _, e) ; 
           halfPiece(_, X1, Y, 1, _, w)) ; 
          fail)).

/* predicate used to check if a piece half has an orthogonal on the West */
checkWestOrthogonal(X, Y, C) :-                                 /* very similar to North case */
        Y1 is Y - 1 , 
        (member(C, [n, s]) -> 
         halfPiece(_, X, Y1, 1, _, w) ;
         (C == e -> 
          (halfPiece(_, X, Y1, 1, _, n) ; 
           halfPiece(_, X, Y1, 1, _, s)) ; 
          fail)).

/* predicate used to check if a player has no more climb moves */
checkNoClimbs(I) :-                                             
        getClimbPlays(I, Plays) ,                               /* compute all climb plays for player */
        length(Plays, Number) ,                                 /* obtain the number of climb plays */
        Number == 0.                                            /* if it is 0, there are no more climb plays */

/* fixed plays to used in test phase, no longer needed for game to run */
testPlay :- playFirstPiece ,
        playPiece(2, 4, 2, 15, 14, n, _) ,
        playPiece(3, 3, 1, 16, 14, e, _) ,
        retractLastPlay(2, 1) ,
        playPiece(4, 7, 2, 14, 14, n, _) ,
        playPiece(0, 5, 2, 15, 16, w, _) ,
        retractLastPlay(1, 1) ,
        playPiece(2, 3, 1, 15, 14, s, _) ,
        playPiece(1, 1, 1, 13, 12, s, _) ,
        retractLastPlay(2, 1) ,
        playPiece(3, 5, 2, 16, 15, n, _) ,
        playPiece(2, 5, 2, 15, 14, e, _) ,
        playPiece(6, 6, 2, 15, 17, s, _) .

/* fixed game start with distribution and plays used in test phase, no longer needed for game to run */
test :- 
        testDistribute , 
        testPlay , 
        assert(player(1, 'Angie', 1)) , 
        assert(player(2, 'Nuno', 1)).


/***************/
/* game engine */
/***************/

/* predicate used to count the number of pieces of a given player */
numberPieces(I, NP, N1, N2, R) :-                               /* R is the result output, NP, N1 and N2 should be 0 */
        N1 > 7 -> R is NP ;                                     /* if N1 > 7, we have the result */
        (N2 > 7 ->                                              /* if N2 > 7, advance to the next piece */
         (N21 is N1 + 1 ,                                       /* which is N1 + 1 │ N1 + 1*/
          N11 is N1 + 1 , 
          numberPieces(I, NP, N11, N21, R)) ;                   /* continue recursively */
         (piece(N1, N2, I, 0) ->                                /* otherwise, check if the piece belongs to the player and has not been played */
          (NP1 is NP + 1 ,                                      /* if so, the number of pieces must be increased */
           N21 is N2 + 1,                                       /* we advance to the next piece */
           numberPieces(I, NP1, N1, N21, R)) ;                  /* and continue recursively */
          (N21 is N2 + 1 ,                                      /* if not, simply advance to the next piece */
           numberPieces(I, NP, N1, N21, R)))).                  /* and continue recursively, without incrementing the number of pieces */

/* predicate used to check if the game is over */
checkGameOver :-                                                /* the name is misleading, fails if game over, succeeds otherwise */
        numberPieces(1, 0, 0, 0, R1) ,                          /* get number of pieces of player 1 */
        (R1 == 0 ->                                             /* if player 1 has 0 pieces */
         (printGameOver(1), fail) ;                             /* player 1 has won, print that and fail */
         (numberPieces(2, 0, 0, 0, R2),                         /* otherwise, get number of pieces of player 2 */      
          (R2 == 0 ->                                           /* if player 2 has 0 pieces */   
           (printGameOver(2) , fail) ;                          /* player 2 has won, print that and fail */ 
           true))).                                             /* otherwise the game continues */

/* predicate used to play the first piece in the game */
playFirstPiece :-                                               /* the first piece is always 7 │ 7 and must be played in the middle of the board */
        assert(halfPiece(1, 13, 13, 1, 7, e)),                       
        assert(halfPiece(1, 13, 14, 1, 7, w)), 
        retract(piece(7, 7, 1, 0)) , 
        assert(piece(7, 7, 1, 1)) , 
        assert(lastPlay(7, 7, 1, 1)).

/* predicate used to play the game */
playGame :-                             
        distributePieces(0, 0, 0, 0) ,                          /* first distribute the pieces among the players */
        playFirstPiece ,                                        /* then play the first piece */
        assert(turn(2)) ,                                       /* the next player is player 2 */
        playTurn.                                               /* play the next turn */

/* predicate used to play a turn */
playTurn :-                                                     /* when the player is human, more than one recursive call is needed to play a full turn */
        checkGameOver ->                                        /* check if the game is not over and continue if it is not */
        (turn(I) ,                                              /* check whose turn it is */
         player(I, _, T) ,                                      /* obtain the type of player whose turn it is */
         (T == 1 ->                                             /* if player is human */
          (I1 is 3 - I ,
           printGame(I, I1) ,                                   /* print board and pieces */
           getMove(I, N1, N2, X1, Y1, C1) ,                     /* ask the player for the next move */
           (playPiece(N1, N2, I, X1, Y1, C1, L) ->              /* try to play the piece */
            (nextPlayer(I, L) ,                                 /* determine who is the next player (this player's turn may not be over) */
             playTurn) ;                                        /* recursively resume playing with whomever is next */
            (write('Invalid movement.') , getNewLine ,          /* if the move is not valid, say so */
             playTurn))) ;                                      /* and recursively resume with the same player */
          (T == 2 ->                                            /* if the player is the computer on easy mode */
           (I1 is 3 - I ,                                       /* obtain the number of the other player */
            printGame(I1, I1) , nl ,                            /* and print their board and pieces */
            player(I1, _, T1) ,                                 /* compute also their type */
            (T1 > 1 ->                                          /* if they are not human, then the game is computer vs computer */
             getNewLine ;                                       /* wait for the person running the game to press enter */
             (write('Computer thinking...') , sleep(1))) ,      /* if the other player is human, tell them the computer is thinking */
            playRandom(I) ,                                     /* in any case, compute a sequence of random computer movements */
            changeTurn(I) , playTurn) ;                         /* change player turn and resume playing recursively */
           (I1 is 3 - I ,                                       /* if the computer is on hard mode, obtain the number of the other player */                           
            printGame(I1, I1) , nl ,                            /* and print their board and pieces */                                
            player(I1, _, T1) ,                                 /* compute also their type */                                         
            (T1 > 1 ->                                          /* if they are not human, then the game is computer vs computer */    
             getNewLine ;                                       /* wait for the person running the game to press enter */             
             (write('Computer thinking...'))) ,                 /* if the other player is human, tell them the computer is thinking */
            playBest(I),                                        /* in any case, compute a sequence of greedy computer movements */    
            changeTurn(I) , playTurn)))) ; playAgain.           /* change player turn and resume playing recursively */               

/* predicate used to ask the human player for the next move */
getMove(I, N1, N2, X1, Y1, C1) :- 
        nl , getContinue ,                                      /* first check if the player wishes to continue playing or wants to save and exit */
        getPiece(I, N1, N2) ,                                   /* get the piece numbers */
        getX1(X1) ,                                             /* get the line */
        getY1(Y1) ,                                             /* get the column */
        getC1(C1).                                              /* get the orientation */

/* predicate used to check if the player wishes to continue playing or wants to save and exit */
getContinue :- 
        prompt(_, 'Continue - enter , Save and exit - s: ') ,   /* ask the question */
        getChar(C) ,                                            /* get the answer */
        (C == 's' -> save_game ; ! ).                           /* if answer is s, save and quit, otherwise continue playing */

getPiece(I, N1, N2) :-
        prompt(_, 'Piece (?-?): ') ,                            /* ask for piece numbers */
        getDigits(N1t, N2t) ,
        (piece(N1t, N2t, I, 0) ->
         (N1 is N1t , N2 is N2t) ;
         (write('You have no piece ') , 
          print(N1t) , write('-') , 
          print(N2t) , write('.') , nl ,
          getPiece(I, N1, N2))).

/* predicate used to obtain the first number of the piece */
getN1(I, N1) :- 
        prompt(_, 'Piece left number: ') ,                      /* ask for a number */
        getDigit(N1t) ,                                         /* get the single digit */
        (piece(N1t, _, I, 0) -> N1 is N1t ;                     /* if there is such a numbered piece, return the number */
         (write('You have no piece ') ,                         /* otherwise inform the player that there is */
          print(N1t) , write(' │ ? .') , nl ,                   /* no such piece */
          getN1(I, N1))).                                       /* and ask for a new number */

/* predicate used to obtain the second number of the piece */
getN2(I, N1, N2) :-                                             /* very similar to the one used to obtain the first number */
        prompt(_, 'Piece right number: ') , 
        getDigit(N2t) , 
        (piece(N1, N2t, I, 0) -> N2 is N2t ; 
         (write('You have no piece ') , 
          print(N1) , write(' │ ') , print(N2t) , write(' .') , nl , 
          getN2(I, N1, N2))). 

/* predicate used to obtain the line of the board */
getX1(X1) :- 
        prompt(_, 'Line for left number (1 - 26): ') ,          /* ask for the line */
        getDoubleDigit(X1t) ,                                   /* get possible double digit */
        (X1t < 1 ->                                             /* if it is below 1 */
         (write('Line number must be at least 1.') , nl ,       /* complain to the player */
          getX1(X1)) ;                                          /* and ask for a new number */
         (X1t > 26 ->                                           /* if if is above 26 */
          (write('Line number must be at most 26.') , nl ,      /* complain to the player */
           getX1(X1)) ;                                         /* and ask for a new number */
          X1 is X1t)).                                          /* otherwise return the number */

/* predicate used to obtain the column of the board */
getY1(Y1) :-                                                    /* very similar to the one used to obtain the line */
        prompt(_, 'Column for left number (1 - 26): ') , 
        getDoubleDigit(Y1t) , 
        (Y1t < 1 -> 
         (write('Column number must be at least 1.') , nl , 
          getY1(Y1)) ;
         (Y1t > 26 -> 
          (write('Column number must be at most 26.') , nl , 
           getY1(Y1)) ;
          Y1 is Y1t)).

/* predicate used to obtain the orientation of the piece */
getC1(C1) :- 
        prompt(_, 'Cardinal of right number relative to left number (n, e, s, w): ') , /* ask for the cardinal */
        getChar(C1t) ,                                          /* get the char */
        (member(C1t, [n, e, s, w]) -> copy_term(C1t, C1) ;      /* if it is valid, return it */
         (write('Cardinal must be one of: n, e, s, w.'), nl ,   /* otherwise complain */
          getC1(C1))).                                          /* and get a new one */

:- abolish(turn/1).
:- dynamic turn/1.
/* predicate turn is used to ensure the next turn is given to the right player */

/* predicate used to move the turn to the next player */
changeTurn(I) :- 
        I1 is 3 - I ,                                           /* if the current player is I, the next is 3 - I */
        retract(turn(I)) ,                                      /* player I is no longer playing */
        assert(turn(I1)) ,                                      /* now it's player's 3 - I turn */
        retractLastPlay(I1).                                    /* clear the new player's last turn */

/* predicate used to check if the turn of a human player has ended */
nextPlayer(I, L) :- 
        L == 0 ->                                               /* the turn ends after an expand movement */
        changeTurn(I) ; !.                                      /* that is, movement with level L = 0 */


/**************************/
/* artifical intelligence */
/**************************/

:- abolish(position/2).
:- dynamic position/2.
/* a position on the board with its line and column */

/* predicate used to compute all possible board positions */
getPositions(X, Y) :-                                           
        X > 26 -> ! ;                                           /* if the line is above 26, stop */
        (Y > 26 ->                                              /* if the column is above 26 */
         (Y1 is 1 , X1 is X + 1 ,                               /* move on to the first column of the next line */
          getPositions(X1, Y1)) ;                               /* and proceed recursively */
         (assert(position(X, Y)),                               /* otherwise, this is a valid position, add it to the database */
          Y1 is Y + 1,                                          /* and move on to the next cell */
          getPositions(X, Y1))).                                /* calling the function recursively */

/* add all valid positions to the database so that findall can find possible movements */
:- getPositions(1, 1).                                          

/* predicate used to check if a climb movement is valid */
/* this is very similar to checkPlay above, but only for climbs, and works with findall */
checkClimb(N1, N2, I, X1, Y1, C1) :-                            
        checkPlayerPiece(N1, N2, I) ,                           /* check if the piece belongs to the player and has not been played */
        getTopLevel(X1, Y1, L) ,                                /* obtain the current level of the position on the board */
        getOtherHalf(X1, Y1, C1, X2, Y2, _) ,                   /* obtain the position of the other half of the piece */
        checkInsideBoard(X1, Y1, X2, Y2) ,                      /* verify that the whole piece is inside the board */
        checkLevelStable(L, X2, Y2) ,                           /* verify that the level of both halfs is the same */
        checkClimbNumbers(N1, X1, Y1, N2, X2, Y2, L).           /* check that the numbers are correct for climbing */

/* predicate used to check if an expand movement is valid */
/* this is very similar to checkPlay above, but only for expand, and works with findall */
checkExpand(N1, N2, I, X1, Y1, C1) :- 
        checkPlayerPiece(N1, N2, I) ,                           /* check if the piece belongs to the player and has not been played */
        position(X1, Y1),                                       /* verify that X1, Y1 is a valid board position */
        getOtherHalf(X1, Y1, C1, X2, Y2, C2) ,                  /* obtain the position of the other half of the piece */ 
        checkInsideBoard(X1, Y1, X2, Y2) ,                      /* verify that the whole piece is inside the board */    
        checkLevelStable(0, X1, Y1),                            /* verify that the level of both halfs is the 0 */    
        checkLevelStable(0, X2, Y2) , 
        checkExpandOrthogonal(X1, Y1, C1, X2, Y2, C2).          /* check that there is some other piece on the board orthogonal to this one */

/* predicate used to obtain a list of all possible climb movements for a player */
getClimbPlays(I, Plays) :- 
        findall(play(N1, N2, I, X1, Y1, C1), checkClimb(N1, N2, I, X1, Y1, C1), Plays).

/* predicate used play a random climb movement */
randomClimbPlay(I) :- 
        getClimbPlays(I, Plays) , 
        random_member(play(N1, N2, I, X1, Y1, C1), Plays) , 
        playPiece(N1, N2, I, X1, Y1, C1, _).

/* predicate used to obtain a list of all possible expand movements for a player */
getExpandPlays(I, Plays) :- 
        findall(play(N1, N2, I, X1, Y1, C1), checkExpand(N1, N2, I, X1, Y1, C1), Plays).

/* predicate used play a random expand movement */
randomExpandPlay(I) :- 
        getExpandPlays(I, Plays) , 
        random_member(play(N1, N2, I, X1, Y1, C1), Plays) , 
        playPiece(N1, N2, I, X1, Y1, C1, _).

/* predicate used play a random turn */
playRandom(I) :- 
        randomClimbPlay(I) ->                                   /* while there are valid climbs */
        playRandom(I) ;                                         /* do random climbs */
        randomExpandPlay(I).                                    /* afterward do one expand */

/* predicate used to evaluate the current situation of the game for a given player */
evaluateSituation(I, R) :-                                      /* R is the result, bigger R means better for player I */
        getNumberPlays(I, Rme) ,                                /* compute the number of pieces player I can play */
        I1 is 3 - I ,                                           /* I1 is the other player */
        getNumberPlays(I1 , Ryou) ,                             /* compute the number of pieces the other player can play */
        R is Rme - Ryou.                                        /* the result is the difference */

/* predicate used to compute the maximum number of plays for a given player*/
getNumberPlays(I, R) :- 
        getClimbPlays(I, Plays),                                /* get list of all climbs */
        length(Plays, S) ,                                      /* compute maximum number of climbs */
        R is S + 1.                                             /* the result is the number of climbs plus 1, because there is always 1 expand */

/* predicate used to play a piece without checking it is valid */
playPieceNoCheck(N1, N2, I, X1, Y1, C1, L) :-                   /* very similar to playPiece, but faster */
        getOtherHalf(X1, Y1, C1, X2, Y2, C2) , 
        getTopLevel(X1, Y1, L) , L1 is L + 1 , 
        assert(halfPiece(0, X1, Y1, L1, N1, C1)) , 
        assert(halfPiece(0, X2, Y2, L1, N2, C2)) , 
        retract(piece(N1, N2, I, 0)) , 
        assert(piece(N1, N2, I, 1)).

/* predicate used to remove a piece from the board */
removePiece(N1, N2, I, X1, Y1, C1, L) :-                        /* does the opposite of playPieceNoCheck */
        getOtherHalf(X1, Y1, C1, X2, Y2, C2) , 
        getTopLevel(X1, Y1, L) , 
        retract(halfPiece(0, X1, Y1, L, N1, C1)) , 
        retract(halfPiece(0, X2, Y2, L, N2, C2)) , 
        assert(piece(N1, N2, I, 0)) , 
        retract(piece(N1, N2, I, 1)).

/* predicate used to evaluate how good a given climb is */
evaluateClimb(N1, N2, I, X1, Y1, C1, R) :-                      /* R is the result, bigger R means better climb */
        checkClimb(N1, N2, I, X1, Y1, C1) ,                     /* first check if the climb is valid */
        playPieceNoCheck(N1, N2, I, X1, Y1, C1, _) ,            /* then play it */
        evaluateSituation(I, R) ,                               /* then evaluate the current situation */
        removePiece(N1, N2, I, X1, Y1, C1, _).                  /* then remove the played piece */

/* predicate used to evaluate how good a given expand is */
evaluateExpand(N1, N2, I, X1, Y1, C1, R) :-                     /* very similar to evaluateClimb */
        checkExpand(N1, N2, I, X1, Y1, C1) , 
        playPieceNoCheck(N1, N2, I, X1, Y1, C1, _) , 
        evaluateSituation(I, R) , 
        removePiece(N1, N2, I, X1, Y1, C1, _).

/* predicate used to obtain a list of all climb plays evaluated */
evaluateClimbPlays(I, Plays) :- 
        findall(play(N1, N2, I, X1, Y1, C1, R), evaluateClimb(N1, N2, I, X1, Y1, C1, R), Plays).

/* predicate used to obtain a list of all expand plays evaluated */
evaluateExpandPlays(I, Plays) :- 
        findall(play(N1, N2, I, X1, Y1, C1, R), evaluateExpand(N1, N2, I, X1, Y1, C1, R), Plays).

/* predicate used to choose the best play from a list */
/* very similar to predicates used to choose maximum from a list */
bestPlay([], _) :- fail.                                        /* if the list is empty fail */
bestPlay([Play|Plays], MPlay) :-                                /* go from 2 arguments to 3 */
        bestPlay(Plays, Play, MPlay).
bestPlay([], play(N1, N2, I, X1, Y1, C1, R), play(N1, N2, I, X1, Y1, C1, R)). /* between empty list and one play, choose one play */
bestPlay([play(N11, N21, I1, X11, Y11, C11, R1)|Plays] , play(N12, N22, I2, X12, Y12, C12, R2) , play(MN1, MN2, MI, MX1, MY1, MC1, MR)) :- 
        (R1 > R2 ->                                                                                      /* check with play has bigger value */
         bestPlay(Plays, play(N11, N21, I1, X11, Y11, C11, R1), play(MN1, MN2, MI, MX1, MY1, MC1, MR)) ; /* proceed in the list with that play */
         bestPlay(Plays, play(N12, N22, I2, X12, Y12, C12, R2), play(MN1, MN2, MI, MX1, MY1, MC1, MR))).
         
checkMaximum(play(N1, N2, I, X1, Y1, C1, R), MR, Plays) :-
	member(play(N1, N2, I, X1, Y1, C1, R), Plays) , R >= MR.
         
bestPlays(Plays, MPlays) :-
	bestPlay(Plays, play(_, _, _, _, _, _, MR)) ,
	findall(play(N1, N2, I, X1, Y1, C1, R), checkMaximum(play(N1, N2, I, X1, Y1, C1, R), MR, Plays), MPlays).

/* predicate used to play one of the best climb plays available */
bestClimbPlay(I) :- 
        evaluateClimbPlays(I, Plays) , 
        bestPlays(Plays, MPlays) ,
        random_member(play(N1, N2, I, X1, Y1, C1, _), MPlays) , 
        playPiece(N1, N2, I, X1, Y1, C1, _).

/* predicate used to play one of the best expand plays available */
/* since there are usually many expand plays available, this is the slowest function taking a few seconds to finish */
bestExpandPlay(I) :- 
        evaluateExpandPlays(I, Plays) , 
        bestPlays(Plays, MPlays) ,
        random_member(play(N1, N2, I, X1, Y1, C1, _), MPlays) , 
        playPiece(N1, N2, I, X1, Y1, C1, _).

/* predicate used play a greedy turn, always choosing one of the best available plays */
playBest(I) :- bestClimbPlay(I) -> playBest(I) ; bestExpandPlay(I).
