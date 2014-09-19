
function AbstractController(id) {


	this.turn = function (dice, board) {

		throw new Error("Controller must implement \"turn\" method");

	}

	this.result = function (score, opponentScore) {
		//...
	}


}


module.exports = AbstractController;