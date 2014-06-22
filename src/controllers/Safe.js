var Q = require('q');


function Safe (id) {

	var self = this;
	self.id = id;
	self.safeZone = 0;

	this.turn = function (dice, board) {

		var deferred = Q.defer();
		var result = [];
		var permutations = board.getAllPermutations(self.id, dice);

		result = findBestPermutation(permutations, board);

		//setTimeout(function(){
			deferred.resolve(result);
		//}, 50);

		return deferred.promise;
	}

	function applyScoreToPermutation (p) {

		var me = p.board.players[self.id];
		var opponent = p.board.players[1-self.id];

		var score = me.bearedOff * 10;

		score += opponent.hits * 5;

		me.checkers.forEach(function (numCheckers, tile) {

			// bad to be alone behind enemy line
			if (tile <= self.safeZone && numCheckers === 1) {
				score -= 10;
			}
			// important to not be alone behind enemy line
			if (tile <= self.safeZone && numCheckers > 1) {
				score += 10;
			}
			// bad to have any checkers behind enemy lines
			if (tile <= self.safeZone && numCheckers > 0) {
				score -= numCheckers;
			}
			// good to be in the home zone
			if (tile >= 18) {
				score += numCheckers;
			}
		});

		p.score = score;

	}

	function findBestPermutation (permutations, board) {

		var lowestPositionOfOpponent = 0;
		board.players[1-self.id].checkers.some(function (num, tile) {
			if (num > 0) {
				lowestPositionOfOpponent = tile;
				return true;
			}
			return false;
		});
		// reverse direction:
		lowestPositionOfOpponent = 23 - lowestPositionOfOpponent;

		self.safeZone = board.players[1-self.id].hits > 0 ? 0 : lowestPositionOfOpponent;

		permutations.forEach(applyScoreToPermutation);

		permutations.sort(function (a, b) {
			return b.score - a.score;
		});

		// console.log('Best move: ' + permutations[0].score, permutations[0].moves);

		return permutations[0].moves;

	}

}


module.exports = Safe;