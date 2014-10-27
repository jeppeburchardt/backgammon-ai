exports.api = {

	_state: {},

	getState: function () {
		return _state;
	},


	setState: function (state) {
		_state = state;
	},

	log: function (obj) {
		runTask('log', obj);
	}

}