var Q = require('q');


/**
 * A very simple AI that will always make a random move.
 */
function Random (id) {

	var self = this;
	self.id = id;

	this.turn = function (dice, board) {

		var deferred = Q.defer();
		var result = [];
		var permutations = board.getAllPermutations(self.id, dice);

		result = permutations[Math.floor(Math.random()*permutations.length)].moves;

		setTimeout(function(){
			deferred.resolve(result);
		}, 50);

		return deferred.promise;
	}


}


module.exports = Random;