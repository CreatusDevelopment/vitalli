import axios from "axios";

export default function deletePatient(callback, data = undefined) {
	axios({
		method: "delete",
		url: "/patient/delete",
		data: data,
	})
		.then((response) => {
			callback(response);
		})
		.catch((error) => {
			callback(error);
		});
}
