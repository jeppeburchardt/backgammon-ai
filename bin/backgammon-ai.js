#!/usr/bin/env node

var Game = require('../src/Game.js');
var Display = require('../src/display/ConsoleLogger.js');
var Random = this.Random = require('../src/controllers/Random.js');
var Safe = this.Safe = require('../src/controllers/Safe.js');
var Runner = this.Runner = require('../src/controllers/Runner.js');
var PrimerEndGame = this.PrimerEndGame = require('../src/controllers/PrimerEndGame.js');
var Aggressive = this.Aggressive = require('../src/controllers/Aggressive.js')
var TestA = this.TestA = require('../src/controllers/TestA.js');
var TestB = this.TestB = require('../src/controllers/TestB.js');
var Tournament = require('../src/Tournament.js');
var Trainer = require('../src/Trainer.js');

var optimist = require('optimist')
	.usage('$0 [game|tournament|trainer] [options] [playerA playerB ...]')
	.alias('d', 'delay')
	.describe('d', 'Delay in ms between each turn')
	.default('d', 0)
	.alias('g', 'games')
	.describe('g', 'Number of games that should be played (tournaments and training only)')
	.default('g', 10);

var argv = optimist.argv;

var mode = argv._[0] || '';


switch (mode.toLowerCase()) {

	case 'game':
		if (argv._.length != 3) { optimist.showHelp(); process.exit(); }
		var game = new Game(argv.d);
		var display = new Display(game);
		game.setController(new this[argv._[1]](), argv._[1]);
		game.setController(new this[argv._[2]](), argv._[2]);
		game.start();
	break;


	case 'tournament':
		if (argv._.length < 3) { optimist.showHelp(); process.exit(); }
		var tournament = new Tournament(argv.d);
		for (var i = 1; i < argv._.length; i++) {
			tournament.addPlayer(this[argv._[i]], argv._[i]);
		}
		tournament.start(argv.g);
	break;

	case 'trainer':
		if (argv._.length < 3) { optimist.showHelp(); process.exit(); }
		var trainer = new Trainer();
		trainer.addSubject(this[argv._[1]], argv._[1]);
		for (var i = 2; i < argv._.length; i++) {
			trainer.addOpponent(this[argv._[i]], argv._[i]);
		}
		trainer.start(argv.g);
	break;

	default:
		optimist.showHelp(); process.exit();
	break;

}
