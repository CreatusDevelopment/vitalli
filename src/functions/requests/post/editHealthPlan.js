import axios from "axios";

export default function editHealthPlan(callback, data = undefined, id) {
	axios({
		method: "post",
		url: "/healthplan/edit/" + id,
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
