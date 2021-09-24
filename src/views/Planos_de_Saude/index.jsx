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
	getHealthPlan,
	createHealthPlan,
	editHealthPlan,
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
		field: "consultation",
		headerName: "Valor Consulta",
		width: 200,
		editable: true,
		valueGetter: (params) => {
			if (params.value !== undefined) return params.value;
			return params.row.values.consultation;
		},
	},
	{
		field: "session",
		headerName: "Valor Sessão",
		width: 200,
		editable: true,
		valueGetter: (params) => {
			if (params.value !== undefined) return params.value;
			return params.row.values.session;
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

export default function Planos_de_Saude() {
	const [Rows, setRows] = useState([]);
	const [Loading, setLoading] = useState(false);
	const [Open, setOpen] = useState(false);
	const [Selected, setSelected] = useState([]);
	const [Err4, setErr4] = useState(false);
	const [Snack, setSnack] = useState(false);
	const [Name, setName] = useState("");
	const [ValorC, setValorC] = useState("");
	const [ValorS, setValorS] = useState("");

	useEffect(() => {
		setRows([]);
		setLoading(true);
		getHealthPlan((e) => {
			let str = JSON.stringify(e);
			let aux = JSON.parse(str.replace(/\"_id\":/g, '"id":'));
			console.log(e);
			setRows(aux);
			setLoading(false);
		});
	}, []);

	function CustomToolbar() {
		return (
			<GridToolbarContainer>
				<GridToolbarExport
					csvOptions={{
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
			</GridToolbarContainer>
		);
	}

	function handleAddPlan(e) {
		e.preventDefault();
		setOpen(false);
		createHealthPlan(
			(e) => {
				if (e?.data) {
					getHealthPlan((e) => {
						console.log(e);
						let str = JSON.stringify(e);
						let aux = JSON.parse(str.replace(/\"_id\":/g, '"id":'));
						setRows(aux);
						setLoading(false);
					});
				}
				console.log(e);
			},
			{
				name: Name,
				values: {
					consultation: ValorC,
					session: ValorS,
				},
			}
		);
	}

	const classes = useStyles();

	return (
		<div className={"planos-container " + classes.root}>
			<div>
				<Dialog
					open={Open}
					onClose={() => {
						setOpen(false);
					}}
				>
					<form onSubmit={handleAddPlan}>
						<DialogTitle>Adicionar Plano</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Para adicionar um plano de saúde complete os campos abaixo com
								as informações requeridas.
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
									id="ValorS"
									label="Valor Sessão"
									variant="outlined"
									type="number"
									required
									onChange={(e) => {
										setValorS(e.target.value);
									}}
								/>
								<TextField
									className="add-user-input"
									id="ValorC"
									label="Valor Consulta"
									variant="outlined"
									type="number"
									required
									onChange={(e) => {
										setValorC(e.target.value);
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
					open={Err4}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setErr4(false);
					}}
				>
					<Alert variant="filled" severity="error">
						Esse plano já está registrado.
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
					pageSize={10}
					rowsPerPageOptions={[10]}
					selectionModel={Selected}
					onSelectionModelChange={(e) => {
						setSelected(e);
					}}
					checkboxSelection
					disableSelectionOnClick
					isRowSelectable={(params) => params.row.state !== "deleted"}
					onCellEditCommit={(e) => {
						editHealthPlan(console.log, { [e.field]: e.value }, e.id);
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
