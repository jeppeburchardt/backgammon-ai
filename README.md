backgammon-ai
=============

````
npm install
npm test
npm link
````

Running standalone
==================
Tournament
----------
Run 10 matches against each player/controller
````
bgai tournament -g 10 Aggressive PrimerEndGame Safe
````
Game
----
Watch a match with stunning graphics
````
bgai game -d 200 Aggressive PrimerEndGame
````
Trainer
-------
Run 100 matches against one or more players/controllers
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
