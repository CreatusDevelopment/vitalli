import axios from "axios";

export default function login(callback, data = undefined) {
	axios({
		method: "post",
		url: "/user/login",
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
