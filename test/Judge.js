var assert = require('assert');
var Game = require('../src/Game');

var game = null;

beforeEach(function(){

	game = new Game();

});


describe('Judge', function () {

	describe('#checkGameIntegrity', function () {

		it('should return false if there is to many checkers', function () {
			game.board.players[0].checkers[24] = 1;
			assert.equal(game.judge.checkGameIntegrity(), false);
		});

		it('should return false if sum of player\'s checkers is not 15', function () {
			game.board.players[0].hits = 1;
			assert.equal(game.judge.checkGameIntegrity(), false);
		});

		it('should return false if sum of player\'s checkers is not 15', function () {
			game.board.players[0].bearedOff = 1;
			assert.equal(game.judge.checkGameIntegrity(), false);
		});

		it('should return false if sum of player\'s checkers is not 15', function () {
			game.board.players[0].checkers[0] = 1;
			assert.equal(game.judge.checkGameIntegrity(), false);
		});

		it('should return false if more than one player is occupying the same tile', function () {
			game.board.players[0].hits = 14;
			game.board.players[1].hits = 14;
			game.board.players[0].checkers = [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			game.board.players[1].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0];
			assert.equal(game.judge.checkGameIntegrity(), false);
		});

	});

});