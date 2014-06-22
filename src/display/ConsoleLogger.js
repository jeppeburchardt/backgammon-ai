var clc = require('cli-color');


function ConsoleLogger (game) {

	var self = this;

	self.game = game;

	

	/**
	 * Prints the current game board to the console
	 */
	this.print = function () {
		var w = self.game.board.players[0].checkers.slice().reverse();
		var b = self.game.board.players[1].checkers.slice();

		console.log('Turn: ' + self.game.turn + ' ' + self.game.getCurrentPlayer().name + ' rolled ' + self.game.lastDiceRoll.join(','));

		console.log(clc.yellowBright(self.game.board.players[0].name + ' hit: ' + self.game.board.players[0].hits + ' beared off: ' + self.game.board.players[0].bearedOff));
		for (var i = 0; i < 24; i++) {
			process.stdout.write(clc.yellowBright(23-i));
			process.stdout.write('\t');
			process.stdout.write(clc.redBright(i));
			process.stdout.write('\t-\t');
			if (w[i] > 0) {
				for (var j=0; j < w[i]; j++) {
					process.stdout.write(clc.yellowBright('o'));
				}
			}
			if (b[i] > 0) {
				for (var k=0; k < b[i]; k++) {
					process.stdout.write(clc.redBright('o'));
				}
			}
			process.stdout.write('\n');
		}
		console.log(clc.redBright(self.game.board.players[1].name + ' hit: ' + self.game.board.players[1].hits + ' beared off: ' + self.game.board.players[1].bearedOff));

	}

	this.end = function (result) {
		console.log('GAME IS OVER!', result);
		console.log(self.game.board.players[0].name + ' got ' + result[0] + ' points');
		console.log(self.game.board.players[1].name + ' got ' + result[1] + ' points');
	}

	self.game.on('turn', self.print.bind(self));
	self.game.on('end', self.end.bind(self));

}


module.exports = ConsoleLogger;