import axios from "axios";

export default function deleteTenant(callback, data = undefined) {
	axios({
		method: "delete",
		url: "/user/delete",
		data: data,
	})
		.then((response) => {
			callback(response);
		})
		.catch((error) => {
			callback(error);
		});
}
