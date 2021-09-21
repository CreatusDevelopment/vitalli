export default function undoPreDelete(
	Row,
	setRow,
	setSnack,
	localStorageName = ""
) {
	setSnack(false);
	let temp = JSON.parse(localStorage.getItem(localStorageName));
	localStorage.removeItem(localStorageName);

	for (let i = 0; i < Row.length; i++) {
		for (let j = 0; j < temp.length; j++) {
			if (Row[i].id === temp[j]) {
				let copy = Row.slice();
				copy[i].state = " ";
				setRow(copy);
			}
		}
	}
}
