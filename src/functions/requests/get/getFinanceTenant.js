import axios from "axios";

export default function getFinanceTenant(callback, params = undefined) {
	axios({
		method: "get",
		url: "/finance/find/tenant?" + params,
	})
		.then((response) => {
			callback(response);
		})
		.catch((error) => {
			console.log(error);
		});
}
