var Q = require('q');


function Safe (id) {

	var self = this;
	self.id = id;

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

		var score = p.board.players[self.id].bearedOff * 10;

		p.board.players[self.id].checkers.forEach(function (val) {
			if (val === 1) {
				score -= 1;
			}
		});

		p.score = score;

	}

	function findBestPermutation (permutations) {

		permutations.forEach(applyScoreToPermutation);

		permutations.sort(function (a, b) {
			return b.score - a.score;
		});

		// console.log('Best move: ' + permutations[0].score, permutations[0].moves);

		return permutations[0].moves;

	}

}


module.exports = Safe;