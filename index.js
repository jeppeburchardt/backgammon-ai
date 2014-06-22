

var Game = require('./src/Game.js');
var Display = require('./src/display/ConsoleLogger.js');
var Random = require('./src/controllers/Random.js');
var Safe = require('./src/controllers/Safe.js');
var Runner = require('./src/controllers/Runner.js');
var Aggressive = require('./src/controllers/Aggressive.js')
var Tournament = require('./src/Tournament.js');

var tournament = new Tournament();

tournament.addPlayer(Aggressive, 'Aggressive');
tournament.addPlayer(Safe, 'Safe');
tournament.addPlayer(Random, 'Random');
tournament.addPlayer(Runner, 'Runner');

tournament.start(20);

// var game = new Game(100);

// var display = new Display(game);

// game.setController(Runner, 'Runner');
// game.setController(Safe, 'Safe');

// game.start();


// test hit player:
//game.board.players[0].checkers = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0];
//game.board.players[0].hits = 1;

// test stuck player:
//game.board.players[1].checkers = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3, 0, 0, 3, 0, 2, 0, 0];

// test obstructed player:
// game.board.players[0].checkers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// game.board.players[1].checkers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0];
// game.board.players[0].hits = 1;


// game.board.getAllPermutations(0, [1, 2]);
