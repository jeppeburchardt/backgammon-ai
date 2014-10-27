module.exports = {

	Board : require('./Board'),
	Dice : require('./Dice'),
	Display: require('./display/ConsoleLogger'),
	Game : require('./Game'),
	Player : require('./Player'),
	Tournament : require('./Tournament'),
	Trainer : require('./Trainer'),
	SandBoxController: require('./sandbox/SandBoxController'),

	controllers : {
		Aggressive : require('./controllers/Aggressive'),
		PrimerEndGame : require('./controllers/PrimerEndGame'),
		PrimerEndGame2 : require('./controllers/PrimerEndGame2'),
		Random : require('./controllers/Random'),
		Runner : require('./controllers/Runner')
		// NotBetterWithGetScore: require/('./controllers/NotBetterWithGetScore'),
		// NotBetterWith357: require/('./controllers/NotBetterWith357'),
		// TestA: require/('./controllers/TestA'),
		// TestB: require/('./controllers/TestB')
	}

}