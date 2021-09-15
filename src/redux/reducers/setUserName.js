function setUserName(state = localStorage.getItem("user_name") ?? "", action) {
	switch (action.type) {
		case "SETUSERNAME":
			return action.name;

		default:
			return state;
	}
}

export default setUserName;
