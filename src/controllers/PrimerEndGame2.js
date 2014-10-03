var Q = require('q');
//Arthor: P. S. Wille

function PrimerEndGame2(id) {

    var self = this;
    self.id = id;

    this.turn = function (dice, board) {

        var deferred = Q.defer();
        var result = [];
        var permutations = board.getAllPermutations(self.id, dice);

        result = findBestPermutation(permutations);

        //setTimeout(function(){
        deferred.resolve(result);
        //}, 50);

        return deferred.promise;
    }
    function equals(array1, array2) {
        // if the other array is a falsy value, return
        if (!array1)
            return false;

        // compare lengths - can save a lot of time 
        if (array1.length != array2.length)
            return false;

        for (var i = 0, l = array1.length; i < l; i++) {
            // Check if we have nested arrays
            if (array1[i] instanceof Array && array2[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array2[i]))
                    return false;
            }
            else if (array1[i] != array2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }
    function applyScoreToPermutation(p) {
        var opponent = 1 - self.id;
        var lowestPositionOfOpponent = self.lowestPositionOfOpponent(p.board);
        var lowestPosition = self.lowestPositionOfSelf(p.board);
        var checkersOnBoard = (15 - p.board.players[self.id].bearedOff);
        var pip = getPip(p.board.players[self.id].checkers);
        var pipOfOpponent = getPip(p.board.players[opponent].checkers);

        var endgame = lowestPositionOfOpponent < lowestPosition;

        var score = 0;


        if (endgame) {
            if (pip > pipOfOpponent + 10) {
                score += 40;
            }
            else {
                score += 4;
            }

            var tilesOccupied = (23 - lowestPosition);
            var DistributionGoal = tilesOccupied / checkersOnBoard;

            //playing to get a 3-5-7 at home and even distribution outside 
            p.board.players[self.id].checkers.forEach(function (numCheckers, tile) {
                if (tile >= 18) {
                    score -= Math.abs(7.4 - 2.4 * (tile - 18) - numCheckers);
                } else {
                    score -= Math.abs(DistributionGoal - numCheckers);
                }
                //Pip score
                score -= 0.5 * pip;


            });
        }
        else {

            score += p.board.players[opponent].hits * 3.5;
            var exposed = 0;
            p.board.players[self.id].checkers.forEach(function (numCheckers, tile) {
                if (numCheckers == 1) {
                    score -= (0.2 * tile);
                    exposed += 1;

                    //Home is exposed so its bad to hit
                    if (tile > 16 && p.board.players[opponent].hits > 0) {
                        score -= 2;
                    }
                }
                //Home is blocked so its good to hit
                if (numCheckers >= 2 && tile > 17 && p.board.players[opponent].hits > 0) {
                    score += 1;
                }
                // Priming a long chain of blocked tiles is good
                if (numCheckers >= 2 && tile > 0 && p.board.players[self.id].checkers[tile - 1] >= 2) {
                    score += 1;
                }

            });

            //p.board.players[opponent].checkers.forEach(function (numCheckers, tile) {

            //    //opponent home is blocked so its extra bad to be exposed
            //    if (numCheckers >= 2 && tile > 17 ) {
            //        score -= 1* exposed;
            //    }

            //});

            if (p.board.players[self.id].checkers[16] > 2) {
                score += 1;
            }
            if (p.board.players[self.id].checkers[17] > 2) {
                score += 1;
            }
            if (p.board.players[self.id].checkers[18] > 2) {
                score += 1;
            }
        }
        p.score = score;

    }

    function findBestPermutation(permutations) {

        permutations.forEach(applyScoreToPermutation);

        permutations.sort(function (a, b) {
            return b.score - a.score;
        });

        return permutations[0].moves;

    }

    self.lowestPositionOfOpponent = function (board) {
        var lowestPositionOfOpponent = getlowestPosition(board.players[1 - self.id].checkers);
        // reverse direction:
        lowestPositionOfOpponent = 23 - lowestPositionOfOpponent;

        return board.players[1 - self.id].hits > 0 ? 24 : lowestPositionOfOpponent;
    };
    self.lowestPositionOfSelf = function (board) {
        var lowestPositionOfSelf = getlowestPosition(board.players[self.id].checkers);

        return board.players[self.id].hits > 0 ? -1 : lowestPositionOfSelf;

    };
    function getlowestPosition(checkers) {

        var lowestPosition = 0;
        checkers.some(function (num, tile) {
            if (num > 0) {
                lowestPosition = tile;
                return true;
            }
            return false;
        });

        return lowestPosition;
    }
    function getPip(checkers) {
        var pip = 0;
        checkers.forEach(function (numCheckers, tile) {
            //Pip score
            pip += (numCheckers * (24 - tile));


        });

        return pip;
    }
}


module.exports = PrimerEndGame2;