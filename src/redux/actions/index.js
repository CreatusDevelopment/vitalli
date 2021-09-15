export function logIn(state) {
	return {
		type: "LOGGEDIN",
	};
}

export function logOut(state) {
	return {
		type: "LOGGEDOUT",
	};
}

export function _setToken(state) {
	return {
		type: "SETTOKEN",
		token: state,
	};
}
export function _setUserName(state) {
	return {
		type: "SETUSERNAME",
		name: state,
	};
}
export function _setUserEmail(state) {
	return {
		type: "SETUSEREMAIL",
		email: state,
	};
}
