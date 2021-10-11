import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarExport,
	ptBR,
} from "@mui/x-data-grid";
import {
	createTheme,
	ThemeProvider,
	makeStyles,
} from "@material-ui/core/styles";
import {
	Delete as DeleteIcon,
	DoneOutlined as DoneOutlinedIcon,
	Close as CloseIcon,
} from "@material-ui/icons";
import {
	Button,
	TextField,
	Switch,
	FormControlLabel,
	Checkbox,
	Snackbar,
	IconButton,
} from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import {
	getPatient,
	getHealthPlan,
	getSchedule,
	deleteSchedule as _deleteSchedule,
	confirmSchedule as _confirmSchedule,
	createSchedule,
	preDeleteItem,
	deleteItem,
	undoPreDelete,
	getTenant,
} from "../../functions";
import "react-calendar/dist/Calendar.css";
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
	{
		field: "patient",
		headerName: "Nome",
		width: 150,
	},
	{
		field: "start",
		headerName: "Inicio",
		width: 130,
	},
	{
		field: "end",
		headerName: "Fim",
		width: 130,
	},
	{
		field: "healthplan",
		headerName: "Convenio",
		width: 150,
	},
	{
		field: "guide",
		headerName: "Guia",
		width: 150,
	},
];

const repeatWeek = [
	{ nome: "Segunda-Feira" },
	{ nome: "Terça-Feira" },
	{ nome: "Quarta-Feira" },
	{ nome: "Quinta-Feira" },
	{ nome: "Sexta-Feira" },
	{ nome: "Sábado" },
	{ nome: "Domingo" },
];

const repeatQuantity = [
	{ nome: "1" },
	{ nome: "2" },
	{ nome: "3" },
	{ nome: "4" },
	{ nome: "5" },
	{ nome: "6" },
	{ nome: "7" },
	{ nome: "8" },
	{ nome: "9" },
	{ nome: "10" },
	{ nome: "11" },
	{ nome: "12" },
	{ nome: "13" },
	{ nome: "14" },
	{ nome: "15" },
];

const timeSlots = Array.from(new Array(24 * 2)).map(
	(_, index) =>
		`${index < 20 ? "0" : ""}${Math.floor(index / 2)}:${
			index % 2 === 0 ? "00" : "30"
		}`
);

const newTimeSlots = timeSlots.slice(8, timeSlots?.length - 7);

const useStyles = makeStyles({
	root: {
		"& .confirmed": {
			backgroundColor: "rgba(157, 255, 118, 0.49)",
			color: "#1a3e72",
		},
		"& .deleted": {
			backgroundColor: "#d47483",
			color: "#1a3e72",
		},
		"& .disabled": {
			color: "rgba(0,0,0,0.5)",
			cursor: "not-allowed",
		},
	},
});

export default function Calendario() {
	const localStorageName = "deleteSchedule";
	const classes = useStyles();

	const [value, onChange] = useState(new Date());
	const [Loading, setLoading] = useState(false);
	const [Recorrente, setRecorrente] = useState(false);
	const [Consulta, setConsulta] = useState(false);
	const [DayInfo, setDayInfo] = useState([]);
	const [ScheduleId, setScheduleId] = useState([]);
	const [Patinet, setPatinet] = useState([]);
	const [HealthPlan, setHealthPlan] = useState([]);
	const [Hour, setHour] = useState("");
	const [SendHealth, setSendHealth] = useState("");
	const [SendPatient, setSendPatient] = useState("");
	const [Tenant, setTenant] = useState([]);
	const [TenantID, setTenantID] = useState("");
	const [RecorrentData, setRecorrentData] = useState("");
	const [SnackUndo, setSnackUndo] = useState(false);
	const [SnackErr1, setSnackErr1] = useState(false);
	const [SnackErr2, setSnackErr2] = useState(false);
	const [SnackErr3, setSnackErr3] = useState(false);
	const [SnackErr3Message, setSnackErr3Message] = useState("");
	const [RecorrentQuantity, setRecorrentQuantity] = useState(0);

	function preDeleteSchedule() {
		preDeleteItem(
			DayInfo,
			setDayInfo,
			ScheduleId,
			setScheduleId,
			setSnackErr1,
			setSnackUndo,
			localStorageName
		);
		deleteSchedule();
	}
	function deleteSchedule() {
		deleteItem(
			DayInfo,
			setDayInfo,
			ScheduleId,
			_deleteSchedule,
			localStorageName,
			setSnackErr2
		);
	}
	function confirmSchedule() {
		_confirmSchedule(
			function (e) {
				if (e?.data) {
					for (let i = 0; i < DayInfo?.length; i++) {
						for (let j = 0; j < ScheduleId?.length; j++) {
							if (DayInfo[i].id === ScheduleId[j]) {
								let copy = DayInfo.slice();
								copy[i].state = "confirmed";
								setDayInfo(copy);
							}
						}
					}
					setScheduleId([]);
				} else {
					setSnackErr3Message(e.response.data.message);
					setSnackErr3(true);
				}
			},
			{ ids: ScheduleId }
		);
	}
	function CustomToolbar() {
		return (
			<GridToolbarContainer>
				<GridToolbarExport
					csvOptions={{
						delimiter: ";",
					}}
				/>

				<Button
					className="confirm-button"
					size="small"
					color="primary"
					startIcon={<DoneOutlinedIcon />}
					onClick={confirmSchedule}
				>
					Confirmar
				</Button>

				<Button
					className="delete-button"
					size="small"
					color="primary"
					startIcon={<DeleteIcon />}
					onClick={preDeleteSchedule}
				>
					Deletar
				</Button>
			</GridToolbarContainer>
		);
	}

	useEffect(() => {
		if (
			localStorage.getItem("token") === null ||
			localStorage.getItem("use_type") === null
		) {
			window.location.reload();
		}
		if (JSON.parse(localStorage.getItem(localStorageName) !== null)) {
			_deleteSchedule(
				function (e) {
					localStorage.removeItem(localStorageName);
					if (!e?.data) setSnackErr2(true);
				},
				{ ids: JSON.parse(localStorage.getItem(localStorageName)) }
			);
		}

		getPatient(setPatinet);
		getTenant(setTenant);
		getHealthPlan(setHealthPlan);
	}, []);

	useEffect(() => {
		setDayInfo([]);
		setLoading(true);
		setScheduleId([]);
		getSchedule(
			(e) => {
				console.log(e);
				setDayInfo(e);
				setLoading(false);
			},
			{ date: value, tenant: TenantID === "" ? undefined : TenantID }
		);
	}, [value, TenantID]);

	function handleSubmit(e) {
		e.preventDefault();
		createSchedule(
			function (e) {
				if (e?.data) {
					getSchedule(setDayInfo, {
						date: value,
						tenant: TenantID === "" ? undefined : TenantID,
					});
				} else {
					setSnackErr3Message(e.response.data.message);
					setSnackErr3(true);
				}
			},
			{
				initial: value,
				start: Hour,
				healthplan: SendHealth,
				patient: SendPatient,
				type: Consulta ? "consultation" : "session",
				day: Recorrente ? RecorrentData : null,
				count: Recorrente ? RecorrentQuantity : 1,
				tenant: TenantID === "" ? undefined : TenantID,
			}
		);
	}

	return (
		<div className="calendar-container">
			<div>
				<Snackbar
					open={false}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnackUndo(false);
						deleteSchedule();
					}}
					message="Agenda deletada"
					action={
						<>
							<Button
								color="secondary"
								size="small"
								onClick={(e, r) => {
									if (r === "clickaway") return;
									undoPreDelete(
										DayInfo,
										setDayInfo,
										setSnackUndo,
										localStorageName
									);
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
									setSnackUndo(false);
									deleteSchedule();
								}}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</>
					}
				/>
				<Snackbar
					open={SnackErr1}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnackErr1(false);
					}}
				>
					<Alert variant="filled" severity="error">
						ERRO: Você não pode deletar uma agenda já confirmada!
					</Alert>
				</Snackbar>
				<Snackbar
					open={SnackErr2}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnackErr2(false);
					}}
				>
					<Alert variant="filled" severity="error">
						ERRO: Algo de errado aconteceu ao deletar sua agenda. Tente
						recarregar a página.
					</Alert>
				</Snackbar>
				<Snackbar
					open={SnackErr3}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnackErr3(false);
					}}
				>
					<Alert variant="filled" severity="error">
						{SnackErr3Message}
					</Alert>
				</Snackbar>
			</div>
			<div className="calendar-inner">
				{(localStorage.getItem("use_type") === "adm" ||
					localStorage.getItem("use_type") === "secretary") && (
					<div className="new-apoint">
						<form
							className="outter-form"
							onSubmit={(e) => {
								handleSubmit(e);
							}}
						>
							<p className="title">Nova {Consulta ? "Consulta" : "Sessão"}</p>
							<div>
								<FormControlLabel
									control={
										<Switch
											checked={Recorrente}
											color="primary"
											onChange={() => {
												setRecorrente((prev) => !prev);
											}}
											disabled={Consulta}
										/>
									}
									label="Evento Recorrente"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={Consulta}
											onChange={(event) => {
												setConsulta(event.target.checked);
											}}
											name="sessao"
											color="primary"
										/>
									}
									label="Consulta"
								/>
							</div>
							{Recorrente && (
								<div className="recorrente-div">
									<Autocomplete
										className="input"
										onChange={(event, value) => setRecorrentData(value?.nome)}
										id="semana-de-repeticao"
										options={repeatWeek}
										getOptionLabel={(option) => option.nome}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Repetir todo(a)..."
												variant="outlined"
											/>
										)}
									/>
									<Autocomplete
										className="input"
										onChange={(event, value) => {
											console.log(value?.nome);
											return setRecorrentQuantity(value?.nome);
										}}
										id="quantidade-de-repeticao"
										options={repeatQuantity}
										getOptionLabel={(option) => option.nome}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Repetir..."
												variant="outlined"
												type="number"
											/>
										)}
									/>
								</div>
							)}

							<Autocomplete
								className="input"
								onChange={(event, value) => setSendPatient(value?._id)}
								id="nome-paciente"
								options={Patinet}
								getOptionLabel={(option) => option.name}
								renderInput={(params) => (
									<TextField {...params} label="Paciente" variant="outlined" />
								)}
							/>

							<Autocomplete
								className="input"
								id="disabled-options-demo"
								onChange={(event, value) => setHour(value)}
								options={newTimeSlots}
								getOptionDisabled={(option) => {
									for (let i = 0; i < DayInfo?.length; i++) {
										if (option === DayInfo[i]?.start) {
											return true;
										}
									}
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Horário de inicio"
										variant="outlined"
									/>
								)}
							/>

							<Autocomplete
								className="input"
								onChange={(event, value) => setSendHealth(value?._id)}
								id="convenio"
								options={HealthPlan}
								getOptionLabel={(option) => option.name}
								renderInput={(params) => (
									<TextField {...params} label="Convenios" variant="outlined" />
								)}
							/>

							<Button
								className="input button"
								variant="contained"
								type="submit"
							>
								Enviar
							</Button>
						</form>
					</div>
				)}
				<div className="calendar" Style="display:flex; flex-direction: column;">
					{(localStorage.getItem("use_type") === "adm" ||
						localStorage.getItem("use_type") === "secretary") && (
						<Autocomplete
							Style="width:350px;"
							className="input"
							onChange={(event, value) => setTenantID(value?._id)}
							id="nome-locatario"
							options={Tenant}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => (
								<TextField {...params} label="Locatário" variant="outlined" />
							)}
						/>
					)}
					<Calendar
						onChange={(e) => {
							// console.log(e);
							onChange(e);
						}}
						value={value}
					/>
				</div>
			</div>
			<div className={"datagrid-inner " + classes.root}>
				<ThemeProvider theme={theme}>
					<DataGrid
						loading={Loading}
						components={{
							Toolbar: CustomToolbar,
						}}
						rows={DayInfo}
						columns={columns}
						pageSize={100}
						rowsPerPageOptions={[10, 25, 50, 100, 200]}
						checkboxSelection
						disableSelectionOnClick
						selectionModel={ScheduleId}
						onSelectionModelChange={(e) => {
							setScheduleId(e);
						}}
						isRowSelectable={(params) => params.row.state !== "deleted"}
						getRowClassName={(e) => {
							if (e.row.state === "confirmed") {
								return "confirmed";
							}
							if (e.row.state === "deleted") {
								return "disabled";
							}
							return " ";
						}}
					/>
				</ThemeProvider>
			</div>
		</div>
	);
}
