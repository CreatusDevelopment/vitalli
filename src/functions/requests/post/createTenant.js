import axios from "axios";

export default function createTenant(callback, data = undefined) {
	axios({
		method: "post",
		url: "/user/create",
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
