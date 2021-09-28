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
				//let copy = null;
				//for (let i = 0; i < Rows.length; i++) {
				//	for (let j = 0; j < temp.length; j++) {
				//		if (Rows[i].id === temp[j]) {
				//			if (copy === null) copy = Rows.slice();
				//			copy.splice(i, 1);
				//		}
				//	}
				//}
				//setRows(copy);
				console.log(Rows);
				let copy = [];
				for (let i = 0; i < Rows.length; i++) {
					let result = temp.filter((id) => id === Rows[i].id);
					if (result.length === 0) {
						copy.push(Rows[i]);
					}
				}
				setRows(copy);
				console.log(Rows);
				localStorage.removeItem(localStorageName);
			} else {
				setErr(true);
				localStorage.removeItem(localStorageName);
			}
		},
		{ ids: JSON.parse(localStorage.getItem(localStorageName)) }
	);
}
