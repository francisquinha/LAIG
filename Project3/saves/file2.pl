/* -*- Mode:Prolog; coding:iso-8859-1; -*- */

:- dynamic player/3.

player(1, 'Angie', 1).
player(2, 'Nuno', 1).

:- dynamic piece/4.

piece(0, 0, 1, 0).
piece(0, 2, 1, 0).
piece(0, 4, 2, 0).
piece(0, 5, 1, 0).
piece(0, 6, 1, 0).
piece(1, 2, 1, 0).
piece(1, 4, 1, 0).
piece(1, 5, 1, 0).
piece(1, 6, 2, 0).
piece(2, 2, 2, 0).
piece(2, 3, 1, 0).
piece(2, 4, 1, 0).
piece(2, 5, 2, 0).
piece(2, 6, 2, 0).
piece(2, 7, 2, 0).
piece(3, 3, 2, 0).
piece(3, 4, 1, 0).
piece(3, 5, 2, 0).
piece(3, 6, 2, 0).
piece(3, 7, 1, 0).
piece(4, 4, 1, 0).
piece(4, 5, 2, 0).
piece(4, 6, 1, 0).
piece(4, 7, 2, 0).
piece(5, 5, 2, 0).
piece(5, 7, 2, 0).
piece(6, 6, 2, 0).
piece(6, 7, 2, 0).
piece(7, 7, 1, 1).
piece(0, 3, 2, 1).
piece(1, 1, 1, 1).
piece(0, 7, 2, 1).
piece(5, 6, 2, 1).
piece(1, 7, 1, 1).
piece(0, 1, 1, 1).
piece(1, 3, 1, 1).

:- dynamic halfPiece/6.

halfPiece(1, 13, 13, 1, 7, e).
halfPiece(1, 13, 14, 1, 7, w).
halfPiece(2, 14, 14, 1, 0, s).
halfPiece(2, 15, 14, 1, 3, n).
halfPiece(3, 14, 13, 1, 1, s).
halfPiece(3, 15, 13, 1, 1, n).
halfPiece(4, 14, 14, 2, 0, n).
halfPiece(4, 13, 14, 2, 7, s).
halfPiece(5, 16, 14, 1, 5, w).
halfPiece(5, 16, 13, 1, 6, e).
halfPiece(6, 14, 13, 2, 1, n).
halfPiece(6, 13, 13, 2, 7, s).
halfPiece(7, 14, 14, 3, 0, w).
halfPiece(7, 14, 13, 3, 1, e).
halfPiece(8, 15, 13, 2, 1, e).
halfPiece(8, 15, 14, 2, 3, w).

:- dynamic lastPlay/4.

lastPlay(0, 7, 1, 2).
lastPlay(5, 6, 2, 2).
lastPlay(1, 7, 1, 1).
lastPlay(0, 1, 2, 1).
lastPlay(1, 3, 3, 1).

:- dynamic turn/1.

turn(1).

