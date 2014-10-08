var Q = require('q');
//Arthor: P. S. Wille

function Mini(id) {

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

        var score = 0;

        score += p.board.players[opponent].hits * 3.5;
        score += p.board.players[self.id].bearedOff * 12;

        p.board.players[self.id].checkers.forEach(function (numCheckers, tile) {
            if (numCheckers === 1) {
                score -= (0.2 * tile);
            }
            if (numCheckers >= 2 && tile > 0 && p.board.players[self.id].checkers[tile - 1] >= 2) {
                score += 1;
            }

        });

        if (p.board.players[self.id].checkers[16] > 2) {
            score += 1;
        }
        if (p.board.players[self.id].checkers[17] > 2) {
            score += 1;
        }
        if (p.board.players[self.id].checkers[18] > 2) {
            score += 1;
        }
        p.score = score;

    }

    function findBestPermutation(permutations) {

        permutations.forEach(applyScoreToPermutation);

        permutations.sort(function (a, b) {
            return b.score - a.score;
        });
        //console.log('Moves found:' + permutations.length);
        //if (permutations.length > 1000)
        //{

        //    for (var p = 0; p < 100; p++) 
        //    {
        //        console.log(permutations[p].board.players[0].checkers)
        //    }
        //}

        return permutations[0].moves;

    }

}

module.exports = Mini;