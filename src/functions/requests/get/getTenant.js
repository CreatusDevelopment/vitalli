import axios from "axios";

export default function getTenant(callback, params = undefined) {
	axios({
		method: "get",
		url: "/user/find",
	})
		.then((response) => {
			callback(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}
