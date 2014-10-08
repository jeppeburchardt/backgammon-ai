var Events = require('events');
var Judge = require('./Judge');
var Board = require('./Board');
var Dice = require('./Dice');
var GameResult = require('./GameResult');
var Q = require('q');


/**
 * The Game class keeps track of the players' turns and moves
 * 
 * @class
 */
function Game (turnDelay) {
	
	var self = this;

	self.result = new GameResult(self);

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
		controller.id = id;
		self.controllers.push(controller);
		self.board.players[id].name = name;
		self.emit('controller', controller);
	}


	/**
	 * Starts the game
	 */
	this.start = function () {
		self.emit('start');
		executeFirstRoll();
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

	function executeFirstRoll () {

		var roll = [null, null];

		while (roll[0] === roll[1]) {
			roll = self.dice.roll();

			if (roll[0] > roll[1]) {
				executeNextTurn(self.dice.rollToMoves(roll));

			} else if (roll[0] < roll[1]) {
				self.turn ++; //TODO: reverse order of controllers, instead of increasing turn
				executeNextTurn(self.dice.rollToMoves(roll));
			}
		}
	}

	/**
	 * Executes the game
	 *
	 * @private
	 */
	function executeNextTurn (forceRoll) {
		
		var turnStartTime = new Date().getTime();
		var dice = forceRoll || getDiceRoll();
		var allLegalMoves = self.board.getAllPermutations(self.getCurrentIndex(), dice);
		var playerMoves = [];
		
		self.lastDiceRoll = dice.slice();

		self.emit('turnStart', self.getCurrentIndex(), dice.slice());

		self.getCurrentController().turn(dice.slice(), self.board.copy()).then(function (moves) {

			var isMoveLegal = allLegalMoves.some(function (p) {
				return JSON.stringify(p.moves) === JSON.stringify(moves);
			});
			playerMoves = moves;

			if (isMoveLegal) {
				moves.forEach(function (move) {
					self.board.commitMove(self.getCurrentIndex(), move[0], move[1]);
				});
			} else {

				//controller.turn tried to make an illegal move, player loses
				console.log('player', self.getCurrentPlayer().name, 'tried an illegal move and loses');
				self.isRunning = false;
				resolveGame(self.getCurrentIndex());
			}

		}).fail(function (error) {
			
			//controller.turn threw an exception, player loses
			console.log('player', self.getCurrentPlayer().name, '\'s tuen threw an exception and loses');
			self.isRunning = false;
			resolveGame(self.getCurrentIndex());

		}).done(function () {
			
		    self.emit('turn', self.getCurrentIndex(), playerMoves, dice.slice());

			var winner = self.judge.checkForWinner();
			if (winner !== null) {

				self.isRunning = false;
				resolveGame();
				

			} else if (!self.judge.checkGameIntegrity()) {
				
				deferred.reject(new Error('Game is broken'));

			} else {
				
				if (self.isRunning) {
				    self.turn++;
				    self.board.turn++;
					if (self.turnDelay > 0) {
						setTimeout(executeNextTurn.bind(self), self.turnDelay);
					} else {
						executeNextTurn();
					}
				}
			}
		});
	}
	
	function resolveGame (forceLose) {
		self.emit('end', forceLose);
		self.emit('result', self.result.result);
		deferred.resolve(self.result.result);
	}

}


Game.prototype.__proto__ = Events.EventEmitter.prototype;


module.exports = Game;
