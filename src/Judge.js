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
	 * Checks if a player has won the game
	 *
	 * @returns Player object or Null if there is no winner
	 */
	 this.checkForWinner = function () {
	 	var winner = null;
	 	this.game.board.players.forEach(function (player) {
	 		if (player.bearedOff === 15) {
	 			winner = player;
	 		}
	 	});
	 	return winner;
	 }

	 

}



module.exports = Judge;