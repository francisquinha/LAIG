:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_path)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_server_files)).

:- use_module(library(lists)).

:- http_handler(root(game), prepReplyStringToJSON, []).                 % Predicate to handle requests on server/game (for Prolog Game Logic)
:- http_handler(pub(.), serve_files_in_directory(pub), [prefix]).	% Serve files in /pub as requested (for WebGL Game Interface)
http:location(pub, root(pub), []).					% Location of /pub alias on server
user:file_search_path(document_root, '.').				% Absolute location of HTTP server document root
user:file_search_path(pub, document_root(pub)).				% location of /pub in relation to document root

server(Port) :- http_server(http_dispatch, [port(Port)]).		% Start server on port Port

%Receive Request as String via POST
prepReplyStringToJSON(Request) :- 
        member(method(post), Request), !,		                % if POST
        http_read_data(Request, Data, []),				% Retrieve POST Data
        processString(Data, Reply),				        % Call processing predicate
        format('Content-type: application/json~n~n'),		        % Reply will be JSON
        formatAsJSON(Reply).					        % Send Reply as JSON

prepReplyStringToJSON(_Request) :-					% Fallback for non-POST Requests
        format('Content-type: text/plain~n~n'),			        % Start preparing reply - reply type
        write('Can only handle POST Requests'),			        % Standard Reply
        format('~n').							% End Reply

formatAsJSON(Reply):-
        write('{'),						        % Start JSON Object
        Fields = [player, distribution, board, gameover, message],      % Response Field Names
        writeJSON(Fields, Reply).				        % Format content as JSON 
		
writeJSON([Prop], [Val]):-
	write('"'), write(Prop),
	write('":"'), write(Val), write('"}').				% Last element
writeJSON([Prop|PT], [Val|VT]):-
	write('"'), write(Prop),
	write('":"'), write(Val), write('", '),				% Separator for next element
	writeJSON(PT, VT).

processString([_Par=Val], R):-
        term_string(List, Val),						% Convert Parameter String to Prolog List
        R = [_P, _D, _B, _G, _M],					% Variables for Response
        append(List, R, ListR),						% Add extra Vars to Request
        Term =.. ListR,							% Create Term from ListR
        Term.								% Call the Term

%---------------------------------------------
:- consult('src/main.pl').

:- abolish(loadFile/1).
:- dynamic loadFile/1.

:- abolish(newLoad/1).
:- dynamic(newLoad/1).

setupGameHTTP(NewLoad, ComputerHuman, LoadFile, Name1, Name2, EasyHard1, EasyHard2, Player, Distribution, Board, GameOver, Message) :-
        (NewLoad == 0 ->
         ((ComputerHuman == 0 ->
           (maybeRandom -> 
            (assert(player(1, Name1, 1)) , assert(player(2, Name2, 1))) ; 
            (assert(player(1, Name2, 1)) , assert(player(2, Name1, 1)))) ;
           (ComputerHuman == 1 ->
            (maybeRandom -> 
             (assert(player(1, Name1, 1)) , assert(player(2, Name2, EasyHard2))) ; 
             (assert(player(1, Name2, EasyHard2)) , assert(player(2, Name1, 1)))) ;
            (maybeRandom -> 
             (assert(player(1, Name1, EasyHard1)) , assert(player(2, Name2, EasyHard2))) ; 
             (assert(player(1, Name2, EasyHard2)) , assert(player(2, Name1, EasyHard1))))))) ;
         assert(loadFile(LoadFile))) ,
        assert(newLoad(NewLoad)) ,
        Player = 0 ,
        Distribution = [] ,
        Board = [] ,
        GameOver = 0 ,
        Message = "OK". 

startGameHTTP(Player, Distribution, Board, GameOver, Message) :-
        newLoad(NewLoad) ,
        (NewLoad == 0 ->
         playGameHTTP ;
         (loadFile(LoadFile),
          reconsult(LoadFile))) ,
        turn(Player) ,
        getDistribution(Distribution) ,
        getBoard(Board) ,
        getGameOver(GameOver) ,
        player(1, Name1, _) ,
        player(2, Name2, _) ,
        atom_concat('1 - ', Name1, HalfMessage) , 
        atom_concat(HalfMessage, ' / 2 - ', AlmostMessage) , 
        atom_concat(AlmostMessage, Name2, Message).

setupStartGameHTTP(NewLoad, ComputerHuman, LoadFile, Name1, Name2, EasyHard1, EasyHard2, Player, Distribution, Board, GameOver, Message) :-
        reset ,
        (NewLoad == 0 ->
         ((ComputerHuman == 0 ->
           (maybeRandom -> 
            (assert(player(1, Name1, 1)) , assert(player(2, Name2, 1))) ; 
            (assert(player(1, Name2, 1)) , assert(player(2, Name1, 1)))) ;
           (ComputerHuman == 1 ->
            (maybeRandom -> 
             (assert(player(1, Name1, 1)) , assert(player(2, Name2, EasyHard2))) ; 
             (assert(player(1, Name2, EasyHard2)) , assert(player(2, Name1, 1)))) ;
            (maybeRandom -> 
             (assert(player(1, Name1, EasyHard1)) , assert(player(2, Name2, EasyHard2))) ; 
             (assert(player(1, Name2, EasyHard2)) , assert(player(2, Name1, EasyHard1)))))) ,
          playGameHTTP) ;
         reconsult(LoadFile)) ,
        turn(Player) ,
        getDistribution(Distribution) ,
        getBoard(Board) ,
        getGameOver(GameOver) ,
        player(1, PName1, Type1) ,
        player(2, PName2, Type2) ,
        atom_concat('1 - ', PName1, Message1) ,
        atom_concat(Message1, ' - ', Message2) ,
        atom_concat(Message2, Type1, Message3) ,
        atom_concat(Message3, ' / 2 - ', Message4) ,
        atom_concat(Message4, PName2, Message5) ,
        atom_concat(Message5, ' - ', Message6) ,
        atom_concat(Message6, Type2, Message).

saveHTTP(SaveFile, Player, Distribution, Board, GameOver, Message) :-
        atom_concat(SaveFile, '.pl', Spl) , 
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
        reset ,
        Player = 0 ,
        Distribution = [] ,
        Board = [] ,
        GameOver = 0 ,
        Message = "OK".

reset :-
        abolish(loadFile/1) ,
        dynamic(loadFile/1) ,
        abolish(newLoad/1) ,
        dynamic(newLoad/1) ,
        abolish(player/3) ,
        dynamic(player/3) ,
        abolish(piece/4) ,
        dynamic(piece/4) ,
        abolish(halfPiece/6) ,
        dynamic(halfPiece/6) ,
        abolish(lastPlay/4) ,
        dynamic(lastPlay/4) ,
        abolish(turn/1) ,
        dynamic(turn/1) ,
        abolish(position/2) ,
        dynamic(position/2).

playGameHTTP :-                             
        distributePieces(0, 0, 0, 0) ,
        playFirstPiece ,
        assert(turn(2)).

getDistribution(Distribution) :-
        getDistribution(Distribution, [], 0, 0).
/* piece(Number1, Number2, Player, Played). */
getDistribution(Distribution, List, Number1, Number2) :-
        Number1 > 7 -> Distribution = List ;
        (Number2 > 7 ->
         (Number11 is Number1 + 1 ,
          getDistribution(Distribution, List, Number11, Number11)) ;
         (Number21 is Number2 + 1 ,
          (piece(Number1, Number2, 1, _) ->
           (append(List, [1], List1) ,
            getDistribution(Distribution, List1, Number1, Number21)) ;
           (append(List, [2], List1) ,
            getDistribution(Distribution, List1, Number1, Number21))))).
            
getBoard(Board) :-
        collectPlays(1, Board).

collectPlays(Play, Plays) :- 
        findall([PlayNumber, Row, Column, Level, Number, Cardinal], 
                checkPlayNumber(PlayNumber, Row, Column, Level, Number, Cardinal, Play), 
                Plays).

/* halfPiece(Play, Row, Column, Level, Number, Cardinal). */
checkPlayNumber(PlayNumber, Row, Column, Level, Number, Cardinal, Play) :-
        halfPiece(PlayNumber, Row, Column, Level, Number, Cardinal) ,
        PlayNumber >= Play.

getGameOver(GameOver) :-                                         
        numberPieces(1, 0, 0, 0, R1) ,                 
        (R1 == 0 ->                                    
         (reset ,
          GameOver = 1) ;                    
         (numberPieces(2, 0, 0, 0, R2),                
          (R2 == 0 ->
           (reset ,                                  
            GameOver = 2) ;                 
           GameOver = 0))).

playHTTP(PlayerNow, Number1, Number2, Row, Column, Cardinal, Player, Distribution, Board, GameOver, Message) :-
        playPiece(Number1, Number2, PlayerNow, Row, Column, Cardinal, Level) ->
        (nextPlayer(PlayerNow, Level) ,
         turn(PlayerNext) ,
         Distribution = [] ,
         getGameOver(GameOver) ,
         Message = "OK" ,
         (PlayerNow == PlayerNext ->
          (Board = [] ,
           Player = PlayerNow) ;
          (player(PlayerNext, _, Type) ,
           (Type == 1 -> 
            (Board = [] ,
             Player = PlayerNext) ;
            (getComputerPlays(PlayerNext, Type, Board) ,
             changeTurn(PlayerNext) ,
             turn(Player)))))) ;
        (Player = PlayerNow ,
         Distribution = [] ,
         Board = [] ,
         GameOver = 0 ,
         Message = "KO").

getComputerPlays(Player, Type, Plays) :-
        getPlayNumber(LastPlay) ,
        Play is LastPlay + 1 ,
        (Type == 2 ->
         playRandom(Player) ;
         playBest(Player)) ,
        collectPlays(Play, Plays).

:- server(8081).

