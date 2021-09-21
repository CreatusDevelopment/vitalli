import axios from "axios";

export default function createPatient(callback, data = undefined) {
	axios({
		method: "post",
		url: "/patient/create",
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
