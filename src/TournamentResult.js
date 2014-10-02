function TournamentResult(tournament) {

	var self = this;

	self.tournament = tournament;
	self.results = [];
	self.result = [];

	self.tournament.on('progress', function (progress, gameResult) {
		self.results.push(gameResult.players[0]);
		self.results.push(gameResult.players[1]);
	});

	function average (results, property) {
		var sum = results.reduce(function (a, b) { return a + b[property]; }, 0);
		return sum / results.length;
	};

	

	self.tournament.on('end', function () {
		
		self.tournament.players.forEach(function(p){
			var name = p.name;
			var playerResults = self.results.filter(function (r) {return r.name == name });

			self.result.push({
				name: name,
				score: average(playerResults, 'score'),
				victories: average(playerResults, 'victories'),
				eyes: average(playerResults, 'eyes2'),
				time: average(playerResults, 'time'),
				pips: average(playerResults, 'pips'),
				moves: average(playerResults, 'moves'),
				blockedOpponentMoves: average(playerResults, 'blockedOpponentMoves'),
				blockedMoves: average(playerResults, 'blockedMoves')
			});
		});

		self.result.sort(function (a, b) {
			return b.score - a.score;
		});
	});
}

module.exports = TournamentResult;