/* -*- Mode:Prolog; coding:utf-8; -*- */

/***************/
/* print board */
/***************/

/* predicate used to print the game board */
printBoard(I) :- 
        nl , printNumbers ,                             /* print the numbers on top of the board */
        write('         ') , printPlayerName(I) , nl ,     /* print last player name */ 
        printGridTop , nl ,                             /* print the grid top */
        printRows(I, 1) ,                               /* print the board rows */
        printNumbers , nl , nl , !.                     /* print the bottom numbers */

/* predicate used to print the game board */
printBoard :- 
        nl , printNumbers , nl ,                        /* print the numbers on top of the board */
        printGridTop , nl ,                             /* print the grid top */
        printRows(1) ,                                  /* print the board rows */
        printNumbers , nl , nl , !.                     /* print the bottom numbers */

/* predicate used to print the rows of the board */
printRows(_, 27) :- !.                                  /* stop after row 26 */
printRows(I, X) :-                                 
        printLeftNumbers(X) ,                           /* print number on the left of the row */
        printCells(X, 1) ,                              /* print row cells */
        printRightNumbers(X) ,                          /* print numbers on the right of the row */
        (even(X) -> 
         O is div(X, 2) ; 
         (Y is X + 1 ,
          O is div(Y, 2))) ,
        (even(X) ->                                     /* if the row number is even */
          printLastPlayNumbers(I, O) ; !) ,             /* print lastPlay piece numbers */
        nl , printGrid(X) ,                             /* print grid line */
        (even(X) ->                                     /* if the row number is even */
         printLastPlayBottom(I, O) ;                    /* print lastPlay piece bottom */
         printLastPlayTop(I, O)) ,                      /* else print lastPlay piece top */
        X1 is X + 1 , nl ,                              /* move on to next row */
        printRows(I, X1).                               /* calling the function recursively */

/* predicate used to print the rows of the board */
printRows(27) :- !.                                     /* stop after row 26 */
printRows(X) :-                                 
        printLeftNumbers(X) ,                           /* print number on the left of the row */
        printCells(X, 1) ,                              /* print row cells */
        printRightNumbers(X) , nl ,                     /* print numbers on the right of the row */
        printGrid(X) ,                                  /* print grid line */
        X1 is X + 1 , nl ,                              /* move on to next row */
        printRows(X1).                                  /* calling the function recursively */

/* predicate used to print the cells of a row of the board */
printCells(_,27) :- !.                                  /* stop after cell 26 */
printCells(X, Y) :-                             
        getTopLevel(X, Y, L) ,                          /* determine the current level of the cell */
        (L > 0 ->                                       /* if the current level is above 0 */
         (halfPiece(_, X, Y, L, N, C) ,                 /* determine what half piece is at that top level */
          print(N) ,                                    /* print the number of the half piece */
          printCardinal(C) ,                            /* print the cardinal of the half piece */
          print(L)) ;                                   /* print the level of the half piece */
         write('   ')) ,                                /* otherwise, if the level is 0, print 3 spaces */
        write('│') ,                                    /* in any case, print the cell grid divider */
        Y1 is Y + 1 ,                                   /* advance to the next cell on the same row */
        printCells(X, Y1).                              /* calling the function recursively */

/* predicate used to obtain the top level of a given position */
getTopLevel(X, Y, 0) :- 
        not(halfPiece(_, X, Y, _, _, _)).               /* if there is no half piece on that position the level is 0 */
getTopLevel(X, Y, L) :-                                 /* otherwise, the level is L if */
        halfPiece(_, X, Y, L, _, _) ,                   /* there is an half piece on that position on level L */
        L1 is L + 1 , 
        not(halfPiece(_, X, Y, L1, _, _)).              /* and there is no half piece on that position on level L + 1 */

/* predicate used to print the cardinal of an half piece in an appealing way */
printCardinal(n) :- write('↑').
printCardinal(e) :- write('→').
printCardinal(s) :- write('↓').
printCardinal(w) :- write('←').

/* predicate used to print the numbers on top of the board */
printNumbers :- 
        write('            1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26').

/* predicate used to print the numbers on the left of the board */
printLeftNumbers(X) :- 
        ((X < 10,                                       /* for numbers before 10, there is one extra space */
          write('         ') , 
          print(X) , 
          write('│')) ;                                 /* also print the board grid divider */
         (write('        ') , 
          print(X) , 
          write('│'))).

/* predicate used to print the numbers on the right of the board */
printRightNumbers(X) :- 
        ((X < 10 , 
          write(' '), 
          print(X)) ; 
         (print(X))).

/* predicate used to print the top of the board grid */
printGridTop :- write('          ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐').

/* predicate used to print the board grid */
printGrid(X) :-((X < 26 ,                               /* the last row is different */
                write('          ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤')) ;
                write('          └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘')).


/*******************/
/* print last play */
/*******************/

printLastPlayTop(I, O) :- 
        lastPlay(_, _, O, I) -> write('       ┌───┬───┐') ; !.
        

printLastPlayBottom(I, O) :- 
        lastPlay(_, _, O, I) -> write('       └───┴───┘') ; !.

printLastPlayNumbers(I, O) :- 
        lastPlay(N1, N2, O, I) -> 
        (write('     │ ') ,                             /* print left border */
         print(N1),                                     /* print left number */
         write(' │ ') ,                                 /* print center divider */
         print(N2) ,                                    /* print right number */
         write(' │')) ; !.                              /* print right border */


/****************/
/* print player */
/****************/

/* predicate used to print N spaces */
printSpaces(N) :- 
        N == 0 -> ! ;                                   /* when N = 0, stop */
        (write(' ') ,                                   /* otherwise write a space */
         N1 is N - 1 ,                                  /* decrease N */
         printSpaces(N1)).                              /* and repeat */

/* predicate used to print a player's name  taking exactly 9 characters */
printPlayerName(I) :-                                   
        player(I, S, _) ,                               /* find the player name S, S has at most 8 characters */
        write(S) ,                                      /* print the player name */
        atom_length(S, N) ,                             /* determine the name's length */
        M is 9 - N ,                                    /* M is how many characters are missing to 9 */
        printSpaces(M).                                 /* print M spaces */

/* predicate used to print a player's name and pieces, with starting spaces */
printPlayer(I) :- write('         ') , printPieces(I, 0, 0, 0, 0, 0, 0, 0, 0).

/* predicate used to print a player's name and pieces */
/* this is a somewhat complex function and we do not present step by step comments.
   alternatively, here is the idea:
   - the pieces are displayed in two rows;
   - each piece has top, numbers and bottom;
   - so each piece row is in fact 3 rows: top, numbers and bottom;
   - to know what to print in each moment, we keep track of the current row R;
   - if R is 0 or 3, we are printing tops, for 1 and 4 we print numbers and the others are bottoms;
   - row 1 also has the player name;
   - we also need to keep track of the current piece numbers N1 and N2;
   - and we need to do it for all three aspects, top, number and bottom;
   - so we have N1T, N2T, N1N, N2N, N1B, N2B;
   - if a piece has already been played, we print spaces in its place;
   - this way, the pieces stay in the same place from beggining to end;
   - to determine if we should change row, we check if the counter C has reached 9;
   - because each row has 9 pieces;
   - we use specific predicates to print tops, numbers and bottoms */
printPieces(I, C, R, N1T, N2T, N1N, N2N, N1B, N2B) :- 
        (C == 9 -> (nl , (R == 1 -> printPlayerName(I) ; write('         ')) , 
                    C1 is 0 , R1 is R + 1 , printPieces(I, C1, R1, N1T, N2T, N1N, N2N, N1B, N2B)) ; 
         ((R == 0 -> (N1T > 7 -> ! ; 
                      (N2T > 7 -> (N2T1 is N1T + 1 , N1T1 is N1T + 1 , printPieces(I, C, R, N1T1, N2T1, N1N, N2N, N1B, N2B)) ; 
                       ((piece(N1T, N2T, I, P) -> C1 is C + 1 , printPieceTop(P) ; C1 is C), 
                        N2T1 is N2T + 1 , printPieces(I, C1, R, N1T, N2T1, N1N, N2N, N1B, N2B)))) ; 
           ((R == 1 -> (N1N > 7 -> ! ; 
                        (N2N > 7 -> (N2N1 is N1N + 1 , N1N1 is N1N + 1 , printPieces(I, C, R, N1T, N2T, N1N1, N2N1, N1B, N2B)) ; 
                         ((piece(N1N, N2N, I, P) -> C1 is C + 1 , printPieceNumber(N1N, N2N, P) ; C1 is C), 
                          N2N1 is N2N + 1 , printPieces(I, C1, R, N1T, N2T, N1N, N2N1, N1B, N2B)))) ;
             ((R == 2 -> (N1B > 7 -> ! ; 
                          (N2B > 7 -> (N2B1 is N1B + 1 , N1B1 is N1B + 1 , printPieces(I, C, R, N1T, N2T, N1N, N2N, N1B1, N2B1)) ; 
                           ((piece(N1B, N2B, I, P) -> C1 is C + 1 , printPieceBottom(P) ; C1 is C), 
                            N2B1 is N2B + 1 , printPieces(I, C1, R, N1T, N2T, N1N, N2N, N1B, N2B1)))) ;
               ((R == 3 -> (N1T > 7 -> ! ; 
                            (N2T > 7 -> (N2T1 is N1T + 1 , N1T1 is N1T + 1 , printPieces(I, C, R, N1T1, N2T1, N1N, N2N, N1B, N2B)) ; 
                             ((piece(N1T, N2T, I, P) -> C1 is C + 1 , printPieceTop(P) ; C1 is C), 
                              N2T1 is N2T + 1 , printPieces(I, C1, R, N1T, N2T1, N1N, N2N, N1B, N2B)))) ; 
                 ((R == 4 -> (N1N > 7 -> ! ; 
                              (N2N > 7 -> (N2N1 is N1N + 1 , N1N1 is N1N + 1 , printPieces(I, C, R, N1T, N2T, N1N1, N2N1, N1B, N2B)) ; 
                               ((piece(N1N, N2N, I, P) -> C1 is C + 1 , printPieceNumber(N1N, N2N, P) ; C1 is C), 
                                N2N1 is N2N + 1 , printPieces(I, C1, R, N1T, N2T, N1N, N2N1, N1B, N2B)))) ;
                   ((R == 5 -> (N1B > 7 -> ! ; 
                                (N2B > 7 -> (N2B1 is N1B + 1 , N1B1 is N1B + 1 , printPieces(I, C, R, N1T, N2T, N1N, N2N, N1B1, N2B1)) ; 
                                 ((piece(N1B, N2B, I, P) -> C1 is C + 1 , printPieceBottom(P) ; C1 is C), 
                                  N2B1 is N2B + 1 , printPieces(I, C1, R, N1T, N2T, N1N, N2N, N1B, N2B1)))) ; 
                     !))))))))))))).

/* predicate used to print a piece's top */
printPieceTop(P) :- 
        P == 0 ->                                       /* if the piece has not been played */
        write(' ┌───┬───┐') ;                           /* print top */
        write('          ').                            /* otherwise print spaces */

/* predicate used to print a piece's numbers */
printPieceNumber(N1, N2, P) :-                          
        P == 0 ->                                       /* if the piece has not been played */
        (write(' │ ') ,                                 /* print left border */
         print(N1),                                     /* print left number */
         write(' │ ') ,                                 /* print center divider */
         print(N2) ,                                    /* print right number */
         write(' │')) ;                                 /* print right border */
        write('          ').                            /* otherwise print spaces */

/* predicate used to print a piece's bottom */
printPieceBottom(P) :-                                  /* very similar to the printPieceTop */
        P == 0 -> 
        write(' └───┴───┘') ; 
        write('          ').


/**************/
/* print game */
/**************/

/* predicate used to print the current board and player pieces */
printGame(I1, I2) :- 
        cls , printBoard(I2) , printPlayer(I1).

/* predicate used to print the board and the result at the end of the game */
printGameOver(I) :- 
        cls , printBoard(I) , 
        write('Game Over: ') , player(I, S, _) , print(S) , write(' wins!') , 
        nl , nl , sleep(1).

