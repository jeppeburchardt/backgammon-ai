var Table = require('cli-table');

function TournamentTable (tournament) {

	var self = this;

	self.tournament = tournament;

	self.tournament.on('started', function (gameNum) {
		process.stdout.write('started ' + gameNum + ' games');
	});

	self.tournament.on('progress', function (progress) {
		process.stdout.write('\u001B[0E'); //move to start
		process.stdout.write('\u001B[0J'); //clear line
		process.stdout.write('Running tournament ' + Math.ceil(progress*100) + '% complete');
	});

	self.tournament.on('result', function (result) {
		var table = new Table({
			head: ['Name', 'Score', 'Eyes', 'Time', 'Pips', 'Moves', 'Blocked Opponent', 'Blocked']
		});
		table.push.apply(table, result.map(function (r) {
			return [r.name, r.score, r.eyes, r.time, r.pips, r.moves, r.blockedOpponentMoves, r.blockedMoves];
		}));
		process.stdout.write('\u001B[0E'); //move to start
		process.stdout.write('\u001B[0J'); //clear line
		process.stdout.write(table.toString() + '\n\r');
	});
}

module.exports = TournamentTable;