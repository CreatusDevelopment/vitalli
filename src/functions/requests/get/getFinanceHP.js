import axios from "axios";

export default function getFinanceHP(callback, params = undefined) {
	axios({
		method: "get",
		url: "/finance/find/healthplan?" + params,
	})
		.then((response) => {
			callback(response);
		})
		.catch((error) => {
			console.log(error);
		});
}
