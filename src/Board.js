var Player = require('./Player.js');

function Board () {
	
	var self = this;
	
	this.players = [
		new Player(),
		new Player()
	];

	this.initialCheckers = function () {
	    self.turn = 0;
		self.players[0].hits = 0;
		self.players[1].hits = 0;
		self.players[0].bearedOff = 0;
		self.players[1].bearedOff = 0;
		self.players[0].checkers = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0];
		self.players[1].checkers = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0];
	}

	this.copy = function () {

		var c = new Board();
		c.players = [
			self.players[0].copy(),
			self.players[1].copy()
		];
		return c;

	}

	this.getAllPermutations = function (id, dice) {
		var dicePermutations = [];
		var gamePermutations = [];

		// create all possible dice-permutations of the dice roll:
		if (dice.length == 2) {
			dicePermutations = [dice.slice(), dice.slice().reverse()];
		} else {
			dicePermutations = [dice.slice()];
		}

		for (var i = 0; i < dicePermutations.length; i++) {
			var dicePermutation = dicePermutations[i];

			var result = [
				[{'board': self.copy(), 'moves':[]}]
			];
			
			for (var d = 0; d < dicePermutation.length; d++) {
				var die = dicePermutation[d];

				//expand from all previous permutations:
				if (result[d]) {
					for (var p = 0; p < result[d].length; p++) {
						var pb = result[d][p].board;
						var pm = result[d][p].moves;

						//get all legal moves
						var moves = pb.getAllLegalMoves(id, die);

						//apply moves to copys of previous permutations
						var permutations = moves.map(function (move) {
							
							var newBoard = pb.copy();
							newBoard.commitMove(id, move[0], move[1]);
							
							var newMoveHistory = pm.slice();
							newMoveHistory.push(move);
							
							return {
								'moves':newMoveHistory,
								'board':newBoard
							}
						});

						//add new permutations to result depth
						if (!result[d+1]) {
							result[d+1] = permutations;
						} else {
							result[d+1] = result[d+1].concat(permutations);
						}
					}
				}
			}

			gamePermutations = gamePermutations.concat(result);

		}

		//var permutations = gamePermutations.pop();
		var flatten = [];
		flatten = flatten.concat.apply(flatten, gamePermutations);

		//check if all dices can be used:
		var isObstructed = flatten.every(function (p) {
			return p.moves.length < dice.length;
		});

		var isStuck = flatten.every(function (p) {
			return p.moves.length == 0;
		});

		if (isStuck) {

			// player is stuck, no moves available!
			platten = [];

		} else if (isObstructed) {
			
			// if a player can only use one or the other die, the highest must be used!

			var highest = flatten.filter(function (p) { 
				return p.moves.length > 0; 
			}).sort(function (a, b) {
				return a.moves[0][1] - b.moves[0][1];
			}).pop();

			flatten = [highest];
		
		} else {
			
			// remove all moves that does not use all dice:
			flatten = flatten.filter(function (p) {
				return p.moves.length == dice.length;
			});
		}


		// flatten.forEach(function (p) {
		// 	console.log(p.moves);
		// });

		return flatten;
		
	}

	this.getAllLegalMoves = function (id, distance) {
		var player = self.players[id];
		var moves = [];

		if (player.hits > 0) {
			
			if (!self.isMoveIllegal(id, -1, distance)) {
				moves.push([-1, distance]);
			}

		} else {

			player.checkers.forEach(function (num, tile) {
				if (num > 0 && !self.isMoveIllegal(id, tile, distance)) {
					moves.push([tile, distance]);
				}
			});
		}
		return moves;
	}

	this.commitMove = function (id, tile, distance) {
		
		var player = self.players[id];
		var opponent = self.players[1-id];

		if (tile == -1) {
			player.hits --;
		} else {
			player.checkers[tile] --;	
		}

		var positionRelativeToOpponent = 23 - (tile+distance);

		if (tile+distance>23) { // check if tile exits game
		
			//score to player
			player.bearedOff ++;

		} else if (opponent.checkers[positionRelativeToOpponent] == 1) { 
			
			// cehck if opponent checker is hit
			player.checkers[tile+distance] ++;
			opponent.checkers[positionRelativeToOpponent] = 0;
			opponent.hits ++;
		
		} else {
		
			//normal move
			player.checkers[tile+distance] ++;
		}
	}

	/**
	 * @return	mixed	false if move is legal or a string explaining why the move is illegal
	 */
	this.isMoveIllegal = function (id, tile, distance) {

		var player = self.players[id];
		var opponent = self.players[1-id];

		// check if player has any hits:
		if (player.hits > 0) {
			if (tile != -1) {
				return 'Player must move hitted checker first!'
			}
		}

		// check if checker exists:
		if (tile === -1 && player.hits < 1) {
			return 'Player tried to move a checker that was hit, but does not have any';
		}
		if (tile != -1 && player.checkers[tile] < 1) {
			return 'Player tried to move a checker that does not exist!\nChecker:'+tile+'\nCheckers'+player.checkers.join(',');
		}

		// check if tile exists:
		if (tile > 23 || tile < -1) {
			return 'Tile does not exitst!'
		}  

		// check if new tile is occupied by more than one opponent checker:
		var reversedOpponentCheckers = opponent.checkers.slice().reverse();
		if (reversedOpponentCheckers[tile+distance] > 1) {
			return 'Player tried to move a checker to a tile that is occupied by an opponent checker!';
		}

		// check if tile is occupired by 5 checkers of own kind:
		if (player.checkers[tile+distance] > 4) {
			return 'Player tried to move a checker to a tile with 5 checkers of own kind';
		}

		// check if checker is moving home and is allowed to:
		// TODO: A die may not be used to bear off checkers from a lower-numbered point unless there are no checkers on any higher points.
		if (tile + distance >= 24) {
			for (var i = 0; i < 18; i++) {
				if (player.checkers[i] > 0) {
					return 'Player tried to bear off a checker, before all checkers are in the home zone!';
				}
			}
			if (tile + distance != 24 && tile != getLastPosition(player.checkers)) {
			    return 'A die may not be used to bear off checkers from a lower-numbered point unless there are no checkers on any higher points.!';
			}
		}

		return false;
	};
	function getLastPosition(checkers) {

	    var lowestPosition = 0;
	    checkers.some(function (num, tile) {
	        if (num > 0) {
	            lowestPosition = tile;
	            return true;
	        }
	        return false;
	    });

	    return lowestPosition;
	}
}


module.exports = Board;
