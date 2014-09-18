backgammon-ai
=============

````
npm install
npm test
npm link
````

Rinning standalone
==================
Tournament
````
bgai tournament -g 10 Aggressive PrimerEndGame Safe
````
Game
````
bgai game -d 200 Aggressive PrimerEndGame
````
Trainer
````
bgai trainer -g 100 Aggressive PrimerEndGame
````

As a module
===========
````javascript
var bg = require('backgammon-ai');

var game = new bg.Game(200);
var display = new bg.Display(game);
game.setController(bg.controllers.Aggressive, 'Aggressive');
game.setController(bg.controllers.PrimerEndGame, 'PrimerEndGame');
game.start();
````
