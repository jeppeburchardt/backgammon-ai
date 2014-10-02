
function GameResult(game) {

	var self = this;

	self.game = game;
	self.startTime = null;
	self.result = {
		players: [
			{
				name:'',
				score: 0,
				victories: 0,
				gammons: 0,
				gammonsLost: 0,
				backgammons: 0,
				backgammonsLost: 0,
				pips:0,
				moves:0,
				eyes: 0,
				eyes2: 0,
				rolls: 0,//one per die
				time:0,
				blockedOpponentMoves:0,
				blockedMoves:0
			},
			{
				name:'',
				score: 0,
				victories: 0,
				gammons: 0,
				gammonsLost: 0,
				backgammons: 0,
				backgammonsLost: 0,
				pips:0,
				moves:0,
				eyes: 0,
				eyes2: 0,//
				rolls: 0,//one per die
				time:0,
				blockedOpponentMoves:0,
				blockedMoves:0
			}
		],
		time: 0,
		turns: 0
	};

	self.game.on('start', function () {
		self.result.players[0].name = self.game.board.players[0].name;
		self.result.players[1].name = self.game.board.players[1].name;
		self.startTime = new Date().getTime();
	});

	self.game.on('turnStart', function (playerId, dice) {
	    self.result.players[playerId].eyes += dice.reduce(function (a, b) { return a + b; });
	    self.result.players[playerId].eyes2 += dice[0] + dice[1];
	    self.result.players[playerId].rolls += 2;
		self.currentTurnStartTime = new Date().getTime();
	});

	self.game.on('turn', function (playerId, moves, dice) {
		self.result.players[playerId].time += (new Date().getTime() - self.currentTurnStartTime);
		self.result.players[playerId].moves ++;
		if (moves.length < dice.length) {
		    self.result.players[playerId].blockedMoves += (dice.length - moves.length);
			self.result.players[1-playerId].blockedOpponentMoves += (dice.length - moves.length);
		}
	});

	function pipsReducer (previousValue, currentValue, index, array) {
		return previousValue + (currentValue * (index+1));
	}
	function countPips (checkers, hits, bearedOff) {
		return checkers.reduce(pipsReducer, (hits*-1) + (bearedOff*24));
	}

	self.game.on('end', function (forceLose) {
		self.result.time = (new Date().getTime()) - self.startTime;
		self.result.turns = self.game.turn;
		self.result.players[0].pips = countPips(self.game.board.players[0].checkers, self.game.board.players[0].hits, self.game.board.players[0].bearedOff);
		self.result.players[1].pips = countPips(self.game.board.players[1].checkers, self.game.board.players[1].hits, self.game.board.players[1].bearedOff);
		self.result.players[0].eyes = self.result.players[0].eyes / self.result.players[0].rolls;
		self.result.players[1].eyes = self.result.players[1].eyes / self.result.players[1].rolls;
		self.result.players[0].eyes2 = self.result.players[0].eyes2 / self.result.players[0].rolls;
		self.result.players[1].eyes2 = self.result.players[1].eyes2 / self.result.players[1].rolls;
		if (forceLose == undefined) {
			var victory = self.game.judge.getVictory();
			self.result.players[0].score = victory[0];
			self.result.players[1].score = victory[1];
		} else {
			self.result.players[forceLose].score = 0;
			self.result.players[1-forceLose].score = 3;
		}
		self.result.players[0].victories += self.result.players[0].score >= 1 ? 1 : 0;
		self.result.players[0].gammons += self.result.players[0].score === 2 ? 1 : 0;
		self.result.players[0].gammonsLost += self.result.players[1].score === 2 ? 1 : 0;
		self.result.players[0].backgammons += self.result.players[0].score === 3 ? 1 : 0;
		self.result.players[0].backgammonsLost += self.result.players[1].score === 3 ? 1 : 0;

		self.result.players[1].victories += self.result.players[1].score >= 1 ? 1 : 0;
		self.result.players[1].gammons += self.result.players[1].score === 2 ? 1 : 0;
		self.result.players[1].backgammons += self.result.players[1].score === 3 ? 1 : 0;
		self.result.players[1].gammonsLost += self.result.players[0].score === 2 ? 1 : 0;
		self.result.players[1].backgammons += self.result.players[1].score === 3 ? 1 : 0;
		self.result.players[1].backgammonsLost += self.result.players[0].score === 3 ? 1 : 0;


	});

}

module.exports = GameResult;