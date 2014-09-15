
function Dice () {

	this.roll = function () {
		var a = Math.floor(6 * Math.random()) + 1;
		var b = Math.floor(6 * Math.random()) + 1;
		return [a, b];
	};

	this.rollToMoves = function (roll) {
		var a = roll[0];
		var b = roll[1];
		
		if (a == b) {
			return [a, a, a, a];
		} else {
			return [a, b];
		}
	};

};

module.exports = Dice;