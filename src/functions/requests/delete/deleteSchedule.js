import axios from "axios";

export default function deleteSchedule(callback, data = undefined) {
	axios({
		method: "delete",
		url: "/schedule/delete",
		data: data,
	})
		.then((response) => {
			callback(response);
		})
		.catch((error) => {
			callback(error);
		});
}
