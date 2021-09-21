import axios from "axios";

export default function getFinance(callback, params = undefined) {
	axios({
		method: "get",
		url: "/finance/find?" + params,
	})
		.then((response) => {
			callback(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}
