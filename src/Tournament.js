var Game = require('./Game.js');
var Q = require('q');

function Tournament () {

	var self = this;

	self.players = [];

	this.addPlayer = function (controller, name) {

		self.players.push({
			name: name,
			controller: controller,
			score: 0,
			games: 0
		});
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

	this.start = function (matches) {

		var matches = matches || 1;
		var games = [];

		for (var i = 0; i < matches; i++) {

			// use sort to run one match between every player

			self.players.sort(function (a, b) {
				console.log(a.name + ' vs ' + b.name + ' started game ' + (i+1));
					
				var game = new Game();
				game.setController(a.controller, a.name);
				game.setController(b.controller, b.name);
				var gamePromise = game.start();
				games.push(gamePromise);
				gamePromise.then(function (result) {
					console.log(game.board.players[0].name + ' vs ' + game.board.players[1].name + ' ended ' + result[0] + '-' + result[1]);
					addScoreToPlayer(game.board.players[0].name, result[0]);
					addScoreToPlayer(game.board.players[1].name, result[1]);
				});
				return 1;
			});
		}

		console.log('Started ' + games.length + ' games...');

		Q.all(games).then(function () {
			console.log('All games completed!');
			self.players.sort(function (a, b) { return b.score - a.score; });
			self.players.forEach(function (player) {
				console.log(player.name + '\tscored:\t' + player.score + '\tavarage:\t' + (player.score / player.games));
			})
		});
	}

}

module.exports = Tournament;