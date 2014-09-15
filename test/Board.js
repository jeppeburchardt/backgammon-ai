var assert = require('assert');
var Board = require('../src/Board');


var board = null;


function isMoveInPermutations (moves, permutations) {
	return permutations.some(function (p) {
		// console.log('P:', p.moves, 'M:', moves);
		return JSON.stringify(p.moves) === JSON.stringify(moves);
	});
}


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

		it('can move a checker to a tile occupied by 5 checkers of own kind', function () {
			board.players[0].checkers[6] = 1;
			assert.equal(false, board.isMoveIllegal(0, 6, 5));
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

	});


	describe('#getAllPermutations', function () {

		it('can not bear off a checker on a die roll, that is higher than required, if there is another checker to move', function () {
			board.players[0].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1];
			board.players[1].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1];
			var p = board.getAllPermutations(0, [2, 2]);
			assert.equal(isMoveInPermutations([[23, 2], [21, 2]], p), false);
		});

		it('should bear off before making another move', function () {
			board.players[0].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0];
			board.players[1].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0];
			var p = board.getAllPermutations(0, [2, 1]);
			assert.equal(isMoveInPermutations([[21, 2], [22, 1]], p), false);
		});

		it('should only allow the highest die, if only one or the other can be used', function () {
			board.players[0].checkers = [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			board.players[1].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0];
			var p = board.getAllPermutations(0, [2, 3]);
			assert.equal(isMoveInPermutations([[2, 3]], p), true);
			assert.equal(isMoveInPermutations([[2, 2], [4, 3]], p), false);
			assert.equal(isMoveInPermutations([[2, 3], [5, 2]], p), false);
			assert.equal(p.length, 1);
		});

		it('should allow to use any order od the dice, if there is no obstacles', function () {
			board.players[0].checkers = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			board.players[1].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			var p = board.getAllPermutations(0, [1, 2]);
			assert.equal(isMoveInPermutations([[0, 1], [1, 2]], p), true);
			assert.equal(isMoveInPermutations([[0, 2], [2, 1]], p), true);
			assert.equal(p.length, 2);
		});

		it('should find a way around an opponent', function () {
			board.players[0].checkers = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			board.players[1].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0];
			var p = board.getAllPermutations(0, [1, 2]);
			assert.equal(isMoveInPermutations([[0, 1], [1, 2]], p), true);
			assert.equal(p.length, 1);
		});

		it('should not be possible to make any moves, if all tiles are blocked by the opponent', function () {
			board.players[0].checkers = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			board.players[1].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0];
			var p = board.getAllPermutations(0, [1, 2]);
			assert.equal(p[0].moves.length, 0);
			assert.equal(p[1].moves.length, 0);
		});

		it('should not be possible to move a hit checker, if all tiles are blocked by the opponent', function () {
			board.players[0].checkers = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
			board.players[0].hits = 1;
			board.players[1].checkers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2];
			var p = board.getAllPermutations(0, [5, 4]);
			assert.equal(p[0].moves.length, 0);
			assert.equal(p[1].moves.length, 0);
		});

	});



});