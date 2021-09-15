import axios from "axios";

export default function getHealthPlan(callback, params = undefined) {
	axios({
		method: "get",
		url: "/healthplan/find",
	})
		.then((response) => {
			callback(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}
