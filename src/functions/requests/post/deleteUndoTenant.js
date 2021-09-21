import axios from "axios";

export default function deleteUndoTenant(callback, data = undefined) {
	axios({
		method: "post",
		url: "/user/delete/undo",
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
