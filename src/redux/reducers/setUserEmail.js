function setUserEmail(
	state = localStorage.getItem("user_email") ?? "",
	action
) {
	switch (action.type) {
		case "SETUSEREMAIL":
			return action.email;

		default:
			return state;
	}
}

export default setUserEmail;
