var Events = require('events');
var Judge = require('./Judge.js');
var Board = require('./Board.js');
var Dice = require('./Dice.js');
var Q = require('q');


/**
 * The Game class keeps track of the players' turns and moves
 * 
 * @class
 */
function Game (turnDelay) {
	
	var self = this;

	self.turnDelay = turnDelay || 0;
	
	self.turn = 0;
	self.lastDiceRoll = [];

	var deferred = Q.defer();

	self.board = new Board();
	self.judge = new Judge(self);
	self.dice = new Dice();

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
		self.emit('start');
		executeNextTurn();
		return deferred.promise;
	}

	function getDiceRoll () {
		var roll = self.dice.roll();
		return self.dice.rollToMoves(roll);
	}

	
	this.getCurrentIndex = function () {
		return self.turn % 2;
	}
	this.getOtherIndex = function () {
		return 1 - (self.turn % 2);
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
		
		self.lastDiceRoll = dice.slice();

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

			self.emit('turn');
			
			var winner = self.judge.checkForWinner();

			if (winner !== null) {

				self.isRunning = false;
				resolveGame();
				

			} else if (!self.judge.checkGameIntegrity()) {
				
				deferred.reject(new Error('Game is broken'));

			} else {
				
				if (self.isRunning) {
					self.turn++;
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

		self.emit('end', result);
		deferred.resolve(result);
	}

}


Game.prototype.__proto__ = Events.EventEmitter.prototype;


module.exports = Game;