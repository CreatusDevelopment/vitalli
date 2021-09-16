import loggedReducer from "./isLogged";
import setUserEmail from "./setUserEmail";
import setUserName from "./setUserName";
import { combineReducers } from "redux";

const allReducers = combineReducers({
	isLogged: loggedReducer,
	email: setUserEmail,
	name: setUserName,
});

export default allReducers;
