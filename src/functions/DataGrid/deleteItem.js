export default function deleteItem(
	Rows,
	setRows,
	Selected,
	deleteCallback,
	localStorageName = "",
	setErr
) {
	//Check once more if the Row isnt already deleted or confirmed
	for (let i = 0; i < Rows.length; i++) {
		for (let j = 0; j < Selected.length; j++) {
			if (Rows[i].id === Selected[j]) {
				if (Rows[i].state === "confirmed" || Rows[i].state === true) {
					alert("voce nao pode deletar uma agenda confirmada!");
					return;
				}
			}
		}
	}

	deleteCallback(
		function (e) {
			if (e?.data) {
				let temp = JSON.parse(localStorage.getItem(localStorageName));
				let copy = null;
				for (let i = 0; i < Rows.length; i++) {
					for (let j = 0; j < temp.length; j++) {
						if (Rows[i].id === temp[j]) {
							if (copy === null) copy = Rows.slice();
							copy.pop(i);
						}
					}
				}
				setRows(copy);
				localStorage.removeItem(localStorageName);
			} else {
				setErr(true);
				localStorage.removeItem(localStorageName);
			}
		},
		{ ids: JSON.parse(localStorage.getItem(localStorageName)) }
	);
}
