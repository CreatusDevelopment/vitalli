import React, { useEffect, useState } from "react";
import {
	createTheme,
	ThemeProvider,
	makeStyles,
} from "@material-ui/core/styles";
import {
	CalendarToday,
	Storefront,
	Person,
	LocalHospital,
} from "@material-ui/icons";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarExport,
	ptBR,
} from "@mui/x-data-grid";
import {
	getFinance,
	getFinanceTenant,
	getTenant,
	getHealthPlan,
	getFinanceHP,
} from "../../functions";
import { Button, TextField } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import brLocale from "date-fns/locale/pt-BR";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import "./styles.scss";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete } from "@material-ui/lab";

const theme = createTheme(
	{
		palette: {
			primary: { main: "#1976d2" },
		},
	},
	ptBR
);

const useStyles = makeStyles({
	root: {
		"& .disabled": {
			color: "rgba(0,0,0,0.5)",
			cursor: "not-allowed",
		},
	},
});

export default function Financeiro() {
	const [Rows, setRows] = useState([]);
	const [Loading, setLoading] = useState(false);
	const [Selected, setSelected] = useState([]);
	const [OpenStart, setOpenStart] = useState(false);
	const [OpenEnd, setOpenEnd] = useState(false);
	const [Start, setStart] = useState(new Date());
	const [End, setEnd] = useState(new Date());
	const [flag, setflag] = useState(false);
	const [Active, setActive] = useState("clinic");

	const [Tenants, setTenants] = useState([]);
	const [ActivetTenant, setActivetTenant] = useState("");
	const [openTenant, setopenTenant] = useState(false);

	const [HealthPlan, setHealthPlan] = useState([]);
	const [ActiveHP, setActiveHP] = useState("");
	const [openHP, setopenHP] = useState(false);

	const [columns, setcolumns] = useState([
		{ field: "name", headerName: "Nome", width: 250 },
		{
			field: "sessions",
			headerName: "Numero de Sessões",
			width: 230,
		},
		{
			field: "total",
			headerName: "Valor",
			width: 150,
			valueGetter: (params) => {
				if (params.value !== undefined) return `R$ ${params.value}`;
				return `R$ ${params.row.total}`;
			},
		},
		{
			field: "financeBank",
			headerName: "Banco",
			width: 150,
			valueGetter: (params) => {
				if (params.value !== undefined) return params.value;
				return params.row.finance.bank;
			},
		},
		{
			field: "financeAgency",
			headerName: "Agencia",
			width: 150,
			valueGetter: (params) => {
				if (params.value !== undefined) return params.value;
				return params.row.finance.agency;
			},
		},
		{
			field: "Account",
			headerName: "Conta",
			width: 150,
			valueGetter: (params) => {
				if (params.value !== undefined) return params.value;
				return params.row.finance.account;
			},
		},
		{
			field: "pix",
			headerName: "PIX",
			width: 150,
		},
	]);

	const [Change, setChange] = useState(0);
	const [StartCopy, setStartCopy] = useState(new Date());
	const [EndCopy, setEndCopy] = useState(new Date());
	useEffect(() => {
		let copyS = new Date(Start);
		copyS.setMonth(copyS.getMonth() - 1);
		setStartCopy(copyS);

		let copyE = new Date(End);
		copyE.setMonth(copyE.getMonth() - 1);
		setEndCopy(copyE);
	}, [Start, End]);

	useEffect(() => {
		let date = new Date();
		console.log(date);
		let start =
			date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
		console.log(start);

		let end =
			date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
		console.log(end);

		setStart(new Date(date));
		date.setMonth(date.getMonth() + 1);
		setEnd(new Date(date));

		getTenant(setTenants);
		getHealthPlan(setHealthPlan);
		setRows([]);
		setLoading(true);
		getFinance((e) => {
			if (e?.data) {
				setRows(e.data);
			}
			console.log(e);
			setLoading(false);
			setflag(true);
		}, "start=" + start + "&end=" + end);
	}, []);

	useEffect(() => {
		if (flag) {
			let start =
				Start.getDate() + "/" + Start.getMonth() + "/" + Start.getFullYear();

			let end = End.getDate() + "/" + End.getMonth() + "/" + End.getFullYear();

			console.log(start);
			console.log(end);

			setLoading(true);
			setRows([]);
			if (Active === "clinic") {
				getFinance((e) => {
					console.log(e.data);
					setRows(e.data);
					setLoading(false);
				}, "start=" + start + "&end=" + end);
			} else if (Active === "tenant") {
				getFinanceTenant((e) => {
					console.log(e.data);
					setLoading(false);
					setRows(e.data);
				}, "start=" + start + "&end=" + end + "&tenant=" + ActivetTenant);
			} else if (Active === "HP") {
				getFinanceHP((e) => {
					console.log(e.data);
					setLoading(false);
					setRows(e.data);
				}, "start=" + start + "&end=" + end + "&healthplan=" + ActiveHP);
			}
		}
	}, [Start, End, Active, Change]);

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
					className="delete-button datagrid-button"
					size="small"
					color="primary"
					startIcon={<Storefront />}
					onClick={() => {
						handleClicn();
					}}
				>
					Clínca
				</Button>
				<Button
					className="delete-button datagrid-button"
					size="small"
					color="primary"
					startIcon={<Person />}
					onClick={() => {
						handleTenant();
					}}
				>
					Locatário
				</Button>
				<Button
					className="delete-button datagrid-button"
					size="small"
					color="primary"
					startIcon={<LocalHospital />}
					onClick={() => {
						handleHealthPlan();
					}}
				>
					Plano de Saúde
				</Button>

				<Button
					className="delete-button datagrid-button"
					size="small"
					color="primary"
					startIcon={<CalendarToday />}
					onClick={() => {
						setOpenStart(true);
					}}
				>
					Início{" "}
					{Start.getDate() + "/" + Start.getMonth() + "/" + Start.getFullYear()}
				</Button>
				<Button
					className="delete-button datagrid-button"
					size="small"
					color="primary"
					startIcon={<CalendarToday />}
					onClick={() => {
						setOpenEnd(true);
					}}
				>
					Fim {End.getDate() + "/" + End.getMonth() + "/" + End.getFullYear()}
				</Button>
			</GridToolbarContainer>
		);
	}

	function handleClicn() {
		setRows([]);
		setcolumns([
			{ field: "name", headerName: "Nome", width: 250 },
			{
				field: "sessions",
				headerName: "Numero de Sessões",
				width: 230,
			},
			{
				field: "total",
				headerName: "Valor",
				width: 150,
				valueGetter: (params) => {
					if (params.value !== undefined) return `R$ ${params.value}`;
					return `R$ ${params.row.total}`;
				},
			},
			{
				field: "financeBank",
				headerName: "Banco",
				width: 150,
				valueGetter: (params) => {
					if (params.value !== undefined) return params.value;
					return params.row.finance.bank;
				},
			},
			{
				field: "financeAgency",
				headerName: "Agencia",
				width: 150,
				valueGetter: (params) => {
					if (params.value !== undefined) return params.value;
					return params.row.finance.agency;
				},
			},
			{
				field: "Account",
				headerName: "Conta",
				width: 150,
				valueGetter: (params) => {
					if (params.value !== undefined) return params.value;
					return params.row.finance.account;
				},
			},
			{
				field: "pix",
				headerName: "PIX",
				width: 150,
			},
		]);
		setActive("clinic");
	}

	function handleTenant() {
		setopenTenant(true);
	}
	function searchTenant() {
		setRows([]);
		setcolumns([
			{ field: "patient", headerName: "Nome do Paciente", width: 250 },
			{
				field: "guide",
				headerName: "Nº Guia",
				width: 230,
			},
			{
				field: "healthplan",
				headerName: "Convenio",
				width: 150,
			},
			{
				field: "value",
				headerName: "Valor",
				valueFormatter: (params) => {
					return `R$ ${params.value}`;
				},
				width: 150,
			},
		]);
		setActive("tenant");
		setChange(Change + 1);
	}

	function handleHealthPlan() {
		setopenHP(true);
	}
	function searchHP() {
		setRows([]);
		setActive("HP");
		setcolumns([
			{ field: "tenant", headerName: "Locatário", width: 250 },
			{
				field: "guide",
				headerName: "Nº Guia",
				width: 230,
			},
			{
				field: "patient",
				headerName: "Nome do Paciente",
				width: 250,
			},
			{
				field: "value",
				headerName: "Valor",
				valueFormatter: (params) => {
					return `R$ ${params.value}`;
				},
				width: 150,
			},
		]);
		setChange(Change + 1);
	}

	const classes = useStyles();

	return (
		<div className={"pacientes-container " + classes.root}>
			<div Style="display:none;">
				<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
					<DatePicker
						value={StartCopy}
						onChange={(e) => {
							console.log(e);
							let copy = new Date(e);
							copy.setMonth(copy.getMonth() + 1);
							setStart(copy);
						}}
						open={OpenStart}
						onClose={() => {
							setOpenStart(false);
						}}
					/>
					<DatePicker
						value={EndCopy}
						onChange={(e) => {
							console.log(e);
							let copy = new Date(e);
							copy.setMonth(copy.getMonth() + 1);
							setEnd(copy);
						}}
						open={OpenEnd}
						onClose={() => {
							setOpenEnd(false);
						}}
					/>
				</MuiPickersUtilsProvider>
			</div>
			<div>
				<Dialog
					open={openTenant}
					onClose={() => {
						setopenTenant(false);
					}}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Selecione o Locatário"}
					</DialogTitle>
					<DialogContent>
						<Autocomplete
							className="input"
							onChange={(event, value) => setActivetTenant(value?.id)}
							id="Locatario"
							options={Tenants}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => (
								<TextField {...params} label="Locatário" variant="outlined" />
							)}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => {
								setopenTenant(false);
							}}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => {
								setopenTenant(false);
								searchTenant();
							}}
							autoFocus
						>
							Buscar
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={openHP}
					onClose={() => {
						setopenHP(false);
					}}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Selecione o Plano de Saúde"}
					</DialogTitle>
					<DialogContent>
						<Autocomplete
							className="input"
							onChange={(event, value) => setActiveHP(value?._id)}
							id="HP"
							options={HealthPlan}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Planos de Saúde"
									variant="outlined"
								/>
							)}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => {
								setopenHP(false);
							}}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => {
								setopenHP(false);
								searchHP();
							}}
							autoFocus
						>
							Buscar
						</Button>
					</DialogActions>
				</Dialog>
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
					getRowClassName={(e) => {
						if (e.row.state === "deleted") return "disabled";
						return " ";
					}}
				/>
			</ThemeProvider>
		</div>
	);
}
