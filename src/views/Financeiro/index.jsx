import React, { useEffect, useState } from "react";
import {
	createTheme,
	ThemeProvider,
	makeStyles,
} from "@material-ui/core/styles";
import { CalendarToday } from "@material-ui/icons";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarExport,
	ptBR,
} from "@mui/x-data-grid";
import { getFinance } from "../../functions";
import { Button } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import brLocale from "date-fns/locale/pt-BR";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
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
];

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
			getFinance((e) => {
				console.log(e.data);
				setRows(e.data);
				setLoading(false);
			}, "start=" + start + "&end=" + end);
		}
	}, [Start, End]);

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
	const classes = useStyles();

	return (
		<div className={"pacientes-container " + classes.root}>
			<div Style="display:none;">
				<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
					<DatePicker
						value={Start}
						onChange={setStart}
						open={OpenStart}
						onClose={() => {
							setOpenStart(false);
						}}
					/>
					<DatePicker
						value={End}
						onChange={setEnd}
						open={OpenEnd}
						onClose={() => {
							setOpenEnd(false);
						}}
					/>
				</MuiPickersUtilsProvider>
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
					getRowClassName={(e) => {
						if (e.row.state === "deleted") return "disabled";
						return " ";
					}}
				/>
			</ThemeProvider>
		</div>
	);
}
