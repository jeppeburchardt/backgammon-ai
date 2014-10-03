var Q = require('q');
//Arthor: P. S. Wille

function TestB(id) {

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

        var endgame = lowestPositionOfOpponent < lowestPosition;
        

        var score = 0;


        
        
        //Opennings based on http://www.bkgm.com/openings.html
        if (equals(p.board.players[opponent].checkers,[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0]) === true) {
           
            //2-1...13/11, 6/5
            if (equals(p.board.players[self.id].checkers, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 3, 0, 4, 1, 0, 0, 0, 0]) === true) {
                    //console.log("2-1");
                    p.score = 1;
                    return;
                }
            //3-1...8/5, 6/5
            if (equals(p.board.players[self.id].checkers, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 2, 0, 4, 2, 0, 0, 0, 0]) === true) {
                //console.log("3-1");
                    p.score = 1;
                    return;
                }
            //3-2...13/11, 13/10
            if (equals(p.board.players[self.id].checkers, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 1, 0, 3, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("3-2");
                    p.score = 1;
                    return;
            }
            //4-1...24/23, 13/9
            if (equals(p.board.players[self.id].checkers, [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 3, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("4-1");
                    p.score = 1;
                    return;
            }
            //4-2...8/4, 6/4
            if (equals(p.board.players[self.id].checkers, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 2, 0, 4, 0, 2, 0, 0, 0]) === true) {
                //console.log("4-2");
                    p.score = 1;
                    return;
            }
            //4-3...13/10, 13/9
            if (equals(p.board.players[self.id].checkers, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 1, 3, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("4-3");
                p.score = 1;
                return;
            }
            //5-1...24/23, 13/8
            if (equals(p.board.players[self.id].checkers, [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("5-1");
                p.score = 1;
                return;
            }
            //5-2...24/22, 13/8
            if (equals(p.board.players[self.id].checkers, [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("5-2");
                p.score = 1;
                return;
            }
            //5-3...8/3, 6/3
            if (equals(p.board.players[self.id].checkers, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 2, 0, 4, 0, 0, 2, 0, 0]) === true) {
                //console.log("5-3");
                p.score = 1;
                return;
            }
            //5-4...24/20, 13/8
            if (equals(p.board.players[self.id].checkers, [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("5-4");
                p.score = 1;
                return;
            }
            //6-1...13/7, 8/7
            if (equals(p.board.players[self.id].checkers, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 2, 2, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("6-1");
                p.score = 1;
                return;
            }
            //6-2...24/18, 13/11
            if (equals(p.board.players[self.id].checkers, [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 1, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("6-2");
                p.score = 1;
                return;
            }
            //6-3...24/18, 13/10
            if (equals(p.board.players[self.id].checkers, [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 1, 0, 3, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("6-3");
                p.score = 1;
                return;
            }
            //6-4...8/2, 6/2
            if (equals(p.board.players[self.id].checkers, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 2, 0]) === true) {
                //console.log("6-4");
                p.score = 1;
                return;
            }
            //6-5...24/13  
            if (equals(p.board.players[self.id].checkers, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0]) === true) {
                //console.log("6-5");
                p.score = 1;
                return;
            }
            p.score = 0;
            return;
         }
            
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
                // Priming a long chain of blocked tiles is good
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

}

module.exports = TestB;