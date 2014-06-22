var clc = require('cli-color');
var Judge = require('./Judge.js');
var Board = require('./Board.js');
var Q = require('q');


/**
 * The Game class keeps track of the players' turns and moves
 * 
 * @class
 */
function Game (turnDelay) {
	
	var self = this;

	self.turnDelay = turnDelay || 0;
	
	var turn = 0;

	var deferred = Q.defer();

	self.board = new Board();
	self.judge = new Judge(self);
	self.isRunning = true;
	self.controllers = [];

	self.board.initialCheckers();


	this.setController = function (controller, name) {
		var id = self.controllers.length;
		self.controllers.push(new controller(id));
		self.board.players[id].name = name;
	}


	/**
	 * Starts the game
	 */
	this.start = function () {
		executeNextTurn();
		// self.print();
		return deferred.promise;
	}

	function getDiceRoll () {
		var a = Math.floor(6 * Math.random()) + 1;
		var b = Math.floor(6 * Math.random()) + 1;
		if (a == b) {
			return [a, a, a, a];
		} else {
			return [a, b];
		}
	}

	
	this.getCurrentIndex = function () {
		return turn % 2;
	}
	this.getOtherIndex = function () {
		return 1 - (turn % 2);
	}
	this.getCurrentPlayer = function () {
		return self.board.players[self.getCurrentIndex()];
	}
	this.getOtherPlayer = function () {
		return self.board.players[self.getOtherIndex()];
	}
	this.getCurrentController = function () {
		return self.controllers[self.getCurrentIndex()];
	}
	this.getOtherController = function () {
		return self.controllers[self.getOtherIndex()];
	}

	/**
	 * Executes the game
	 *
	 * @private
	 */
	function executeNextTurn () {
		
		var dice = getDiceRoll();
		var allLegalMoves = self.board.getAllPermutations(self.getCurrentIndex(), dice);
		

		console.log('Turn: ' + turn + ' ' + self.getCurrentPlayer().name + ' rolled ' + dice.join(','));

		self.getCurrentController().turn(dice.slice(), self.board.copy()).then(function (moves) {

			var isMoveLegal = allLegalMoves.some(function (p) {
				return JSON.stringify(p.moves) === JSON.stringify(moves);
			});

			if (isMoveLegal) {
				moves.forEach(function (move) {
					self.board.commitMove(self.getCurrentIndex(), move[0], move[1]);
				});
			} else {

				//controller.turn tried to make an illegal move, player loses
				self.isRunning = false;
				resolveGame(self.getCurrentIndex());
			}

		}).fail(function (error) {
			
			//controller.turn threw an exception, player loses
			self.isRunning = false;
			resolveGame(self.getCurrentIndex());

		}).done(function () {

			self.print();
			
			var winner = self.judge.checkForWinner();

			if (winner !== null) {

				self.isRunning = false;
				resolveGame();
				

			} else if (!self.judge.checkGameIntegrity()) {
				
				deferred.reject(new Error('Game is broken'));

			} else {
				
				if (self.isRunning) {
					turn++;
					if (self.turnDelay > 0) {
						setTimeout(executeNextTurn.bind(self), self.turnDelay);
					} else {
						executeNextTurn();
					}
				}
			}
		});
	}
	
	function resolveGame (loser) {

		var forceLose = loser || null;
		var result = [0, 0];

		if (forceLose) {
 			
			result[forceLose] = 0;
			result[1-forceLose] = 3;

		} else {

			result = self.judge.getVictory();
		}

		deferred.resolve(result);
	}

	/**
	 * Prints the current game board to the console
	 * 
	 * @todo Replace with a seperate class that recieves events from Game class when a move has been made
	 */
	this.print = function () {
		var w = self.board.players[0].checkers.slice().reverse();
		var b = self.board.players[1].checkers.slice();


		console.log(clc.yellowBright(self.board.players[0].name + ' hit: ' + self.board.players[0].hits + ' beared off: ' + self.board.players[0].bearedOff));
		for (var i = 0; i < 24; i++) {
			process.stdout.write('- ');
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
		console.log(clc.redBright(self.board.players[1].name + ' hit: ' + self.board.players[1].hits + ' beared off: ' + self.board.players[1].bearedOff));

		
	}
}

module.exports = Game;