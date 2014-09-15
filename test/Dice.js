var assert = require('assert');
var Dice = require('../src/Dice');

var dice = null;

beforeEach(function(){
	dice = new Dice();
});

describe('Dice', function () {

	it('should return an array of two', function () {
		var roll = dice.roll();
		assert.equal(roll.length, 2);
	});

	it('should convert a roll of doubles to four moves', function () {
		var roll = [4, 4];
		assert.equal(dice.rollToMoves(roll).length, 4);
	});

	it('should convert a roll to two moves', function () {
		var roll = [5, 3];
		assert.equal(dice.rollToMoves(roll).length, 2);
	});

});