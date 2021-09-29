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
	createTenant,
	preDeleteItem,
	deleteItem,
	undoPreDelete,
	deleteUndoTenant,
	getTenant,
	deleteTenant,
	editTenant,
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
	Select,
	MenuItem,
	FormControl,
	InputLabel,
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
		field: "rg",
		headerName: "RG",
		width: 150,
		editable: true,
		type: "number",
	},
	{ field: "email", headerName: "Email", width: 150, editable: true },
	{ field: "crp", headerName: "CRP", width: 150, editable: true },
	{
		field: "type",
		headerName: "Tipo",
		width: 150,
		valueGetter: (params) => {
			if (params.value !== undefined) {
				//return params.value;

				if (params.value === "adm") {
					return "Administrador";
				}
				if (params.value === "tenant") {
					return "Locatário";
				}
				if (params.value === "secretary") {
					return "Secretário";
				}
				return "Tipo Indefinido";
			} else return "error";
		},
	},
	{
		field: "financeBank",
		headerName: "Banco",
		width: 150,
		editable: true,
		valueGetter: (params) => {
			if (params.value !== undefined) return params.value;
			return params.row.finance.bank;
		},
	},
	{
		field: "financeAgency",
		headerName: "Agencia",
		width: 150,
		editable: true,
		valueGetter: (params) => {
			if (params.value !== undefined) return params.value;
			return params.row.finance.agency;
		},
	},
	{
		field: "Account",
		headerName: "Conta",
		width: 150,
		editable: true,
		valueGetter: (params) => {
			if (params.value !== undefined) return params.value;
			return params.row.finance.account;
		},
	},
	{ field: "pix", headerName: "PIX", width: 150, editable: true },
	{ field: "obs", headerName: "Observação", width: 300, editable: true },
];

const useStyles = makeStyles({
	root: {
		"& .disabled": {
			color: "rgba(0,0,0,0.5)",
			cursor: "not-allowed",
		},
	},
});

export default function Locatarios() {
	const localStorageName = "deleteTenant";

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
	const [Email, setEmail] = useState("");
	const [Crp, setCrp] = useState("");
	const [Type, setType] = useState("");
	const [financeBank, setfinanceBank] = useState("");
	const [financeAgency, setfinanceAgency] = useState("");
	const [financeAccount, setfinanceAccount] = useState("");
	const [Pix, setPix] = useState("");
	const [Obs, setObs] = useState("");

	useEffect(() => {
		setRows([]);
		setLoading(true);
		getTenant((e) => {
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
						//fields: ["name", "birthday", "contact", "address", "cep", "rg"],
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
						handleDeleteTenant();
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
		createTenant(
			(e) => {
				if (e?.data) {
					getTenant((e) => {
						console.log(e);
						setRows(e);
						setLoading(false);
					});
					console.log(e.data);
				} else {
					if (e.response.data.message === "Usuário já existente e deletado") {
						setErr3(true);
					} else {
						setErr4(true);
					}
				}
			},
			{
				name: Name,
				rg: Rg,
				email: Email,
				crp: Crp,
				type: Type,
				finance: {
					bank: financeBank,
					agency: financeAgency,
					account: financeAccount,
				},
				pix: Pix,
				obs: Obs,
			}
		);
	}

	function handleDeleteTenant() {
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

	function _deleteTenant() {
		deleteItem(
			Rows,
			setRows,
			Selected,
			deleteTenant,
			localStorageName,
			setErr2
		);
	}

	const classes = useStyles();

	return (
		<div className={"tenant-container " + classes.root}>
			<div>
				<Dialog
					open={Open}
					onClose={() => {
						setOpen(false);
					}}
				>
					<form onSubmit={handleAddUser}>
						<DialogTitle>Adicionar Colaborador</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Para adicionar um colaborador complete os campos abaixo com as
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
									className="add-user-input"
									id="Email"
									label="Email"
									variant="outlined"
									type="email"
									required
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="CRP"
									label="CRP"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setCrp(e.target.value);
									}}
								/>

								<FormControl variant="outlined" Style="width:212px;">
									<InputLabel id="Tipo">Tipo</InputLabel>
									<Select
										labelId="Tipo"
										id="Tipo"
										value={Type}
										onChange={(e) => setType(e.target.value)}
										label="Tipo"
										variant="outlined"
										className="add-user-input"
									>
										<MenuItem value="" disabled>
											<em>Selecione</em>
										</MenuItem>
										<MenuItem value="tenant">Locatário</MenuItem>
										<MenuItem value="secretary">Secretário</MenuItem>
										<MenuItem value="adm">Administrador</MenuItem>
									</Select>
								</FormControl>

								<TextField
									className="add-user-input"
									id="Banco"
									label="Banco"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setfinanceBank(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="Agencia"
									label="Agencia"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setfinanceAgency(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="Conta"
									label="Conta"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setfinanceAccount(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="PIX"
									label="PIX"
									variant="outlined"
									type="text"
									required
									onChange={(e) => {
										setPix(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="Observacao"
									label="Observação"
									variant="outlined"
									type="text"
									onChange={(e) => {
										setObs(e.target.value);
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
						_deleteTenant();
					}}
					message="Colaborador deletado"
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
									_deleteTenant();
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
						Esse colaborador já está registrado.
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
									deleteUndoTenant(window.location.reload(), { rg: Rg });
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
						editTenant(console.log, { [e.field]: e.value }, e.id);
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
