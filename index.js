

var Game = require('./src/Game.js');

var Random = require('./src/controllers/Random.js');
var Aggressive = require('./src/controllers/Aggressive.js')


var game = new Game();

game.setController(Random, 'Sonja');
game.setController(Aggressive, 'Pelle');

game.start();


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