import axios from "axios";

export default function editUser(callback, data = undefined, id) {
	axios({
		method: "post",
		url: "/patient/edit/" + id,
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
