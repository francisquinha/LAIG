/* -*- Mode:Prolog; coding:iso-8859-1; -*- */

:- dynamic player/3.

player(1, "Lisa", 1).
player(2, "Computer", 3).

:- dynamic piece/4.

piece(0, 0, 1, 0).
piece(0, 1, 1, 0).
piece(0, 2, 1, 0).
piece(0, 3, 1, 0).
piece(0, 5, 1, 0).
piece(0, 6, 1, 0).
piece(1, 1, 1, 0).
piece(1, 2, 1, 0).
piece(1, 3, 1, 0).
piece(1, 4, 1, 0).
piece(1, 5, 1, 0).
piece(2, 2, 1, 0).
piece(2, 3, 1, 0).
piece(2, 5, 1, 0).
piece(2, 6, 1, 0).
piece(2, 7, 1, 0).
piece(3, 3, 1, 0).
piece(7, 7, 1, 1).
piece(0, 4, 2, 0).
piece(0, 7, 2, 0).
piece(1, 6, 2, 0).
piece(1, 7, 2, 0).
piece(2, 4, 2, 0).
piece(3, 5, 2, 0).
piece(3, 6, 2, 0).
piece(3, 7, 2, 0).
piece(4, 4, 2, 0).
piece(4, 5, 2, 0).
piece(4, 6, 2, 0).
piece(4, 7, 2, 0).
piece(5, 5, 2, 0).
piece(5, 6, 2, 0).
piece(5, 7, 2, 0).
piece(6, 6, 2, 0).
piece(6, 7, 2, 0).
piece(3, 4, 2, 1).

:- dynamic halfPiece/6.

halfPiece(1, 13, 13, 1, 7, e).
halfPiece(1, 13, 14, 1, 7, w).
halfPiece(2, 12, 12, 1, 3, s).
halfPiece(2, 13, 12, 1, 4, n).

:- dynamic lastPlay/4.

lastPlay(3, 4, 1, 2).

:- dynamic turn/1.

turn(1).

