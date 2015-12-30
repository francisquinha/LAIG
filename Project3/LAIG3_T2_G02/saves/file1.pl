/* -*- Mode:Prolog; coding:iso-8859-1; -*- */

:- dynamic player/3.

player(1, 'Angie', 1).
player(2, 'Computer', 3).

:- dynamic piece/4.

piece(0, 0, 1, 0).
piece(1, 4, 1, 0).
piece(1, 6, 1, 0).
piece(2, 2, 1, 0).
piece(2, 4, 1, 0).
piece(2, 6, 1, 0).
piece(3, 3, 1, 0).
piece(3, 5, 1, 0).
piece(3, 7, 1, 0).
piece(4, 4, 1, 0).
piece(4, 6, 1, 0).
piece(5, 5, 1, 0).
piece(5, 7, 1, 0).
piece(7, 7, 1, 1).
piece(6, 6, 2, 1).
piece(0, 4, 1, 1).
piece(6, 7, 2, 1).
piece(0, 1, 2, 0).
piece(0, 2, 2, 0).
piece(0, 3, 2, 0).
piece(0, 5, 2, 0).
piece(1, 1, 2, 0).
piece(1, 2, 2, 0).
piece(1, 3, 2, 0).
piece(1, 7, 2, 0).
piece(2, 3, 2, 0).
piece(2, 5, 2, 0).
piece(2, 7, 2, 0).
piece(3, 4, 2, 0).
piece(3, 6, 2, 0).
piece(4, 5, 2, 0).
piece(5, 6, 2, 0).
piece(1, 5, 2, 1).
piece(0, 6, 1, 1).
piece(0, 7, 1, 1).
piece(4, 7, 1, 1).

:- dynamic halfPiece/6.

halfPiece(1, 13, 13, 1, 7, e).
halfPiece(1, 13, 14, 1, 7, w).
halfPiece(2, 13, 12, 1, 6, n).
halfPiece(2, 12, 12, 1, 6, s).
halfPiece(3, 12, 13, 1, 0, e).
halfPiece(3, 12, 14, 1, 4, w).
halfPiece(4, 13, 12, 2, 6, e).
halfPiece(4, 13, 13, 2, 7, w).
halfPiece(5, 13, 15, 1, 1, n).
halfPiece(5, 12, 15, 1, 5, s).
halfPiece(6, 12, 13, 2, 0, w).
halfPiece(6, 12, 12, 2, 6, e).
halfPiece(7, 12, 13, 3, 0, s).
halfPiece(7, 13, 13, 3, 7, n).
halfPiece(8, 12, 14, 2, 4, s).
halfPiece(8, 13, 14, 2, 7, n).

:- dynamic lastPlay/4.

lastPlay(6, 7, 1, 2).
lastPlay(1, 5, 2, 2).
lastPlay(0, 6, 1, 1).
lastPlay(0, 7, 2, 1).
lastPlay(4, 7, 3, 1).

:- dynamic turn/1.

turn(1).

