import loggedReducer from "./isLogged";
import setToken from "./setToken";
import setUserEmail from "./setUserEmail";
import setUserName from "./setUserName";
import { combineReducers } from "redux";

const allReducers = combineReducers({
	isLogged: loggedReducer,
	token: setToken,
	email: setUserEmail,
	name: setUserName,
});

export default allReducers;
