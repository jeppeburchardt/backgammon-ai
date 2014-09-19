var Q = require('q');
var md5 = require('MD5');
var Model = require('./TrailErrorModel');

function TrailErrorAI (id) {

	var self = this;
	self.id = id;
	self.history = [];

	self.model = new Model();
	self.model.setup();

	self.stats = {
		moves: 0,
		recognised: 0
	}


	self.turn = function (dice, board) {

		self.stats.moves ++;

		var deferred = Q.defer();
		var randomPermutation = null;
		var permutations = board.getAllPermutations(self.id, dice);

		var knownStatePromises = permutations.map(function (p) {
			return findKnowState(p);
		});
		Q.all(knownStatePromises).then(function (results) {

			var stop = false;

			results.forEach(function (result) {
				if (result !== undefined && result.length > 0) {
					stop = true;
				}
			});

			// console.log('=========================');

			var filtered  = results.filter(function (r) {
				return r.rows !== undefined && r.rows.length > 0;
			});

			// console.log('filtered', filtered);

			var mapped = filtered.map(function (result) {
				return {
					hash: result.rows[0].hash,
					score: (result.rows.reduce(function (a, b) {
						return (a && b ? a.result + b.result : b.result);
					}, {result:0})),
					moves: result.moves
				}
			});
			// console.log('mapped', mapped);

			mapped.sort(function (a, b) {
				return b.score - a.score;
			});

			var otherOptions = mapped.map(function (o) {
				return o.score;
			});

			if (mapped[0] && mapped[0].score > 0) {
				
				// console.log('  ####  best known move of ('+mapped.length+'):', mapped[0]);
				// console.log('  ####  other options:', otherOptions);
				self.stats.recognised ++;
				deferred.resolve(mapped[0].moves);

			} else {

				var permutations = board.getAllPermutations(self.id, dice);
				var unknownPermutations;

				if (mapped.length > 0) {

					unknownPermutations = permutations.filter(function (p) {
						var h = createStateFromPermutation(p);
						// console.log('checking for bad moves', h);
						var r = mapped.every(function (m) {
							// console.log(' ', m.hash, (m.hash != h));
							return m.hash != h;
						});
						// console.log(' ', r);
						return r;
					});

					if (unknownPermutations.length != permutations.length) {
						self.stats.recognised ++;
					}

					if (unknownPermutations.length == 0) {
						unknownPermutations = permutations;
					}

				} else {
					unknownPermutations = permutations;
				}

				var bestPermutation = findBestPermutation(unknownPermutations);

				// randomPermutation = permutations[Math.floor(Math.random()*permutations.length)];
				self.history.push(createStateFromPermutation(bestPermutation));
				

				deferred.resolve(bestPermutation.moves);

			}



			

		}).fail(function (err) {
		 	console.log('fail', err, err.stack);
		});

		
		
		return deferred.promise;

	}

	this.result = function (score, opponentScore) {


		self.model.saveGame((opponentScore != 0 ? -opponentScore : score), self.history).then(function () {

			console.log('## AI model made', self.model.stats.queries, 'queries and got', self.model.stats.results, 'results');
			console.log('## AI made', self.stats.moves, 'moves, and used past experience', self.stats.recognised, 'times');
			console.log('##', Math.round((self.stats.recognised / self.stats.moves) * 100) + '%');

			self.model.disconnect();

		});

	}

	function __createStateFromPermutation (p) {
		var opponent = 1-self.id;

		var me = p.board.players[self.id].checkers.slice();
		me.push(p.board.players[self.id].hits);
		me.push(p.board.players[self.id].bearedOff);

		var opp = p.board.players[opponent].checkers.slice();
		opp.push(p.board.players[opponent].hits);
		opp.push(p.board.players[opponent].bearedOff);

		var boardString = me.concat(opp).join('_');
		return md5(boardString);
	}

	function createStateFromPermutation (p) {
		var opponent = 1-self.id;

		function mapper (t) {
			return t > 1 ? 2 : t;
		}

		var me = p.board.players[self.id].checkers.slice().map(mapper);
		var opp = p.board.players[opponent].checkers.slice().map(mapper);
		
		var boardString = me.concat(opp).join('_');
		return md5(boardString);
	}

	function findKnowState (p) {
		var deferred = Q.defer();
		var hash = createStateFromPermutation(p);

		self.model.getStates(hash).then(function (rows) {

			deferred.resolve({rows:rows, moves:p.moves});

		}).fail(function (err) {

			deferred.reject(err);

		});

		// console.log('Sarching for ', hash);
		// self.db.serialize(function () {
		// 	self.db.all('SELECT result, hash FROM games LEFT JOIN states on states.game = games.id WHERE hash = ?', hash, function (err, rows) {
		// 		if (!err && rows.length > 0) {
		// 			// console.log('Results for ', hash, rows);
		// 		}
		// 		if (err) {
		// 			console.log('SELECT', err);
		// 		}
		// 		deferred.resolve({rows:rows, moves:p.moves});
		// 	});
		// });
		return deferred.promise;
	}



	





	function applyScoreToPermutation (p) {

		var opponent = 1-self.id;

		var score = p.board.players[opponent].hits * 10;
		score += p.board.players[self.id].bearedOff * 11;

		p.board.players[self.id].checkers.forEach(function (numCheckers, tile) {
			if (numCheckers === 1) {
				score -= 0.5;
			}
		});

		p.score = score;

	}

	function findBestPermutation (permutations) {

		permutations.forEach(applyScoreToPermutation);

		permutations.sort(function (a, b) {
			return b.score - a.score;
		});

		// console.log('Best move: ' + permutations[0].score, permutations[0].moves);

		return permutations[0];

	}
}


module.exports = TrailErrorAI;