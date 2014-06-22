var Q = require('q');


function HeatMap (id) {

	var self = this;
	self.id = id;

	self.opponentMap = [];

	this.turn = function (dice, board) {

		var deferred = Q.defer();
		var result = [];
		var permutations = board.getAllPermutations(self.id, dice);

		result = findBestPermutation(permutations, board);

		deferred.resolve(result);

		return deferred.promise;
	}

	function applyScoreToPermutation (p) {

		var me = p.board.players[self.id];
		var opponent = p.board.players[1-self.id];

		

		var score = 0;
		var checkersAloneHeat = 0;
		
		score += me.bearedOff;

		me.checkers.forEach(function (numCheckers, tile) {
			var heat = self.opponentMap[tile];

			if (numCheckers == 1) {
				score -= heat;
				checkersAloneHeat += heat;
			} else if (numCheckers > 1) {
				score += 1;
				//score -= heat / 2;
			}
			
			if (tile >= 18) {
				score += numCheckers;
			}
		});


		score += Math.min(0, (opponent.hits * 7) - checkersAloneHeat);

		// var myHeatMap = buildHeatMap(p.board, self.id).reverse();
		// opponent.checkers.forEach(function (numCheckers, tile) {
		// 	var heat = myHeatMap[tile];

		// 	if (numCheckers == 1) {
		// 		score += heat / 10;
		// 	}
		// });

		p.score = score;

	}

	function buildHeatMap (board, id) {

		var map = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

		var checkers = board.players[id].checkers.slice();
		checkers.unshift(board.players[id].hits);

		checkers.forEach(function (num, i) {
			if (num > 0) {
				for (j = 0; j < 14 && j+i <= 24; j++) {
					var heat = (j > 7) ? j-(j-7) : j;
					map[j+i] += heat;
				}
			}
		});
		map.shift();

		return map;
	}

	function findBestPermutation (permutations, board) {

		self.opponentMap = buildHeatMap(board, 1-self.id).reverse();
		// console.log(self.opponentMap);

		permutations.forEach(applyScoreToPermutation);

		permutations.sort(function (a, b) {
			return b.score - a.score;
		});

		// console.log('Best move: ' + permutations[0].score, permutations[0].moves);

		return permutations[0].moves;

	}

}


module.exports = HeatMap;