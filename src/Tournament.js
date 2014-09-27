var Events = require('events');
var Game = require('./Game');
var TournamentResult = require('./TournamentResult');
var Q = require('q');

function Tournament () {

	var self = this;

	self.players = [];
	self.result = new TournamentResult(this);

	this.addPlayer = function (controller, name) {
		self.players.push({
			name: name,
			controller: controller
		});
	}

	this.start = function (matches) {

		self.emit('starting');

		var matches = matches || 1;
		var games = [];
		var done = 0;

		for (var i = 0; i < matches; i++) {

			self.players.sort(function (a, b) {
				var game = new Game();
				game.setController(new a.controller(), a.name);
				game.setController(new b.controller(), b.name);
				var gamePromise = game.start();
				games.push(gamePromise);
				gamePromise.then(function (result) {
					done++;
					self.emit('progress', Math.round((done / games.length) * 100) / 100, result);
				});
				return 1;
			});
		}

		self.emit('started', games.length);

		Q.all(games).then(function () {
			self.emit('end');
			self.emit('result', self.result.result);
		});
	}

}

Tournament.prototype.__proto__ = Events.EventEmitter.prototype;

module.exports = Tournament;