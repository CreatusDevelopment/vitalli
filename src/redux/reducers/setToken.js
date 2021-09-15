function setToken(state = localStorage.getItem("token") ?? "", action) {
	switch (action.type) {
		case "SETTOKEN":
			return action.token;

		default:
			return state;
	}
}

export default setToken;
