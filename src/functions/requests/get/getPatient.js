import axios from "axios";

export default function getPatient(callback, params = undefined) {
	axios({
		method: "get",
		url: "/patient/find",
	})
		.then((response) => {
			callback(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}
