import React from "react";
import ReactDOM from "react-dom";
import "./style/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore } from "redux";
import allReducers from "./redux/reducers";
import { Provider } from "react-redux";
import axios from "axios";

axios.defaults.baseURL = "https://creatus.net.br:5000/";

const itemStr = localStorage.getItem("token");
const item = JSON.parse(itemStr);
if (itemStr) {
	const now = new Date();
	if (now.getTime() > item.expiry) {
		localStorage.removeItem("token");
		localStorage.removeItem("isLogged");
	} else {
		axios.defaults.headers.common["Authorization"] = item.value;
		setTimeout(() => {
			window.location.reload();
		}, 86400 * 1000);
	}
}

const store = createStore(
	allReducers,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
