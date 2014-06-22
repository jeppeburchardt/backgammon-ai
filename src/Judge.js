var clc = require('cli-color');

/**
 * The Judge class is used for checking if a move is illegal and the integrity og the game
 * 
 * @class Judge
 * @constructir
 * @param {Game} game Instance of current game
 */
function Judge (game) {

	var self = this;
	this.game = game;

	/**
	 * Checks that the correct amount of checkers is in play
	 *
	 * @returns {Boolean}
	 */
	this.checkGameIntegrity = function () {
		if (this.game.board.players[0].checkers.length !== 24) {
			// throw new Error('0 does not have 24 checkers');
			return false;
		}
		if (this.game.board.players[1].checkers.length !== 24) {
			// throw new Error('1 does not have 24 checkers');
			return false;
		}
		var num = 0;
		this.game.board.players.forEach(function (player) {
			num += player.checkers.reduce(function(prev, curr){
				return prev + curr;
			}, player.hits + player.bearedOff);
		});
		return (num === 30);
	}

	/**
	 * Calculates victory points for each player.
	 * 
	 * @return {Array} An array with the score of each player. The player's ID is the index in the array.
	 */
	this.getVictory = function () {

		var result = [];
		var winner = self.checkForWinner();
		var loser = 1-winner;

		var winningPlayer = self.game.board.players[winner];
		var losingPlayer = self.game.board.players[loser];

		if (losingPlayer.bearedOff > 0) {

			// one point game:
			result[winner] = 1;
			result[loser] = 0;

		} else if (losingPlayer.hits > 0 || losingPlayer.checkers.some(function (num, tile) {
			return (tile < 6 && num > 0);
		})) {

			// tripple point game:
			result[winner] = 3;
			result[loser] = 0;

		} else {

			// double point game:
			result[winner] = 2;
			result[loser] = 0;
		}

		return result;
	}

	/**
	 * Checks if a player has won the game
	 *
	 * @returns Player ID or Null if there is no winner
	 */
	 this.checkForWinner = function () {
	 	var winner = null;
	 	this.game.board.players.forEach(function (player, id) {
	 		if (player.bearedOff === 15) {
	 			winner = id;
	 		}
	 	});
	 	return winner;
	 }

	 

}



module.exports = Judge;