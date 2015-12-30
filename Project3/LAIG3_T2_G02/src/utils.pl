/* -*- Mode:Prolog; coding:utf-8; -*- */

/*************/
/* libraries */
/*************/

:- use_module(library(system)).
:- use_module(library(random)).


/****************/
/* useful stuff */
/****************/

even(N) :- 
        N rem 2 =:= 0.

/* predicate used to remove all characters up to a new line from the input */
getNewLine :- 
        get_code(T) , (T == 10 -> ! ; getNewLine).

/* predicate used to get a single char from the input */
/* does not require full dot at the end, 
   removes all other characters up to a new line,
   works also if user only presses enter */
getChar(C) :- 
        get_char(C) , char_code(C, Co) , (Co == 10 -> ! ; getNewLine).

/* predicate used to get a single algarism from the input */
/* does not require full dot at the end, 
   removes all other characters up to a new line,
   works also if user only presses enter
   but the number will be -38 */
getDigit(D) :- 
        get_code(Dt) , D is Dt - 48 , (Dt == 10 -> ! ; getNewLine).

/* predicate used to get a possible double algarism number from the input */
/* does not require full dot at the end, 
   removes all other characters up to a new line,
   works also if user only presses enter
   but the number will be -38 */
getDoubleDigit(D) :- 
        get_code(D1t) , 
        (D1t == 10 -> ! ; 
         (get_code(D2t) , 
          (D2t == 10 -> 
           (D is D1t - 48) ; 
           (getNewLine , 
            D is (D1t - 48) * 10 + D2t - 48)))).

getDigits(N1, N2) :-
        get_code(N1t) , 
        N1 is N1t - 48 , 
        (N1t == 10 -> N2 is -38 ; 
         (get_code(T) ,
          (T == 10 -> N2 is -38 ;
           (get_code(N2t) ,
            N2 is N2t - 48 ,
            (N2t == 10 -> ! ;
             getNewLine))))).

/* predicate used to get a list of chars from the input */
/* does not require full dot at the end, 
   removes the new line character,
   the result is placed on OutList,
   InList should be the empty list */
getCharList(InList, OutList) :- 
        get_char(C) , 
        char_code(C, Co) , 
        ( Co == 10 -> 
          OutList = InList ; 
          append(InList, [C], InList1), 
          getCharList(InList1, OutList)).

/* places the first N elemenst of the list L on the list P */
trim(L, N, P) :- 
        length(L, M) , 
        (N >= M -> 
         P = L ; 
         (X is M - N , 
          length(S, X) , 
          append(P, S, L))).

/* gets an atom with at most 8 characters from the input */
/* does not require full dot at the end, 
   removes the new line character */
get8String(S) :- 
        getCharList([], InList) , 
        trim(InList, 8, OutList) , 
        atom_chars(S, OutList).

/* gets an atom with any number of characters from the input */
/* does not require full dot at the end, 
   removes the new line character */
getString(S) :- 
        getCharList([], OutList) , 
        atom_chars(S, OutList).

/* clears the screen on unix consoles */        
cls :- write('\e[H\e[J\e[3J').


/**********/
/* random */
/**********/

/* suceeds with 1/2 probability, fails in other cases */
maybeRandom :- 
        random(1, 3, I) , 
        (I == 1 -> true ; fail). 
