var Q = require('q');
//Arthor: P. S. Wille

function PrimerEndGame(id) {

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

    function applyScoreToPermutation(p) {

        var opponent = 1 - self.id;
        var lowestPositionOfOpponent = self.lowestPositionOfOpponent(p.board);
        var lowestPosition = self.lowestPositionOfSelf(p.board);

        var endgame = lowestPositionOfOpponent < lowestPosition;

        var score = 0;


        score += p.board.players[self.id].bearedOff * 12;

        if (endgame) {
            score += 4;

            //everybodys home
            score += (24 - lowestPosition) > 6 ? 20 : 0;

            var tilesOccupied = (24 - lowestPosition) > 6 ? (24 - lowestPosition) : 6;

            var DistributionGoal = tilesOccupied / (15 - p.board.players[self.id].bearedOff);

            p.board.players[self.id].checkers.forEach(function (numCheckers, tile) {
                score -= Math.abs(DistributionGoal + numCheckers);

            });
        }
        else {

            score += p.board.players[opponent].hits * 3.5;

            p.board.players[self.id].checkers.forEach(function (numCheckers, tile) {
                if (numCheckers == 1) {
                    score -= (0.2 * tile);

                    //Home is exposed so its bad to hit
                    if (tile > 16 && p.board.players[opponent].hits > 0) {
                        score -= 2;
                    }
                }
                //Home is blocked so its good to hit
                if (numCheckers >= 2 && tile > 17 && p.board.players[opponent].hits > 0) {
                    score += 1;
                }
                if (numCheckers >= 2 && tile > 0 && p.board.players[self.id].checkers[tile - 1] >= 2) {
                    score += 1;
                }

            });
            if (p.board.players[self.id].checkers[23] >= 2 && p.board.players[self.id].checkers[24] >= 2) {
                score += 1;
            }

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
        var lowestPositionOfSelf = getlowestPosition(board.players[1 - self.id].checkers);

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

}


module.exports = PrimerEndGame;