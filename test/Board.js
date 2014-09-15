var assert = require('assert');
var Board = require('../src/Board');


var board = null;

beforeEach(function(){

	board = new Board();
	board.initialCheckers();

});


describe('Board', function () {

	describe('#commitMove', function () {

		it('should move a tile', function () {
			board.commitMove(0, 0, 2);
			assert.equal(board.players[0].checkers[0], 1);
			assert.equal(board.players[0].checkers[2], 1);
		});

		it('should hit opponent', function () {
			board.players[1].checkers[21] = 1;
			board.commitMove(0, 0, 2);
			assert.equal(board.players[0].checkers[2], 1);
			assert.equal(board.players[1].checkers[21], 0);
			assert.equal(board.players[1].hits, 1);
		});

		it('should bear off', function () {
			board.players[0].checkers[23] = 1;
			board.commitMove(0, 23, 1);
			assert.equal(board.players[0].checkers[23], 0);
			assert.equal(board.players[0].bearedOff, 1);
		});

	});

	describe('#isMoveIllegal', function () {

		it('move to occupied tile should not be legal', function () {
			assert.notEqual(false, board.isMoveIllegal(0, 0, 5));
		});

		it('move to un-occupied tile should be legal', function () {
			assert.equal(false, board.isMoveIllegal(0, 0, 2));
		});

		it('cannot move other checkers, if hit', function () {
			board.players[0].hits = 1;
			assert.notEqual(false, board.isMoveIllegal(0, 0, 2));
		});

		it('can move hit checker', function () {
			board.players[0].hits = 1;
			assert.equal(false, board.isMoveIllegal(0, -1, 2));
		});

		it('can hit opponent', function () {
			board.players[1].checkers[20] = 1;
			assert.equal(false, board.isMoveIllegal(0, 0, 3));
		});

		it('cannot bear off checker if not all checkers are in end-zone', function () {
			board.players[0].checkers[22] = 1;
			assert.notEqual(false, board.isMoveIllegal(0, 22, 2));
		});

		it('can bear off checker if all checkers are in end-zone', function () {
			board.players[0].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0];
			assert.equal(false, board.isMoveIllegal(0, 22, 2));
		});

		it('cannot move a checker that does not exists', function () {
			assert.notEqual(false, board.isMoveIllegal(0, 1, 1));
		});

		it('cannot move a checker to a tile occupied by 5 checkers of own kind', function () {
			board.players[0].checkers[6] = 1;
			assert.notEqual(false, board.isMoveIllegal(0, 6, 5));
		});

		it('can not bear off checker if hit', function () {
			board.players[0].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0];
			board.players[0].hits = 1;
			assert.notEqual(false, board.isMoveIllegal(0, 22, 2));
		});

		it('can not bear off checkers if not all checkers are in the home zone', function () {
			board.players[0].checkers = [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0];
			assert.notEqual(false, board.isMoveIllegal(0, 22, 2));
		});

		it('can not bear off a checker on a die roll, that is higher than required, if there is another checker to move', function () {
			board.players[0].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1];
			assert.notEqual(false, board.isMoveIllegal(0, 23, 2));
		});



	});

});