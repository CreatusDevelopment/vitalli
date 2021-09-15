import axios from "axios";

export default function confirmSchedule(callback, data = undefined) {
	axios({
		method: "post",
		url: "/schedule/confirm",
		data: data,
	})
		.then(async (response) => {
			callback(response);
		})
		.catch(function (error) {
			callback(error);
		});
}
