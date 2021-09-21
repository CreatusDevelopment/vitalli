import axios from "axios";

export default function deleteUndoPatient(callback, data = undefined) {
	axios({
		method: "post",
		url: "/patient/delete/undo",
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
