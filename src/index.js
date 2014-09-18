module.exports = {

	Board : require('./Board'),
	Dice : require('./Dice'),
	Display: require('./display/ConsoleLogger'),
	Game : require('./Game'),
	Player : require('./Player'),
	Tournament : require('./Tournament'),
	Trainer : require('./Trainer'),

	controllers : {
		Aggressive : require('./controllers/Aggressive'),
		PrimerEndGame : require('./controllers/PrimerEndGame'),
		Random : require('./controllers/Random'),
		Runner : require('./controllers/Runner')
	}

}