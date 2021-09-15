import axios from "axios";

export default function newPassowrd(
	callback,
	data = undefined,
	id = undefined
) {
	axios({
		method: "post",
		url: "/user/new/password/" + id,
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
