import axios from "axios";

export default function getFinance(callback, params = undefined) {
	axios({
		method: "get",
		url: "/finance/find?" + params,
	})
		.then((response) => {
			callback(response);
		})
		.catch((error) => {
			console.log(error);
		});
}
