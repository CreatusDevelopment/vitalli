import React, { useEffect, useState } from "react";
import {
	createTheme,
	ThemeProvider,
	makeStyles,
} from "@material-ui/core/styles";
import {
	Delete as DeleteIcon,
	Close as CloseIcon,
	Add as AddIcon,
} from "@material-ui/icons";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarExport,
	ptBR,
} from "@mui/x-data-grid";
import {
	getPatient,
	createPatient,
	deletePatient,
	preDeleteItem,
	deleteItem,
	undoPreDelete,
	editUser,
	deleteUndoPatient,
} from "../../functions";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Button,
	Snackbar,
	IconButton,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import "./styles.scss";

const theme = createTheme(
	{
		palette: {
			primary: { main: "#1976d2" },
		},
	},
	ptBR
);

const columns = [
	{ field: "name", headerName: "Nome", width: 250, editable: true },
	{
		field: "birthday",
		headerName: "Nascimento",
		type: "date",
		width: 160,
		editable: true,
		valueFormatter: (params) => {
			let date = new Date(params.value);
			return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${
				+date.getMonth() + 1 < 10
					? "0" + (+date.getMonth() + 1)
					: +date.getMonth() + 1
			}/${date.getFullYear()}`;
		},
	},
	{
		field: "rg",
		headerName: "RG",
		width: 150,
		editable: true,
		type: "number",
	},
	{
		field: "contact",
		headerName: "Contato",
		width: 150,
		editable: true,
	},
	{
		field: "address",
		headerName: "Endereço",
		width: 150,
		editable: true,
	},
	{
		field: "cep",
		headerName: "CEP",
		width: 150,
		editable: true,
		type: "number",
	},

	{
		field: "guideId",
		headerName: "Nº Guia",
		width: 150,
		editable: true,
		valueGetter: (params) => {
			if (params.value !== undefined) return params.value;
			return params.row.guide.id;
		},
	},
	{
		field: "guideValue",
		headerName: "Saldo",
		width: 150,
		editable: true,
		type: "number",
		valueGetter: (params) => {
			if (params.value !== undefined) return params.value;
			return params.row.guide.value;
		},
	},
];

const useStyles = makeStyles({
	root: {
		"& .disabled": {
			color: "rgba(0,0,0,0.5)",
			cursor: "not-allowed",
		},
	},
});

export default function Pacientes() {
	const localStorageName = "deleteUser";

	const [Rows, setRows] = useState([]);
	const [Loading, setLoading] = useState(false);
	const [Open, setOpen] = useState(false);
	const [Selected, setSelected] = useState([]);
	const [Err, setErr] = useState(false);
	const [Err2, setErr2] = useState(false);
	const [Err3, setErr3] = useState(false);
	const [Err4, setErr4] = useState(false);
	const [Snack, setSnack] = useState(false);
	const [Name, setName] = useState("");
	const [Rg, setRg] = useState("");
	const [Birthday, setBirthday] = useState("");
	const [Contact, setContact] = useState("");
	const [Address, setAddress] = useState("");
	const [Cep, setCep] = useState("");
	const [GuideId, setGuideId] = useState("");
	const [GuideValue, setGuideValue] = useState(10);

	useEffect(() => {
		setRows([]);
		setLoading(true);
		getPatient((e) => {
			console.log(e);
			setRows(e);
			setLoading(false);
		});
	}, []);

	function CustomToolbar() {
		return (
			<GridToolbarContainer>
				<GridToolbarExport
					csvOptions={{
						fields: ["name", "birthday", "contact", "address", "cep", "rg"],
						delimiter: ";",
					}}
				/>

				<Button
					className="confirm-button datagrid-button"
					size="small"
					color="primary"
					startIcon={<AddIcon />}
					onClick={() => {
						setOpen(true);
					}}
				>
					Adicionar
				</Button>

				<Button
					className="delete-button datagrid-button"
					size="small"
					color="primary"
					startIcon={<DeleteIcon />}
					onClick={() => {
						handleDeleteUser();
					}}
				>
					Deletar
				</Button>
			</GridToolbarContainer>
		);
	}

	function handleAddUser(ev) {
		ev.preventDefault();
		setOpen(false);
		createPatient(
			(e) => {
				if (e?.data) {
					getPatient((e) => {
						console.log(e);
						setRows(e);
						setLoading(false);
					});
					console.log(e.data);
				} else {
					if (e.response.data.message === "RG já cadastrado porém deletado") {
						setErr3(true);
					} else {
						setErr4(true);
					}
				}
			},
			{
				name: Name,
				rg: Rg,
				birthday: Birthday,
				contact: Contact,
				address: Address,
				cep: Cep,
				guide: {
					id: GuideId,
					value: GuideValue,
				},
			}
		);
	}

	function handleDeleteUser() {
		preDeleteItem(
			Rows,
			setRows,
			Selected,
			setSelected,
			setErr,
			setSnack,
			localStorageName
		);
	}

	function deleteUser() {
		deleteItem(
			Rows,
			setRows,
			Selected,
			deletePatient,
			localStorageName,
			setErr2
		);
	}

	const classes = useStyles();

	return (
		<div className={"pacientes-container " + classes.root}>
			<div>
				<Dialog
					open={Open}
					onClose={() => {
						setOpen(false);
					}}
				>
					<form onSubmit={handleAddUser}>
						<DialogTitle>Adicionar Paciente</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Para adicionar um paciente complete os campos abaixo com as
								informações requeridas.
							</DialogContentText>
							<div className="user-input-outter">
								<TextField
									className="add-user-input"
									id="Nome"
									label="Nome"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setName(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="RG"
									label="RG"
									variant="outlined"
									type="number"
									required
									onChange={(e) => {
										setRg(e.target.value);
									}}
								/>
								<TextField
									Style="width:223px;"
									className="add-user-input"
									id="Nascimento"
									variant="outlined"
									type="date"
									required
									onChange={(e) => {
										setBirthday(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="Contato"
									label="Contato"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setContact(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="Endereco"
									label="Endereço"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setAddress(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="CEP"
									label="CEP"
									variant="outlined"
									type="number"
									required
									onChange={(e) => {
										setCep(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="IDdaGuia"
									label="ID da Guia"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setGuideId(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="Saldo"
									label="Saldo"
									variant="outlined"
									type="number"
									required
									onChange={(e) => {
										setGuideValue(e.target.value);
									}}
								/>
							</div>
						</DialogContent>
						<DialogActions>
							<Button
								variant="outlined"
								color="primary"
								onClick={() => {
									setOpen(false);
								}}
							>
								Cancelar
							</Button>
							<Button variant="contained" color="primary" type="submit">
								Adicionar
							</Button>
						</DialogActions>
					</form>
				</Dialog>
				<Snackbar
					open={Snack}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnack(false);
						deleteUser();
					}}
					message="Paciente deletado"
					action={
						<>
							<Button
								color="secondary"
								size="small"
								onClick={(e, r) => {
									if (r === "clickaway") return;
									undoPreDelete(Rows, setRows, setSnack, localStorageName);
								}}
							>
								DESFAZER
							</Button>
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={(e, r) => {
									if (r === "clickaway") return;
									setSnack(false);
									deleteUser();
								}}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</>
					}
				/>
				<Snackbar
					open={Err4}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setErr4(false);
					}}
				>
					<Alert variant="filled" severity="error">
						Esse paciente já está registrado.
					</Alert>
				</Snackbar>
				<Snackbar
					open={Err3}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setErr3(false);
					}}
				>
					<Alert variant="filled" severity="error">
						ERRO: RG já cadastrado porém deletado.
						{"   "}
						<>
							<Button
								color="inherit"
								size="small"
								onClick={(e, r) => {
									if (r === "clickaway") return;
									deleteUndoPatient(window.location.reload(), { rg: Rg });
								}}
							>
								RESTAURAR
							</Button>
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={(e, r) => {
									if (r === "clickaway") return;
									setErr3(false);
								}}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</>
					</Alert>
				</Snackbar>
				<Snackbar
					open={Err2}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setErr2(false);
					}}
				>
					<Alert variant="filled" severity="error">
						Erro ao deletar.
					</Alert>
				</Snackbar>
				<Snackbar
					open={Err}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setErr(false);
					}}
				>
					<Alert variant="filled" severity="error">
						Erro ao deletar.
					</Alert>
				</Snackbar>
			</div>
			<ThemeProvider theme={theme}>
				<DataGrid
					loading={Loading}
					components={{
						Toolbar: CustomToolbar,
					}}
					rows={Rows}
					columns={columns}
					pageSize={100}
					rowsPerPageOptions={[10, 25, 50, 100, 200]}
					selectionModel={Selected}
					onSelectionModelChange={(e) => {
						setSelected(e);
					}}
					checkboxSelection
					disableSelectionOnClick
					isRowSelectable={(params) => params.row.state !== "deleted"}
					onCellEditCommit={(e) => {
						//console.log(e.value);
						//console.log(e.id);
						//console.log(e.field);
						editUser(console.log, { [e.field]: e.value }, e.id);
					}}
					getRowClassName={(e) => {
						if (e.row.state === "deleted") return "disabled";
						return " ";
					}}
				/>
			</ThemeProvider>
		</div>
	);
}
