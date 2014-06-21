/**
 * The Player class 
 * 
 * @class Player
 */
function Player (name) {

	var self = this;

	/**
	 * Name of the player
	 */
	self.name = name || 'unknown player';


	/**
	 * Number of checkers that has been hit
	 */
	self.hits = 0;


	/**
	 * Number of checkers that has been beared off the board
	 */
	self.bearedOff = 0;


	/**
	 * Array containing the number of checkers on each tile.
	 * The array index is relative to the player, meaning that 23 is the last tile before the end zone.
	 */
	self.checkers = Array(24);
	

	this.copy = function () {
		var c = new Player();
		c.name = self.name;
		c.hits = self.hits;
		c.bearedOff = self.bearedOff;
		c.checkers = self.checkers.slice();
		return c;
	}
}


module.exports = Player;