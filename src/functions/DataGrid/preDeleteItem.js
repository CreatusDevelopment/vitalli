export default function preDelete(
	Rows,
	setRows,
	Selected,
	setSelected,
	setErr,
	setSnackCallback,
	localStorageName = ""
) {
	//If already deleted or confirmed
	for (let i = 0; i < Rows.length; i++) {
		for (let j = 0; j < Selected.length; j++) {
			if (Rows[i].id === Selected[j]) {
				if (Rows[i].state === "confirmed" || Rows[i].state === true) {
					setErr(true);
					setSelected([]);
					return;
				}
			}
		}
	}

	//Set deleted state true but does not delete it on back-end
	for (let i = 0; i < Rows.length; i++) {
		for (let j = 0; j < Selected.length; j++) {
			if (Rows[i].id === Selected[j]) {
				let copy = Rows.slice();
				copy[i].state = "deleted";
				setRows(copy);
			}
		}
	}

	//Store deleted in localstorage
	if (localStorageName !== "") {
		if (JSON.parse(localStorage.getItem(localStorageName) === null)) {
			localStorage.setItem(localStorageName, JSON.stringify(Selected));
		} else {
			let temp = JSON.parse(localStorage.getItem(localStorageName));
			temp = [...temp, ...Selected];
			localStorage.setItem(localStorageName, JSON.stringify(temp));
		}
		setSelected([]);
		setSnackCallback(true);
	}
}
