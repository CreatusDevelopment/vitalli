import axios from "axios";

export default function createHealthPlan(callback, data = undefined) {
	axios({
		method: "post",
		url: "/healthplan/create",
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
