function loggedReducer(
	state = localStorage.getItem("isLogged") ?? false,
	action
) {
	switch (action.type) {
		case "LOGGEDIN":
			return true;

		case "LOGGEDOUT":
			return false;

		default:
			return state;
	}
}

export default loggedReducer;
