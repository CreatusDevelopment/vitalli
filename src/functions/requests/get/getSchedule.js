import axios from "axios";

export default function getSchedule(callback, params = undefined) {
	axios({
		method: "get",
		url: "/schedule/get",
		params: params,
	})
		.then((response) => {
			callback(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}
