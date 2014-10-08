var Q = require('q');
var Game = require('../Game.js');
var Mini = require('./Mini.js');
//Arthor: P. S. Wille

function MiniMax (id) {

	var self = this;
	self.id = id;
	self.miniA = new Mini;
	self.miniB = new Mini;
	//self.Game = new Game(0, true);
	//self.Game.setController(self.miniA, 'Mini');
	//self.Game.setController(self.miniB, 'Runner');

	this.turn = function (dice, board) {

		var deferred = Q.defer();
		var result = [];
		var permutations = board.getAllPermutations(self.id, dice);

		result = findBestPermutation(permutations);

		//setTimeout(function(){
			deferred.resolve(result);
		//}, 50);

		return deferred.promise;
	}

	function applyScoreToPermutation (p) {

	    p.score = getPly1TotalScore(p);

	}
	function getPly1TotalScore(p) {

	    score = 0;
	    //score += getPly1BoardScore([1, 1, 1, 1], p);
	    //score += getPly1BoardScore([2, 2, 2, 2], p);
	    //score += getPly1BoardScore([3, 3, 3, 3], p);
	    //score += getPly1BoardScore([4, 4, 4, 4], p);
	    //score += getPly1BoardScore([5, 5, 5, 5], p);
	    //score += getPly1BoardScore([6, 6, 6, 6], p);

	    //score += getPly1BoardScore([2, 1], p) * 2;
	    //score += getPly1BoardScore([3, 1], p) * 2;
	    //score += getPly1BoardScore([3, 2], p) * 2;
	    //score += getPly1BoardScore([4, 1], p) * 2;
	    score += getPly1BoardScore([4, 2], p) * 2;
	    score += getPly1BoardScore([4, 3], p) * 2;
	    score += getPly1BoardScore([5, 1], p) * 2;
	    score += getPly1BoardScore([5, 2], p) * 2;
	    score += getPly1BoardScore([5, 3], p) * 2;
	    score += getPly1BoardScore([5, 4], p) * 2;
	    score += getPly1BoardScore([6, 1], p) * 2;
	    //score += getPly1BoardScore([6, 2], p) * 2;
	    //score += getPly1BoardScore([6, 3], p) * 2;
	    //score += getPly1BoardScore([6, 4], p) * 2;
	    //score += getPly1BoardScore([6, 5], p) * 2;
	    //console.log('finale score:' + score);

	    return score;

	}
	function getPly1BoardScore(dice, p)
	{
	    //self.Game.resetGame(0, true, 1, p.board.copy());
	    //self.Game.testTurn(dice);

	    //return getScoreForBoard(self.Game.board);
	    var game = new Game(0, true, 1, p.board);

	    game.setController(self.miniA, 'Mini');
	    game.setController(self.miniB, 'Runner');

	    game.testTurn(dice);

	    return getScoreForBoard(game.board);
	}
	function findBestPermutation (permutations) {

	    topPermutations = [];
	    permutations.forEach(getScore);

		permutations.sort(function (a, b) {
			return b.score - a.score;
		});
		var Top = 3
		if (permutations.length < Top)
		{ Top = permutations.length }

		
		for(var i = 0; i < Top; i++)
		{
		    topPermutations.push(permutations[i])
		}

		topPermutations.forEach(applyScoreToPermutation);

		topPermutations.sort(function (a, b) {
		    return b.score - a.score;
		});

		console.log('Best move: ' + topPermutations[0].score, topPermutations[0].moves);

		return topPermutations[0].moves;

	}
	function getScore(p)
	{
	    return getScoreForBoard(p.board)
	}
	function getScoreForBoard(board) {
	    var opponent = 1 - self.id;
	    var lowestPositionOfOpponent = self.lowestPositionOfOpponent(board);
	    var lowestPosition = self.lowestPositionOfSelf(board);
	    var checkersOnBoard = (15 - board.players[self.id].bearedOff);
	    var pip = getPip(board.players[self.id].checkers);
	    var pipOfOpponent = getPip(board.players[opponent].checkers);

	    var endgame = lowestPositionOfOpponent < lowestPosition;

	    var score = 0;


	    if (endgame) {
	        if (pip > pipOfOpponent + 10) {
	            score += 40;
	        }
	        else {
	            score += 4;
	        }

	        var tilesOccupied = (23 - lowestPosition);
	        var DistributionGoal = tilesOccupied / checkersOnBoard;

	        //playing to get a 3-5-7 at home and even distribution outside 
	        board.players[self.id].checkers.forEach(function (numCheckers, tile) {
	            if (tile >= 18) {
	                score -= Math.abs(7.4 - 2.4 * (tile - 18) - numCheckers);
	            } else {
	                score -= Math.abs(DistributionGoal - numCheckers);
	            }
	            //Pip score
	            score -= 0.5 * pip;


	        });
	    }
	    else {
	        //Pip score
	        score -= board.players[self.id].hits * 3.5;
	        score += board.players[opponent].hits * 3.5;
	        var exposed = 0;
	        board.players[self.id].checkers.forEach(function (numCheckers, tile) {
	            if (numCheckers == 1) {
	                score -= (0.2 * tile);
	                exposed += 1;

	                //Home is exposed so its bad to hit
	                if (tile > 16 && board.players[opponent].hits > 0) {
	                    score -= 2;
	                }
	            }
	            //Home is blocked so its good to hit
	            if (numCheckers >= 2 && tile > 17 && board.players[opponent].hits > 0) {
	                score += 1;
	            }
	            // Priming a long chain of blocked tiles is good
	            if (numCheckers >= 2 && tile > 0 && board.players[self.id].checkers[tile - 1] >= 2) {
	                score += 1;
	            }

	        });

	        //p.board.players[opponent].checkers.forEach(function (numCheckers, tile) {

	        //    //opponent home is blocked so its extra bad to be exposed
	        //    if (numCheckers >= 2 && tile > 17 ) {
	        //        score -= 1* exposed;
	        //    }

	        //});

	        if (board.players[self.id].checkers[16] > 2) {
	            score += 1;
	        }
	        if (board.players[self.id].checkers[17] > 2) {
	            score += 1;
	        }
	        if (board.players[self.id].checkers[18] > 2) {
	            score += 1;
	        }
	    }
	    return score;

	}
	self.lowestPositionOfOpponent = function (board) {
	    var lowestPositionOfOpponent = getlowestPosition(board.players[1 - self.id].checkers);
	    // reverse direction:
	    lowestPositionOfOpponent = 23 - lowestPositionOfOpponent;

	    return board.players[1 - self.id].hits > 0 ? 24 : lowestPositionOfOpponent;
	};
	self.lowestPositionOfSelf = function (board) {
	    var lowestPositionOfSelf = getlowestPosition(board.players[self.id].checkers);

	    return board.players[self.id].hits > 0 ? -1 : lowestPositionOfSelf;

	};
	function getlowestPosition(checkers) {

	    var lowestPosition = 0;
	    checkers.some(function (num, tile) {
	        if (num > 0) {
	            lowestPosition = tile;
	            return true;
	        }
	        return false;
	    });

	    return lowestPosition;
	}
	function getPip(checkers) {
	    var pip = 0;
	    checkers.forEach(function (numCheckers, tile) {
	        //Pip score
	        pip += (numCheckers * (24 - tile));


	    });

	    return pip;
	}
}


module.exports = MiniMax;