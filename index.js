

var Game = require('./src/Game.js');
var Display = require('./src/display/ConsoleLogger.js');
var Random = require('./src/controllers/Random.js');
var Safe = require('./src/controllers/Safe.js');
var Runner = require('./src/controllers/Runner.js');
var HeatMap = require('./src/controllers/HeatMap.js');
var Aggressive = require('./src/controllers/Aggressive.js')
var Tournament = require('./src/Tournament.js');

//*/ Tournament:
var tournament = new Tournament();
tournament.addPlayer(Aggressive, 'Aggressive');
tournament.addPlayer(Safe, 'Safe');
tournament.addPlayer(Runner, 'Runner');
tournament.addPlayer(HeatMap, 'HeatMap');
tournament.start(10);
//*/


/*/ Watch game:
var game = new Game(500);
var display = new Display(game);
game.setController(Safe, 'Safe');
game.setController(HeatMap, 'HeatMap');
game.start();
//*/


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
