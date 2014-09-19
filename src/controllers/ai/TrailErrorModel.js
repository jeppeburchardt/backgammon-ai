/* global require: true, module: true */
'use strict';

var Q = require('q');
var mysql = require('mysql');
var config = require('config');

function Model() {

	var self = this;
	var connection = mysql.createConnection({
		host: config.mysql.host,
		user: config.mysql.user,
		port: config.mysql.port,
		database: config.mysql.database,
		password: config.mysql.password
	});

	self.stats = {
		queries: 0,
		results: 0
	}
	
	this.connect = function () {
		var deferred = Q.defer();
		connection.connect(function (error) {
			if (error) {
				deferred.reject(new Error(error));
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	};

	this.disconnect = function () {
		connection.end();
	}

	this.query = function (sql, params) {
		var deferred = Q.defer();
		var start = Date.now();
		var r = connection.query(sql, params, function(error, rows, fields) {
			if (error) {
				console.log('mysql >> ERROR: ', error);
				deferred.reject(error);
			} else {
				deferred.resolve(rows);
			}
		});
		// console.log('mysql >> query took ' + (Date.now() - start) + 'ms');
		// console.log('mysql >>', r.sql);
		return deferred.promise;
	};

	//TODO: http://stackoverflow.com/questions/504268/mysql-binary-against-non-binary-for-hash-ids

	this.setup = function () {
		return self.query('CREATE TABLE IF NOT EXISTS states (id int(11) NOT NULL AUTO_INCREMENT, game int(11), hash varchar(255), PRIMARY KEY (`id`), KEY `text` (`hash`))')
			.then(self.query('CREATE TABLE IF NOT EXISTS games (id int(11) NOT NULL AUTO_INCREMENT, result int(11), PRIMARY KEY (`id`))'));
	};

	this.saveGame = function (score, history) {
		return self.query('INSERT INTO games (result) VALUES (?)', [score])
			.then(function (result) {
				var gameId = result.insertId
				return Q.all(history.map(function (state) {
					return self.query('INSERT INTO states (game, hash) VALUES (?, ?)', [gameId, state]);
				}));
			});
	};

	this.getStates = function (hash) {
		return self.query('SELECT result, hash FROM games LEFT JOIN states on states.game = games.id WHERE hash = ?', [hash])
			.then(function (rows) {
				self.stats.queries ++;
				self.stats.results += rows.length;
				return rows;
			});
	}


}

module.exports = Model;