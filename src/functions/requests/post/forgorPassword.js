import axios from "axios";

export default function forgotPassword(callback, data = undefined) {
	axios({
		method: "post",
		url: "/forgot_password",
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
