/* -*- Mode:Prolog; coding:iso-8859-1; -*- */

:- dynamic player/3.

player(1, 'Computer', 2).
player(2, 'Nuno', 1).

:- dynamic piece/4.

piece(0, 0, 1, 0).
piece(0, 1, 1, 0).
piece(0, 2, 1, 0).
piece(0, 5, 2, 0).
piece(1, 2, 1, 0).
piece(1, 5, 2, 0).
piece(2, 2, 1, 0).
piece(2, 3, 2, 0).
piece(2, 5, 2, 0).
piece(2, 6, 2, 0).
piece(2, 7, 1, 0).
piece(3, 4, 2, 0).
piece(3, 5, 1, 0).
piece(3, 6, 1, 0).
piece(4, 5, 2, 0).
piece(4, 6, 1, 0).
piece(5, 5, 2, 0).
piece(5, 6, 1, 0).
piece(5, 7, 1, 0).
piece(6, 6, 1, 0).
piece(6, 7, 1, 0).
piece(7, 7, 1, 1).
piece(0, 6, 2, 1).
piece(3, 7, 1, 1).
piece(0, 7, 2, 1).
piece(1, 4, 2, 1).
piece(3, 3, 1, 1).
piece(4, 7, 2, 1).
piece(0, 4, 2, 1).
piece(1, 6, 2, 1).
piece(1, 1, 2, 1).
piece(0, 3, 1, 1).
piece(1, 3, 2, 1).
piece(1, 7, 2, 1).
piece(2, 4, 2, 1).
piece(4, 4, 1, 1).

:- dynamic halfPiece/6.

halfPiece(1, 13, 13, 1, 7, e).
halfPiece(1, 13, 14, 1, 7, w).
halfPiece(2, 14, 14, 1, 0, s).
halfPiece(2, 15, 14, 1, 6, n).
halfPiece(3, 11, 13, 1, 3, s).
halfPiece(3, 12, 13, 1, 7, n).
halfPiece(4, 14, 14, 2, 0, n).
halfPiece(4, 13, 14, 2, 7, s).
halfPiece(5, 15, 13, 1, 1, n).
halfPiece(5, 14, 13, 1, 4, s).
halfPiece(6, 14, 16, 1, 3, w).
halfPiece(6, 14, 15, 1, 3, e).
halfPiece(7, 14, 13, 2, 4, n).
halfPiece(7, 13, 13, 2, 7, s).
halfPiece(8, 14, 14, 3, 0, w).
halfPiece(8, 14, 13, 3, 4, e).
halfPiece(9, 15, 13, 2, 1, e).
halfPiece(9, 15, 14, 2, 6, w).
halfPiece(10, 11, 14, 1, 1, s).
halfPiece(10, 12, 14, 1, 1, n).
halfPiece(11, 16, 13, 1, 0, e).
halfPiece(11, 16, 14, 1, 3, w).
halfPiece(12, 11, 14, 2, 1, w).
halfPiece(12, 11, 13, 2, 3, e).
halfPiece(13, 12, 14, 2, 1, w).
halfPiece(13, 12, 13, 2, 7, e).
halfPiece(14, 15, 15, 1, 2, e).
halfPiece(14, 15, 16, 1, 4, w).
halfPiece(15, 16, 12, 1, 4, s).
halfPiece(15, 17, 12, 1, 4, n).

:- dynamic lastPlay/4.

lastPlay(4, 4, 1, 1).

:- dynamic turn/1.

turn(2).

