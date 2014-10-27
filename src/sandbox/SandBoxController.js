var Q = require('q');
var Events = require('events');
var SandCastle = require('sandcastle').SandCastle;

var sandcastle = new SandCastle({
	api: __dirname + '/api.js',
	timeout: 10000
});

function SandBoxController (script) {

	var self = this;

	self.id = -1;
	self.script = sandcastle.createScript('var move = exit; var log = function () {runTask("log", {"args":Array.prototype.slice.call(arguments, 0)}); }; ' + script);
	

	self.script.on('exit', function (err, output) {
		if (err) self.emit('script-error', err.message);
	});

	self.script.on('timeout', function () {
		self.emit('script-error', 'Timeout');
	})

	self.script.on('task', function (err, taskName, options, methodName, callback) {
		if (err) {
			self.emit('script-error', err.message);
		} else {
			switch (taskName) {
				case "log":
					//console.log.apply(console, options.args);
					self.emit('log', options.args);
				break;
			}
		}
	});

	this.turn = function (dice, board) {

		var deferred = Q.defer();

		self.script.once('exit', function (err, output) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(output);
			}
		});
		self.script.once('timeout', function () {
			deferred.reject('Timeout');
		});

		self.script.run('turn', {
			permutations: board.getAllPermutations(self.id, dice),
			dice: dice,
			board: board,
			id: self.id
		});

		return deferred.promise;
	}
}

SandBoxController.prototype.__proto__ = Events.EventEmitter.prototype;

module.exports = SandBoxController;