import axios from "axios";

export default function editTenant(callback, data = undefined, id) {
	axios({
		method: "post",
		url: "/user/edit/" + id,
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
