var Game = require('./Game.js');
var Q = require('q');

function Trainer () {

	var self = this;

	self.totalGames = 10;
	self.gamesPlayed = 0;
	self.subject = null;
	self.opponents = [];
	self.players = [];
	self.rotation = 0;

	this.addSubject = function (controller, name) {

		self.subject = {
			name: name,
			controller: controller,
			score: 0,
			games: 0
		};
		self.players.push(self.subject);
	}

	this.addOpponent = function (controller, name) {

		var p = {
			name: name,
			controller: controller,
			score: 0,
			games: 0
		};

		self.opponents.push(p);
		self.players.push(p);
	}

	function addScoreToPlayer (name, score) {

		self.players.some(function (player) {
			if (player.name == name) {
				player.score += score;
				player.games ++;
				return true;
			}
			return false;
		})
	}

	this.start = function (games)  {
		self.totalGames = games;
		self.next();
	}

	this.next = function () {

		var a = self.subject;
		var b = self.opponents[self.rotation ++ % self.opponents.length];

		console.log('Starting new match between', a.name, 'and', b.name);

		var game = new Game();
		game.setController(new a.controller(), a.name);
		game.setController(new b.controller(), b.name);
		var gamePromise = game.start();
		gamePromise.then(function (result) {
			console.log(game.board.players[0].name + ' vs ' + game.board.players[1].name + ' ended ' + result[0] + '-' + result[1]);
			addScoreToPlayer(game.board.players[0].name, result[0]);
			addScoreToPlayer(game.board.players[1].name, result[1]);

			if (++self.gamesPlayed < self.totalGames) {
				self.next();
			} else {
				console.log(self.gamesPlayed + ' games completed!');
				self.players.sort(function (a, b) { return b.score - a.score; });
				self.players.forEach(function (player) {
					console.log(player.name + '\tscored:\t' + player.score + '\tavarage:\t' + (player.score / player.games));
				})
			}
			
		}).fail(function (err) {
			console.log(err.stack);
		});
	}

}

module.exports = Trainer;